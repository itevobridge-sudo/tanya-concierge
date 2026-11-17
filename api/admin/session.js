// GET /api/admin/session -> who is signed in, plus setup info
const { send } = require('../../lib/http');
const auth = require('../../lib/auth');
const store = require('../../lib/store');
module.exports = async function handler(req, res) {
    const s = auth.getSession(req);
    send(res, 200, {
        signedIn: Boolean(s), name: s ? s.name : null,
        storage: store.storageMode, demoPassword: auth.usingDemoPassword, passwordConfigured: auth.passwordConfigured
    }, { 'Cache-Control': 'no-store' });
};
