// GET /api/qr?data=...  -> SVG QR code (used by the demo page and print card)
const QRCode = require('qrcode');
const { query } = require('../lib/http');

module.exports = async function handler(req, res) {
    const { data = '', dark = '0f172a' } = query(req);
    if (!data || data.length > 512) { res.statusCode = 400; return res.end('data required (max 512 chars)'); }
    const color = /^[0-9a-f]{6}$/i.test(dark) ? `#${dark}` : '#0f172a';
    const svg = await QRCode.toString(data, { type: 'svg', errorCorrectionLevel: 'M', margin: 1, color: { dark: color, light: '#ffffff' } });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end(svg);
};
