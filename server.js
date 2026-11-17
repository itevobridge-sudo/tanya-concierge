/**
 * Local dev / demo server. Mirrors Vercel: static files from /public with
 * clean URLs, and /api/* routed to the files in /api.
 *   npm start   ->  http://localhost:3000   (admin: /admin, demo: /demo)
 * Not used on Vercel.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };

http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://local');
    try {
        if (url.pathname.startsWith('/api/')) {
            const file = path.join(__dirname, url.pathname.replace(/\/$/, '') + '.js');
            if (!file.startsWith(path.join(__dirname, 'api')) || !fs.existsSync(file)) { res.statusCode = 404; return res.end('Not found'); }
            return await require(file)(req, res);
        }
        let p = path.normalize(path.join(PUB, decodeURIComponent(url.pathname)));
        if (!p.startsWith(PUB)) { res.statusCode = 403; return res.end(); }
        if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
        if (!fs.existsSync(p) && fs.existsSync(p + '.html')) p += '.html';
        if (!fs.existsSync(p)) { res.statusCode = 404; return res.end('Not found'); }
        res.setHeader('Content-Type', TYPES[path.extname(p)] || 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-cache');
        fs.createReadStream(p).pipe(res);
    } catch (e) {
        console.error(e);
        res.statusCode = 500; res.end('Server error');
    }
}).listen(PORT, () => console.log(`Concierge running on http://localhost:${PORT}  (admin: /admin, demo: /demo)`));
