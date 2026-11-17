// POST /api/admin/login {password} -> sets session cookie
const { send, readJson } = require('../../lib/http');
const auth = require('../../lib/auth');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
    if (!auth.passwordConfigured) return send(res, 503, { error: 'ADMIN_PASSWORD is not set in the Vercel project settings.' });
    let body;
    try { body = await readJson(req, 4096); } catch (e) { return send(res, e.status || 400, { error: e.message }); }
    if (!auth.checkPassword(body.password)) {
        await new Promise(r => setTimeout(r, 700)); // slow down guessing
        return send(res, 401, { error: 'Incorrect password.' });
    }
    const name = String(body.name || 'Staff').slice(0, 40);
    send(res, 200, { ok: true, name }, { 'Set-Cookie': auth.sessionCookie(req, name) });
};
