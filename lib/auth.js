/**
 * Admin authentication: one shared staff password (ADMIN_PASSWORD env var),
 * exchanged for a signed, HttpOnly session cookie valid for 12 hours.
 * Changing ADMIN_PASSWORD (or SESSION_SECRET) signs everyone out.
 *
 * Local demo only: if ADMIN_PASSWORD is not set and the app is not running
 * on Vercel, the password "demo1234" is accepted.
 */
const crypto = require('crypto');
const { cookies } = require('./http');

const COOKIE = 'azc_session';
const TTL_MS = 12 * 60 * 60 * 1000;
const onVercel = Boolean(process.env.VERCEL);
const PASSWORD = process.env.ADMIN_PASSWORD || (onVercel ? '' : 'demo1234');
const usingDemoPassword = !process.env.ADMIN_PASSWORD && !onVercel;

function key() {
    return crypto.createHash('sha256').update(`azc|${PASSWORD}|${process.env.SESSION_SECRET || ''}`).digest();
}
function sign(payload) {
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const mac = crypto.createHmac('sha256', key()).update(body).digest('base64url');
    return `${body}.${mac}`;
}
function verify(token) {
    if (!token || !PASSWORD) return null;
    const [body, mac] = token.split('.');
    if (!body || !mac) return null;
    const expected = crypto.createHmac('sha256', key()).update(body).digest('base64url');
    if (mac.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
    try {
        const p = JSON.parse(Buffer.from(body, 'base64url').toString());
        return p.exp > Date.now() ? p : null;
    } catch { return null; }
}

function checkPassword(input) {
    if (!PASSWORD || typeof input !== 'string') return false;
    const a = crypto.createHash('sha256').update(input).digest();
    const b = crypto.createHash('sha256').update(PASSWORD).digest();
    return crypto.timingSafeEqual(a, b);
}

function cookieAttrs(req, maxAgeSec) {
    const secure = onVercel || (req.headers['x-forwarded-proto'] === 'https');
    return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSec}${secure ? '; Secure' : ''}`;
}
function sessionCookie(req, name) {
    return `${COOKIE}=${sign({ name, exp: Date.now() + TTL_MS })}; ${cookieAttrs(req, TTL_MS / 1000)}`;
}
function clearCookie(req) {
    return `${COOKIE}=; ${cookieAttrs(req, 0)}`;
}
function getSession(req) {
    return verify(cookies(req)[COOKIE]);
}

module.exports = { checkPassword, sessionCookie, clearCookie, getSession, passwordConfigured: Boolean(PASSWORD), usingDemoPassword };
