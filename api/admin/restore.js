// POST /api/admin/restore -> put the previous published version back live
const { send } = require('../../lib/http');
const auth = require('../../lib/auth');
const store = require('../../lib/store');
module.exports = async function handler(req, res) {
    if (!auth.getSession(req)) return send(res, 401, { error: 'Please sign in again.' });
    if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
    try { const saved = await store.restorePrevious(); send(res, 200, { ok: true, meta: saved.meta }); }
    catch (e) { send(res, e.status || 500, { error: e.message }); }
};
