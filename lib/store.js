/**
 * Content store.
 *
 * Production: Upstash Redis over its REST API (connect it from the Vercel
 * Marketplace; Vercel then injects KV_REST_API_URL / KV_REST_API_TOKEN,
 * or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
 *
 * Local / demo: a JSON file in ./data, so the app works with no account.
 *
 * The whole guest content lives in one JSON document. Every publish keeps
 * the previous version, so one bad edit can be undone from the admin.
 */
const fs = require('fs');
const path = require('path');
const seed = require('./seed.json');

const KEY = 'azc:content';
const PREV_KEY = 'azc:content:prev';
const DATA_DIR = path.join(process.cwd(), 'data');

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = Boolean(REDIS_URL && REDIS_TOKEN);
const onVercel = Boolean(process.env.VERCEL);

async function redis(cmd) {
    const r = await fetch(REDIS_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(cmd)
    });
    if (!r.ok) throw new Error(`Storage error (${r.status})`);
    const j = await r.json();
    if (j.error) throw new Error(`Storage error: ${j.error}`);
    return j.result;
}

function fileRead(name) {
    try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf8')); }
    catch { return null; }
}
function fileWrite(name, obj) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(path.join(DATA_DIR, name), JSON.stringify(obj, null, 2));
}

async function getRaw(key, file) {
    if (useRedis) { const v = await redis(['GET', key]); return v ? JSON.parse(v) : null; }
    return fileRead(file);
}
async function setRaw(key, file, obj) {
    if (useRedis) return redis(['SET', key, JSON.stringify(obj)]);
    if (onVercel) {
        throw Object.assign(new Error('No storage connected. Connect Upstash Redis in the Vercel project before publishing.'), { status: 503 });
    }
    return fileWrite(file, obj);
}

async function getContent() {
    return (await getRaw(KEY, 'content.json')) || JSON.parse(JSON.stringify(seed));
}
async function getPrevious() {
    return getRaw(PREV_KEY, 'content.prev.json');
}
async function saveContent(next, by = 'admin') {
    const current = await getContent();
    next.meta = { version: ((current.meta && current.meta.version) || 0) + 1, updatedAt: new Date().toISOString(), updatedBy: by };
    await setRaw(PREV_KEY, 'content.prev.json', current);
    await setRaw(KEY, 'content.json', next);
    return next;
}
async function restorePrevious() {
    const prev = await getPrevious();
    if (!prev) throw Object.assign(new Error('There is no earlier version to restore.'), { status: 404 });
    return saveContent(prev, 'restore');
}

module.exports = { getContent, getPrevious, saveContent, restorePrevious, storageMode: useRedis ? 'redis' : (onVercel ? 'none' : 'local-file') };
