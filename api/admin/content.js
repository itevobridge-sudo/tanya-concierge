// GET  /api/admin/content -> current content + whether an undo version exists
// PUT  /api/admin/content -> validate and publish
const { send, readJson } = require('../../lib/http');
const auth = require('../../lib/auth');
const store = require('../../lib/store');
const { validate } = require('../../lib/validate');

module.exports = async function handler(req, res) {
    const s = auth.getSession(req);
    if (!s) return send(res, 401, { error: 'Please sign in again.' }, { 'Cache-Control': 'no-store' });
    try {
        if (req.method === 'GET') {
            const [content, prev] = await Promise.all([store.getContent(), store.getPrevious()]);
            return send(res, 200, { content, hasPrevious: Boolean(prev), previousUpdatedAt: prev && prev.meta ? prev.meta.updatedAt : null }, { 'Cache-Control': 'no-store' });
        }
        if (req.method === 'PUT') {
            const body = await readJson(req);
            const errors = validate(body.content);
            if (errors.length) return send(res, 422, { error: 'Please fix the highlighted problems.', errors });
            const saved = await store.saveContent(body.content, s.name);
            return send(res, 200, { ok: true, meta: saved.meta });
        }
        send(res, 405, { error: 'Method not allowed' });
    } catch (e) {
        send(res, e.status || 500, { error: e.message });
    }
};
