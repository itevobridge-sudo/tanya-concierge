// Small helpers so every handler runs the same way on Vercel and on the
// local dev server (server.js). Only plain Node request/response APIs are used.

function send(res, status, data, headers = {}) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
    res.end(JSON.stringify(data));
}

async function readJson(req, limit = 600 * 1024) {
    if (req.body && typeof req.body === 'object') return req.body; // Vercel pre-parsed
    if (typeof req.body === 'string') return JSON.parse(req.body);
    return new Promise((resolve, reject) => {
        let size = 0;
        const chunks = [];
        req.on('data', c => {
            size += c.length;
            if (size > limit) { reject(Object.assign(new Error('Payload too large'), { status: 413 })); req.destroy(); return; }
            chunks.push(c);
        });
        req.on('end', () => {
            try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); }
            catch (e) { reject(Object.assign(new Error('Invalid JSON'), { status: 400 })); }
        });
        req.on('error', reject);
    });
}

function query(req) {
    return Object.fromEntries(new URL(req.url, 'http://local').searchParams);
}

function cookies(req) {
    const out = {};
    (req.headers.cookie || '').split(';').forEach(p => {
        const i = p.indexOf('=');
        if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
    });
    return out;
}

module.exports = { send, readJson, query, cookies };
