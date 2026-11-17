// POST /api/admin/logout
const { send } = require('../../lib/http');
const auth = require('../../lib/auth');
module.exports = async function handler(req, res) {
    send(res, 200, { ok: true }, { 'Set-Cookie': auth.clearCookie(req) });
};
