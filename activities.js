/**
 * /api/activities
 * ----------------------------------------------------------------
 * Fetches the live activity list from Heritage Expeditions Africa's
 * Victoria Falls destination page and returns it as clean JSON for
 * the concierge app to render.
 *
 * WHY THIS LIVES ON THE SERVER (not fetched directly from the
 * browser): heritageexpeditionsafrica.com does not send CORS
 * headers that would let a page on another domain (our Vercel app)
 * fetch it directly with client-side JavaScript. Doing the fetch
 * here, server-to-server, avoids that entirely.
 *
 * CACHING: we ask Vercel's CDN to cache the response for 12 hours
 * and keep serving a stale copy for up to another 24 hours while it
 * refreshes in the background. That means guests get an instant
 * response, and Heritage's site only gets hit a couple of times a
 * day, not once per QR scan.
 *
 * FRAGILITY WARNING: this parses Heritage's public HTML because
 * they don't offer a public API. If they redesign that page, this
 * parser can start returning fewer/zero results. That's expected
 * and handled gracefully — see index.html, which falls back to the
 * curated activity list in config.json whenever this endpoint
 * fails or returns nothing usable. If that starts happening, this
 * file is the first place to check; the SOURCE_URL and the regexes
 * below are the only things that should need adjusting.
 */

const SOURCE_URL = "https://www.heritageexpeditionsafrica.com/destinations/victoria-falls";
const SITE_ORIGIN = "https://www.heritageexpeditionsafrica.com";

function stripTags(html) {
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();
}

function classify(name) {
    const n = name.toLowerCase();
    if (n.includes("cruise")) return "cruises";
    if (n.includes("helicopter") || n.includes("flight")) return "flights";
    if (["bungee", "gorge swing", "zip line", "zip", "rafting", "canopy", "jet boat", "flying fox", "quad"].some(k => n.includes(k))) return "adrenaline";
    if (["game drive", "walk", "elephant", "chobe", "safari", "lion", "cheetah"].some(k => n.includes(k))) return "safari";
    if (["tour", "bike", "tram", "dinner"].some(k => n.includes(k))) return "tours";
    return "other";
}

function parseActivities(html) {
    const anchorPattern = /<a\b[^>]*href="(\/(?:activity|tour)\/[a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    const seen = new Set();
    const results = [];
    let match;

    while ((match = anchorPattern.exec(html)) !== null) {
        const path = match[1];
        const text = stripTags(match[2]);
        if (!text || seen.has(path)) continue;

        const priceMatch = text.match(/From\s*\$\s*([0-9][0-9,.]*)/i);
        if (!priceMatch) continue; // not an activity card (nav link, footer link, etc.)

        const refMatch = text.match(/HXA-[A-Za-z0-9-]+/);
        const durationMatch = text.match(/\b(\d+h(?:\s?\d+m)?|\d+\s?min)\b/);

        // Name is whatever text comes before the duration marker (or before
        // "Package" if no duration is shown for that listing).
        let name = text;
        const cutIndex = durationMatch ? text.indexOf(durationMatch[0]) : text.indexOf("Package");
        if (cutIndex > 0) name = text.slice(0, cutIndex).trim();
        name = name.replace(/\s{2,}/g, " ").trim();
        // Some cards repeat the name verbatim (e.g. no duration shown between
        // the two occurrences) — collapse "X X" down to "X".
        const words = name.split(" ");
        if (words.length % 2 === 0) {
            const half = words.length / 2;
            const first = words.slice(0, half).join(" ");
            const second = words.slice(half).join(" ");
            if (first && first === second) name = first;
        }
        if (!name) continue;

        seen.add(path);
        results.push({
            name,
            duration: durationMatch ? durationMatch[0] : "",
            price: "US$" + priceMatch[1],
            reference: refMatch ? refMatch[0] : "",
            url: SITE_ORIGIN + path,
            category: classify(name)
        });
    }

    return results;
}

module.exports = async function handler(req, res) {
    try {
        const upstream = await fetch(SOURCE_URL, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; AZambeziConciergeBot/1.0)" }
        });

        if (!upstream.ok) {
            throw new Error(`Upstream responded ${upstream.status}`);
        }

        const html = await upstream.text();
        const activities = parseActivities(html);

        if (activities.length === 0) {
            throw new Error("Parsed zero activities — source page structure may have changed");
        }

        res.setHeader("Cache-Control", "public, s-maxage=43200, stale-while-revalidate=86400");
        res.status(200).json({
            source: SOURCE_URL,
            fetchedAt: new Date().toISOString(),
            count: activities.length,
            activities
        });
    } catch (err) {
        res.setHeader("Cache-Control", "no-store");
        res.status(502).json({ error: err.message });
    }
};
