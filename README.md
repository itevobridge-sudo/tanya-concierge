# A'Zambezi River Lodge: Guest Concierge (v2)

A mobile-first guest concierge web app with an admin backend. Lodge staff can change hours, contacts, WiFi details, the menu, activities and other content from their phone, without editing any code.

| Address | Purpose |
|---|---|
| `/` | Guest concierge (opened from the QR code or the WiFi sign-in window) |
| `/admin` | Staff admin (password protected) |
| `/demo` | QR card and WiFi journey simulation, for presentations and printing |

## What changed from v1

- All content is now stored in a backend and edited in `/admin`. `config.json` and the duplicate copy inside `index.html` are no longer used.
- Departure is now 10:00. The bar (10:00 to 22:00) and the pool (08:00 to 22:00) are listed separately.
- A live "Today at the lodge" strip shows what is open now, in Victoria Falls time.
- The guest's name and room are added to every WhatsApp message (orders, activities, taxi, late check-out). They are stored on the guest's phone only.
- Menu items can be marked "sold out today". Orders on dishes such as "Chef's Cake" no longer break.
- Activities are shown as up to six featured cards plus a "Browse all" link. Every Heritage link carries a tracking tag (`utm_source=azambezi-concierge`). The scraper (`activities.js`) has been removed.
- The phone's back button now closes screens instead of leaving the app. Returning guests go straight to the home screen.
- Shuttle notes are now visible and translated. The next departure is highlighted.
- An announcement banner, a late check-out request and a WiFi join QR code have been added.
- The Tailwind and icon CDNs have been removed, so the app loads faster and cannot be broken by a third-party update.

## Deploying on Vercel

1. **Push this folder to a GitHub repository** and import it into Vercel. No build settings are needed (`vercel.json` already sets them).
2. **Connect storage.** In the Vercel project, open *Storage*, choose *Upstash* (Redis) from the Marketplace, and connect it to the project. The free tier is sufficient. Vercel adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
3. **Set environment variables** under *Settings > Environment Variables*:
   - `ADMIN_PASSWORD`: the staff password for `/admin` (use at least 12 characters).
   - `SESSION_SECRET`: any long random string. Changing it signs everyone out.
4. **Redeploy**, then sign in at `/admin`. Work through the setup checklist on the Overview screen.

Until storage is connected, the guest app shows the default content and publishing is disabled in the admin.

## Running locally (demo mode)

```bash
npm install
npm start
```

Open `http://localhost:3000`. The admin password is `demo1234`, and changes are saved to `data/content.json`. Delete the `data` folder to reset to the default content.

## Before going live

The admin's setup checklist flags these items:

- **WhatsApp number:** still the placeholder `263772123456`. Guest messages will not reach the lodge until it is changed.
- **Partner card:** the link is still `example.com`. Update it, or hide the card.
- **Translations:** new or edited text should also be translated. If a translation is left empty, English is shown.
- **Marketing claim:** the old "only river-front lodge in Victoria Falls" line was replaced with a neutral tagline. It can be changed under *Lodge & Partner* once the claim is confirmed by the lodge.

## WiFi redirect (captive portal)

The automatic redirect after a guest joins the WiFi is configured on the lodge's network controller, not in this app. When access is available:

- Set the captive portal or splash page URL to `https://<your-domain>/?src=portal`.
- Allow these domains before sign-in: the app domain, `fonts.googleapis.com`, `fonts.gstatic.com`, `i.ibb.co` and `images.unsplash.com`.

The `src=portal` tag makes the app suggest opening in the phone's browser, because WiFi sign-in windows block some links (WhatsApp, for example). The `/demo` page lists the same notes.

## Project structure

```
api/
  content.js          GET  public content for the guest app (cached ~15 s at the edge)
  qr.js               GET  QR code as SVG (?data=...)
  admin/login.js      POST sign in (sets an HttpOnly session cookie, 12 h)
  admin/logout.js     POST sign out
  admin/session.js    GET  sign-in status and storage mode
  admin/content.js    GET/PUT  read and publish content (validated before saving)
  admin/restore.js    POST restore the previous published version
lib/
  store.js            Upstash Redis storage, or a local file in demo mode
  auth.js             password check and signed session cookie
  validate.js         checks times, links and required fields before publishing
  seed.json           default content, used until the first publish
public/
  index.html, app.js, app.css     guest app
  admin.html, admin.js, admin.css admin
  demo.html                       QR card and journey simulation
  icons.js                        built-in icon set
server.js             local server only (not used on Vercel)
```

## Known limits

- One shared admin password. Individual staff logins can be added later.
- Images are added by link. Direct photo upload can be added later (for example with Vercel Blob).
- Repeated wrong passwords are slowed down, but not locked out across server instances.
- The guest's name and room never leave their phone unless they send a WhatsApp message.
