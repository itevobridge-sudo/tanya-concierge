// GET /api/content : public guest content (read by the concierge app)
const { send } = require('../lib/http');
const store = require('../lib/store');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
    try {
        const content = await store.getContent();
        // Short CDN cache: an admin publish reaches guests within ~15 seconds.
        send(res, 200, content, { 'Cache-Control': 'public, max-age=0, s-maxage=15, stale-while-revalidate=60' });
    } catch (e) {
        send(res, 500, { error: e.message }, { 'Cache-Control': 'no-store' });
    }
};
