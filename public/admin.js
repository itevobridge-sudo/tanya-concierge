/* Concierge admin. A schema describes each section, and the form is built from
 * it, so adding a field later means adding one line to SECTIONS below.
 * Edits are kept as a draft in the browser until "Publish" is pressed.
 */
(function () {
    'use strict';
    const LANGS = ['fr', 'de', 'zh'];
    const LNAME = { fr: 'FR', de: 'DE', zh: 'ZH' };
    const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
    const ICONS = ['compass', 'ship', 'plane', 'droplets', 'binoculars', 'waves', 'flame', 'bus', 'utensils', 'sparkles'];
    const PLACEHOLDER_WA = '263772123456';

    const L = (v = '') => ({ en: v, fr: '', de: '', zh: '' });
    const uid = (p) => p + Math.random().toString(36).slice(2, 7);
    const lt = (o) => (o && typeof o === 'object' ? o.en : o) || '';

    // ------------------------------------------------------------------
    // Field types: text, area, url, time, tel, bool, select, l (localised line),
    // la (localised paragraph), list (repeating group), strlist (list of lines)
    // ------------------------------------------------------------------
    const SECTIONS = [
        { id: 'overview', title: 'Overview', icon: 'list', intro: 'Status, setup checklist and quick links.' },
        {
            id: 'hours', title: 'Hours', icon: 'clock', intro: 'Shown live on the guest home screen ("Open until 22:00"). Use 24-hour time.',
            cards: [
                { title: 'Departure', fields: [
                    { k: 'departure.time', t: 'time', label: 'Departure (check-out) time' },
                    { k: 'departure.lateCheckout', t: 'bool', label: 'Show "Request a late check-out" button' }
                ] },
                { title: 'Opening hours', fields: [
                    { k: 'hours', t: 'list', addLabel: 'Add opening hours', title: i => lt(i.label) || 'New', sub: i => `${i.open || '--:--'} to ${i.close || '--:--'}${i.show === false ? ' · hidden' : ''}`,
                      add: () => ({ id: uid('h-'), label: L(''), open: '08:00', close: '17:00', show: true }),
                      item: [
                        { k: 'label', t: 'l', label: 'Name (e.g. Lunch)' },
                        { t: 'row', fields: [{ k: 'open', t: 'time', label: 'Opens' }, { k: 'close', t: 'time', label: 'Closes' }] },
                        { k: 'show', t: 'bool', label: 'Show on guest home screen' }
                      ] }
                ] }
            ]
        },
        {
            id: 'notice', title: 'Announcement', icon: 'megaphone', intro: 'A banner at the top of the guest home screen. Use it for tonight\'s event, a closure or a special.',
            cards: [{ title: 'Banner', fields: [
                { k: 'announcement.enabled', t: 'bool', label: 'Show the banner' },
                { k: 'announcement.text', t: 'la', label: 'Message' }
            ] }]
        },
        {
            id: 'contacts', title: 'Contacts & WiFi', icon: 'phone', intro: 'Every WhatsApp button in the app sends to this number.',
            cards: [
                { title: 'Contacts', fields: [
                    { k: 'contacts.whatsapp', t: 'tel', label: 'WhatsApp number', help: 'Digits only, with country code and no "+" (e.g. 263771234567).' },
                    { k: 'contacts.frontDesk', t: 'text', label: 'Reception number (as displayed)' },
                    { k: 'contacts.frontDeskDial', t: 'text', label: 'Reception number (for dialling)', help: 'International format, e.g. +263832844561.' },
                    { k: 'contacts.email', t: 'text', label: 'Email' }
                ] },
                { title: 'Guest WiFi', fields: [
                    { k: 'wifi.ssid', t: 'text', label: 'Network name' },
                    { k: 'wifi.password', t: 'text', label: 'Password' },
                    { k: 'wifi.security', t: 'select', label: 'Security', options: [['WPA', 'WPA / WPA2 / WPA3'], ['WEP', 'WEP'], ['nopass', 'Open (no password)']] }
                ] }
            ]
        },
        {
            id: 'directory', title: 'Directory', icon: 'phone', intro: 'Room-phone extensions shown to guests. Keep this to guest-facing lines only.',
            cards: [{ title: 'Extensions', fields: [
                { k: 'directory', t: 'list', addLabel: 'Add extension', title: i => lt(i.name) || 'New', sub: i => i.ext,
                  add: () => ({ name: L(''), ext: '' }),
                  item: [{ k: 'name', t: 'l', label: 'Department' }, { k: 'ext', t: 'text', label: 'Extension' }] }
            ] }]
        },
        {
            id: 'shuttle', title: 'Shuttle', icon: 'bus', intro: 'The next departure is worked out automatically from these times.',
            cards: [
                { title: 'Details', fields: [
                    { k: 'shuttle.heading', t: 'l', label: 'Heading' },
                    { k: 'shuttle.bannerImage', t: 'url', label: 'Banner image link' },
                    { k: 'shuttle.route', t: 'strlist', label: 'Route stops (in order)', addLabel: 'Add stop' }
                ] },
                { title: 'Timetable', fields: [
                    { k: 'shuttle.schedule', t: 'list', addLabel: 'Add departure', title: i => `${i.toRainforest || '--:--'} → ${i.fromRainforest || '--:--'}`, sub: () => '',
                      add: () => ({ toRainforest: '10:05', fromRainforest: '10:50' }),
                      item: [{ t: 'row', fields: [{ k: 'toRainforest', t: 'time', label: 'To Rainforest' }, { k: 'fromRainforest', t: 'time', label: 'From Rainforest' }] }] }
                ] },
                { title: 'Notes for guests', fields: [
                    { k: 'shuttle.notes', t: 'list', addLabel: 'Add note', title: i => lt(i) || 'New note', sub: () => '', add: () => L(''),
                      item: [{ k: null, t: 'la', label: 'Note' }] }
                ] }
            ]
        },
        {
            id: 'menu', title: 'Menu', icon: 'utensils', intro: 'Mark items sold out for the day instead of deleting them.',
            cards: [
                { title: 'Restaurant', fields: [
                    { k: 'menu.name', t: 'text', label: 'Restaurant name' },
                    { k: 'menu.bannerImage', t: 'url', label: 'Banner image link' },
                    { k: 'menu.allergyNote', t: 'la', label: 'Allergy note' }
                ] },
                { title: 'Categories', fields: [
                    { k: 'menu.categories', t: 'list', addLabel: 'Add category', title: i => lt(i.label) || 'New category',
                      sub: i => `${(i.items || []).length} items${(i.items || []).some(x => x.soldOut) ? ' · some sold out' : ''}`,
                      add: () => ({ id: uid('c-'), label: L(''), note: L(''), served: '', items: [] }),
                      item: [
                        { k: 'label', t: 'l', label: 'Category name' },
                        { k: 'served', t: 'select', label: 'Serving times label', options: d => [['', 'None']].concat((d.hours || []).map(h => [h.id, `${lt(h.label)} (${h.open} to ${h.close})`])) },
                        { k: 'note', t: 'l', label: 'Category note (optional)' },
                        { k: 'items', t: 'list', addLabel: 'Add dish', title: i => i.name || 'New dish', sub: i => `${i.price || ''}${i.soldOut ? ' · SOLD OUT' : ''}`, tag: i => i.soldOut ? 'Sold out' : '',
                          add: () => ({ name: '', desc: '', price: 'US$', soldOut: false }),
                          item: [
                            { k: 'name', t: 'text', label: 'Dish name' },
                            { k: 'desc', t: 'area', label: 'Description' },
                            { k: 'price', t: 'text', label: 'Price' },
                            { k: 'soldOut', t: 'bool', label: 'Sold out today' }
                          ] }
                      ] }
                ] }
            ]
        },
        {
            id: 'activities', title: 'Activities', icon: 'compass', intro: 'Up to six featured activities. Every link opens Heritage Expeditions with a tracking tag, so referrals from the app can be measured.',
            cards: [
                { title: 'Provider', fields: [
                    { k: 'activities.provider', t: 'text', label: 'Provider name' },
                    { k: 'activities.tagline', t: 'l', label: 'Tagline' },
                    { k: 'activities.bannerImage', t: 'url', label: 'Banner image link' },
                    { k: 'activities.browseUrl', t: 'url', label: '"Browse all activities" link' },
                    { t: 'row', fields: [{ k: 'activities.deskExt', t: 'text', label: 'Heritage Desk extension' }, { k: 'activities.utmSource', t: 'text', label: 'Tracking tag' }] }
                ] },
                { title: 'Featured activities', fields: [
                    { k: 'activities.featured', t: 'list', max: 6, addLabel: 'Add featured activity', title: i => i.name || 'New activity', sub: () => '',
                      add: () => ({ name: '', blurb: L(''), icon: 'compass', image: '', url: 'https://www.heritageexpeditionsafrica.com/' }),
                      item: [
                        { k: 'name', t: 'text', label: 'Activity name' },
                        { k: 'blurb', t: 'l', label: 'One-line description' },
                        { k: 'url', t: 'url', label: 'Heritage page link' },
                        { k: 'image', t: 'url', label: 'Photo link (optional)', help: 'If empty, an icon is shown instead.' },
                        { k: 'icon', t: 'select', label: 'Icon', options: ICONS.map(i => [i, i]) }
                      ] }
                ] }
            ]
        },
        {
            id: 'about', title: 'About', icon: 'info', intro: 'The "About the lodge" tabs. Dining hours are added to the Dining tab automatically from the Hours section.',
            cards: [{ title: 'Tabs', fields: [
                { k: 'about.categories', t: 'list', addLabel: 'Add tab', title: i => lt(i.label) || 'New tab', sub: i => `${(i.paragraphs || []).length} paragraphs · ${(i.rows || []).length} rows`,
                  add: () => ({ id: uid('a-'), label: L(''), paragraphs: [], rows: [] }),
                  item: [
                    { k: 'label', t: 'l', label: 'Tab name' },
                    { k: 'paragraphs', t: 'list', addLabel: 'Add paragraph', title: i => lt(i).slice(0, 60) || 'New paragraph', sub: () => '', add: () => L(''), item: [{ k: null, t: 'la', label: 'Paragraph' }] },
                    { k: 'rows', t: 'list', addLabel: 'Add row', title: i => lt(i.label) || 'New row', sub: i => i.value || '',
                      add: () => ({ label: L(''), value: '', href: '' }),
                      item: [{ k: 'label', t: 'l', label: 'Label' }, { k: 'value', t: 'text', label: 'Value (optional)' }, { k: 'href', t: 'url', label: 'Link (optional: https://, tel: or mailto:)' }] }
                  ] }
            ] }]
        },
        {
            id: 'guidelines', title: 'Guidelines', icon: 'shield', intro: 'Guest guidelines and house rules.',
            cards: [{ title: 'Guidelines', fields: [
                { k: 'policies', t: 'list', addLabel: 'Add guideline', title: i => lt(i.title) || 'New guideline', sub: () => '',
                  add: () => ({ title: L(''), desc: L('') }),
                  item: [{ k: 'title', t: 'l', label: 'Title' }, { k: 'desc', t: 'la', label: 'Text' }] }
            ] }]
        },
        {
            id: 'lodge', title: 'Lodge & Partner', icon: 'sparkles', intro: 'Branding and the partner card on the welcome and home screens.',
            cards: [
                { title: 'Lodge', fields: [
                    { k: 'hotel.name', t: 'text', label: 'Lodge name' },
                    { k: 'hotel.tagline', t: 'l', label: 'Welcome tagline' },
                    { k: 'hotel.address', t: 'text', label: 'Address' },
                    { k: 'hotel.logoUrl', t: 'url', label: 'Logo image link' },
                    { k: 'hotel.heroImage', t: 'url', label: 'Welcome photo link' }
                ] },
                { title: 'Partner card', fields: [
                    { k: 'sponsor.enabled', t: 'bool', label: 'Show the partner card' },
                    { k: 'sponsor.title', t: 'l', label: 'Service' },
                    { k: 'sponsor.company', t: 'text', label: 'Company' },
                    { k: 'sponsor.image', t: 'url', label: 'Image link' },
                    { k: 'sponsor.link', t: 'url', label: 'Website link' }
                ] }
            ]
        }
    ];

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    const S = {
        session: null, draft: null, meta: null, hasPrev: false, prevAt: null,
        sec: (location.hash || '#overview').slice(1), dirty: false, open: new Set(), tr: new Set(),
        errors: [], busy: false, preview: false, previewLang: 'en', toast: ''
    };
    const root = document.getElementById('admin');
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const get = (o, p) => p === '' ? o : p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
    function set(o, p, v) {
        const ks = p.split('.'); let a = o;
        for (let i = 0; i < ks.length - 1; i++) a = a[ks[i]];
        a[ks[ks.length - 1]] = v;
    }
    const join = (base, k) => (k == null ? base : (base ? `${base}.${k}` : k));

    async function api(path, opts = {}) {
        const r = await fetch(path, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...opts });
        const j = await r.json().catch(() => ({}));
        if (r.status === 401 && path !== '/api/admin/login') { S.session = { signedIn: false }; render(); }
        if (!r.ok) throw Object.assign(new Error(j.error || `Error ${r.status}`), { data: j });
        return j;
    }
    function toast(m) { S.toast = m; renderToast(); clearTimeout(toast.t); toast.t = setTimeout(() => { S.toast = ''; renderToast(); }, 3200); }
    function renderToast() {
        let el = document.getElementById('toast');
        if (!S.toast) { if (el) el.remove(); return; }
        if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
        el.textContent = S.toast;
    }

    // ------------------------------------------------------------------
    // Field rendering
    // ------------------------------------------------------------------
    const titleFns = {};
    function missing(o) { return o && typeof o === 'object' && String(o.en || '').trim() ? LANGS.filter(l => !String(o[l] || '').trim()).length : 0; }

    function fLocal(f, path, area) {
        const v = get(S.draft, path) || {};
        const open = S.tr.has(path);
        const miss = missing(v);
        const ctl = (lang, val) => area
            ? `<textarea class="ta" data-path="${path}.${lang}" rows="3">${esc(val)}</textarea>`
            : `<input class="in" data-path="${path}.${lang}" value="${esc(val)}">`;
        return `<div class="f"><div class="lbl">${esc(f.label)} <span class="tag muted">EN</span></div>${ctl('en', v.en || '')}
            <button class="tr-toggle ${miss ? 'tr-missing' : ''}" data-act="tr" data-path="${path}">${icon(open ? 'chevronUp' : 'chevronDown', 14)} Translations ${miss ? `(${miss} missing, English is shown)` : (String(v.en || '').trim() ? '(complete)' : '')}</button>
            ${open ? `<div class="tr">${LANGS.map(l => `<label><b>${LNAME[l]}</b>${ctl(l, v[l] || '')}</label>`).join('')}</div>` : ''}</div>`;
    }

    function field(f, base) {
        if (f.t === 'row') return `<div class="row2">${f.fields.map(x => field(x, base)).join('')}</div>`;
        const path = join(base, f.k);
        const v = get(S.draft, path);
        const help = f.help ? `<div class="help">${esc(f.help)}</div>` : '';
        switch (f.t) {
            case 'l': return fLocal(f, path, false);
            case 'la': return fLocal(f, path, true);
            case 'bool': return `<label class="f sw"><span class="lbl">${esc(f.label)}</span><span class="toggle"><input type="checkbox" data-path="${path}" ${v ? 'checked' : ''}><span></span></span></label>`;
            case 'time': return `<label class="f"><span class="lbl">${esc(f.label)}</span><input class="in ${TIME.test(v || '') ? '' : 'bad'}" type="text" inputmode="numeric" placeholder="HH:MM" maxlength="5" data-path="${path}" data-kind="time" value="${esc(v)}">${help}</label>`;
            case 'area': return `<label class="f"><span class="lbl">${esc(f.label)}</span><textarea class="ta" data-path="${path}" rows="2">${esc(v)}</textarea>${help}</label>`;
            case 'select': {
                const opts = typeof f.options === 'function' ? f.options(S.draft) : f.options;
                return `<label class="f"><span class="lbl">${esc(f.label)}</span><select class="sel" data-path="${path}">${opts.map(([val, lab]) => `<option value="${esc(val)}" ${val === (v || '') ? 'selected' : ''}>${esc(lab)}</option>`).join('')}</select>${help}</label>`;
            }
            case 'strlist': {
                const arr = v || [];
                return `<div class="f"><div class="lbl">${esc(f.label)}</div><div class="items">${arr.map((s, i) => `<div class="item"><div class="item-head" style="padding-left:6px">
                    <input class="in" style="min-height:40px" data-path="${path}.${i}" value="${esc(s)}">
                    <button class="mini" data-act="up" data-path="${path}" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${icon('chevronUp', 18)}</button>
                    <button class="mini danger" data-act="del" data-path="${path}" data-i="${i}" aria-label="Remove">${icon('trash', 18)}</button></div></div>`).join('')}
                    <button class="add" data-act="addstr" data-path="${path}">${icon('plus', 18)} ${esc(f.addLabel || 'Add')}</button></div></div>`;
            }
            case 'list': {
                const arr = v || [];
                return `<div class="f">${f.label ? `<div class="lbl">${esc(f.label)}</div>` : ''}<div class="items">
                    ${arr.map((it, i) => {
                        const ip = `${path}.${i}`;
                        titleFns[ip] = f;
                        const open = S.open.has(ip);
                        const tag = f.tag ? f.tag(it) : '';
                        return `<div class="item" data-item="${ip}"><div class="item-head">
                            <button class="name" data-act="toggle" data-path="${ip}">${icon(open ? 'chevronDown' : 'chevronRight', 16)}<span class="txt"><span class="nm">${esc(f.title(it))}</span><small class="sb">${esc(f.sub ? f.sub(it) : '')}</small></span>${tag ? `<span class="tag">${esc(tag)}</span>` : ''}</button>
                            <button class="mini" data-act="up" data-path="${path}" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${icon('chevronUp', 18)}</button>
                            <button class="mini" data-act="down" data-path="${path}" data-i="${i}" ${i === arr.length - 1 ? 'disabled' : ''} aria-label="Move down">${icon('chevronDown', 18)}</button>
                            <button class="mini danger" data-act="del" data-path="${path}" data-i="${i}" aria-label="Remove">${icon('trash', 18)}</button>
                        </div>${open ? `<div class="item-body">${f.item.map(x => field(x, ip)).join('')}</div>` : ''}</div>`;
                    }).join('')}
                    ${f.max && arr.length >= f.max ? `<div class="help">Maximum of ${f.max} reached.</div>` : `<button class="add" data-act="add" data-path="${path}">${icon('plus', 18)} ${esc(f.addLabel || 'Add')}</button>`}
                </div></div>`;
            }
            default: return `<label class="f"><span class="lbl">${esc(f.label)}</span><input class="in" ${f.t === 'url' ? 'type="url" inputmode="url" placeholder="https://"' : f.t === 'tel' ? 'inputmode="numeric"' : ''} data-path="${path}" value="${esc(v)}">${help}</label>`;
        }
    }
    function findListSpec(path) {
        // Locate the schema for a list by matching its path pattern (numbers = any index).
        const pattern = path.replace(/\.\d+/g, '.#');
        let found = null;
        const walk = (fields, base) => fields.forEach(f => {
            if (f.t === 'row') return walk(f.fields, base);
            const p = join(base, f.k);
            if ((f.t === 'list' || f.t === 'strlist') && p === pattern) found = f;
            if (f.t === 'list') walk(f.item, `${p}.#`);
        });
        SECTIONS.forEach(s => (s.cards || []).forEach(c => walk(c.fields, '')));
        return found;
    }

    // ------------------------------------------------------------------
    // Checklist
    // ------------------------------------------------------------------
    function countMissing(o) {
        let n = 0;
        const walk = (x) => { if (Array.isArray(x)) return x.forEach(walk); if (x && typeof x === 'object') { if ('en' in x && 'fr' in x) { if (String(x.en || '').trim()) n += missing(x); } else Object.values(x).forEach(walk); } };
        walk(o); return n;
    }
    function checklist() {
        const d = S.draft, s = S.session, out = [];
        const add = (ok, title, text) => out.push({ ok, title, text });
        add(d.contacts.whatsapp !== PLACEHOLDER_WA && /^\d{8,15}$/.test(d.contacts.whatsapp), 'WhatsApp number', d.contacts.whatsapp === PLACEHOLDER_WA ? 'Still the placeholder number. Guest messages will not reach the lodge. Update it under Contacts & WiFi.' : `Messages go to +${d.contacts.whatsapp}.`);
        add(!/example\.com/.test(d.sponsor.link || '') || !d.sponsor.enabled, 'Partner card', /example\.com/.test(d.sponsor.link || '') && d.sponsor.enabled ? 'The partner link is a placeholder (example.com). Update it or hide the card under Lodge & Partner.' : 'Partner card is ready.');
        add(s.storage === 'redis', 'Storage', s.storage === 'redis' ? 'Connected to Upstash Redis.' : s.storage === 'local-file' ? 'Demo mode: changes are saved to a local file on this computer.' : 'No storage connected on Vercel. Publishing is disabled until Upstash Redis is connected.');
        add(!s.demoPassword, 'Admin password', s.demoPassword ? 'The demo password is in use. Set ADMIN_PASSWORD before going live.' : 'A private password is set.');
        const m = countMissing(d);
        add(m === 0, 'Translations', m ? `${m} translations are empty. English is shown in their place.` : 'All text is translated.');
        return out;
    }

    // ------------------------------------------------------------------
    // Views
    // ------------------------------------------------------------------
    function vLogin() {
        const s = S.session || {};
        return `<div class="login">
            <div style="text-align:center;margin-bottom:20px"><div class="wifi-badge" style="background:var(--teal-soft);color:var(--teal-strong);width:64px;height:64px">${icon('lock', 28)}</div>
            <h1 class="h1" style="margin:10px 0 4px">Concierge Admin</h1><p class="sub" style="margin:0">A'Zambezi River Lodge</p></div>
            <form class="card" id="login-form">
                ${!s.passwordConfigured ? `<div class="errs" style="margin-bottom:14px">ADMIN_PASSWORD is not set in the Vercel project, so sign-in is disabled.</div>` : ''}
                ${s.demoPassword ? `<div class="banner info" style="margin-bottom:14px">${icon('info', 18)}<div class="grow">Demo mode: the password is <b>demo1234</b>.</div></div>` : ''}
                <label class="f"><span class="lbl">Your name (for the change log)</span><input class="in" id="lg-name" autocomplete="name" placeholder="e.g. Front Office"></label>
                <label class="f"><span class="lbl">Password</span><input class="in" id="lg-pass" type="password" autocomplete="current-password" required></label>
                <div id="lg-err"></div>
                <button class="btn btn-primary" type="submit" ${S.busy ? 'disabled' : ''}>${S.busy ? 'Signing in…' : 'Sign in'}</button>
            </form></div>`;
    }

    function vOverview() {
        const c = checklist();
        const warn = c.filter(x => !x.ok).length;
        const when = S.meta && S.meta.updatedAt ? new Date(S.meta.updatedAt).toLocaleString() : 'Not yet published from the admin';
        return `<div class="card"><h3>Status</h3>
                <div class="check ${S.dirty ? 'warn' : 'ok'}">${icon(S.dirty ? 'alert' : 'check', 18)}<div><b>${S.dirty ? 'Unpublished changes' : 'Everything is published'}</b><span>Last published: ${esc(when)}${S.meta && S.meta.updatedBy ? ` by ${esc(S.meta.updatedBy)}` : ''}</span></div></div>
            </div>
            <div class="card"><h3>Setup checklist ${warn ? `<span class="tag">${warn} to fix</span>` : '<span class="tag ok">Ready</span>'}</h3>
                ${c.map(x => `<div class="check ${x.ok ? 'ok' : 'warn'}">${icon(x.ok ? 'check' : 'alert', 18)}<div><b>${esc(x.title)}</b><span>${esc(x.text)}</span></div></div>`).join('')}
            </div>
            <div class="card"><h3>Quick links</h3><div class="links">
                <a class="btn btn-ghost" href="/" target="_blank" rel="noopener">${icon('external', 18)} Guest app</a>
                <a class="btn btn-ghost" href="/demo" target="_blank" rel="noopener">${icon('qr', 18)} QR demo</a>
                <button class="btn btn-ghost" data-act="preview">${icon('eye', 18)} Preview draft</button>
            </div></div>
            <div class="card"><h3>Undo</h3>
                <p class="sub" style="margin:0 0 12px;font-size:14px">${S.hasPrev ? `Restores the version that was live before the last publish${S.prevAt ? ` (published ${esc(new Date(S.prevAt).toLocaleString())})` : ''}.` : 'No earlier version is stored yet. One is kept automatically every time you publish.'}</p>
                <button class="btn btn-ghost" data-act="restore" ${S.hasPrev ? '' : 'disabled'}>${icon('undo', 18)} Restore previous version</button>
            </div>
            <div class="card"><h3>Account</h3><button class="btn btn-ghost" data-act="logout">${icon('logout', 18)} Sign out${S.session.name ? ` (${esc(S.session.name)})` : ''}</button></div>`;
    }

    function vEditor() {
        const sec = SECTIONS.find(s => s.id === S.sec) || SECTIONS[0];
        const warn = checklist().filter(x => !x.ok).length;
        return `<div class="adm">
            <header class="adm-top">
                <div class="adm-bar">
                    <div class="t"><b>Concierge Admin</b><small class="${S.dirty ? 'dirty' : ''}" id="status-line">${S.dirty ? 'Unpublished changes' : 'All changes published'}</small></div>
                    <a class="icon-btn" href="/" target="_blank" rel="noopener" aria-label="Open guest app">${icon('external', 20)}</a>
                </div>
                <nav class="nav">${SECTIONS.map(s => `<button class="${s.id === sec.id ? 'on' : ''}" data-act="nav" data-id="${s.id}">${icon(s.icon, 15)} ${esc(s.title)}${s.id === 'overview' && warn ? ` <span class="count">${warn}</span>` : ''}</button>`).join('')}</nav>
            </header>
            <main class="adm-main">
                <div class="sec-head"><h1>${esc(sec.title)}</h1><p>${esc(sec.intro)}</p></div>
                ${S.errors.length ? `<div class="errs"><b>Not published. Please fix:</b><ul>${S.errors.map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>` : ''}
                ${sec.id === 'overview' ? vOverview() : sec.cards.map(c => `<div class="card"><h3>${esc(c.title)}</h3>${c.fields.map(f => field(f, '')).join('')}</div>`).join('')}
            </main>
            <div class="dock"><div class="dock-in">
                <button class="btn btn-ghost" data-act="preview">${icon('eye', 18)} Preview</button>
                <button class="btn btn-primary" data-act="publish" ${S.busy || !S.dirty || S.session.storage === 'none' ? 'disabled' : ''}>${icon('save', 18)} ${S.busy ? 'Publishing…' : 'Publish'}</button>
            </div></div>
            ${S.preview ? vPreview() : ''}
        </div>`;
    }

    function vPreview() {
        return `<div class="pv" id="pv"><div class="pv-bar"><b>Preview (not yet live)</b>
            <select id="pv-lang" aria-label="Preview language">${['en', 'fr', 'de', 'zh'].map(l => `<option value="${l}" ${l === S.previewLang ? 'selected' : ''}>${l.toUpperCase()}</option>`).join('')}</select>
            <button class="mini" data-act="closePreview" aria-label="Close preview">${icon('x', 20)}</button></div>
            <div class="phone"><iframe id="pv-frame" title="Guest app preview" src="/?preview=1"></iframe></div></div>`;
    }

    function render() {
        if (!S.session) { root.innerHTML = `<div class="screen center"><div class="loader"></div></div>`; return; }
        if (!S.session.signedIn) { root.innerHTML = vLogin(); return; }
        if (!S.draft) { root.innerHTML = `<div class="screen center"><div class="loader"></div></div>`; return; }
        const y = window.scrollY;
        root.innerHTML = vEditor();
        window.scrollTo(0, y);
        const nav = root.querySelector('.nav'), on = nav && nav.querySelector('.on');
        if (on && (on.offsetLeft + on.offsetWidth > nav.scrollLeft + nav.clientWidth || on.offsetLeft < nav.scrollLeft)) nav.scrollLeft = on.offsetLeft - 14;
        if (S.preview) setupPreview();
    }

    function setupPreview() {
        const fr = document.getElementById('pv-frame');
        const sendIt = () => fr.contentWindow && fr.contentWindow.postMessage({ type: 'azc-preview', content: S.draft, lang: S.previewLang }, location.origin);
        try { sessionStorage.setItem('azc-preview', JSON.stringify(S.draft)); } catch { /* ignore */ }
        fr.addEventListener('load', sendIt);
        document.getElementById('pv-lang').addEventListener('change', (e) => { S.previewLang = e.target.value; sendIt(); });
    }

    // ------------------------------------------------------------------
    // Events
    // ------------------------------------------------------------------
    function markDirty() {
        if (!S.dirty) { S.dirty = true; const sl = document.getElementById('status-line'); if (sl) { sl.textContent = 'Unpublished changes'; sl.classList.add('dirty'); } const pb = root.querySelector('[data-act="publish"]'); if (pb && S.session.storage !== 'none') pb.disabled = false; }
    }
    root.addEventListener('input', (e) => {
        const el = e.target, p = el.dataset && el.dataset.path;
        if (!p || !S.draft) return;
        const v = el.type === 'checkbox' ? el.checked : el.value;
        set(S.draft, p, v);
        if (el.dataset.kind === 'time') el.classList.toggle('bad', !TIME.test(el.value));
        markDirty();
        // live-update the title of the list item being edited
        const item = el.closest('[data-item]');
        if (item) {
            const ip = item.dataset.item, f = titleFns[ip], it = get(S.draft, ip);
            if (f && it !== undefined) {
                const nm = item.querySelector(':scope > .item-head .nm'), sb = item.querySelector(':scope > .item-head .sb');
                if (nm) nm.textContent = f.title(it); if (sb && f.sub) sb.textContent = f.sub(it);
            }
        }
    });
    root.addEventListener('change', (e) => { if (e.target.type === 'checkbox') render(); });

    root.addEventListener('submit', async (e) => {
        if (e.target.id !== 'login-form') return;
        e.preventDefault();
        const name = document.getElementById('lg-name').value, password = document.getElementById('lg-pass').value;
        S.busy = true; render();
        try {
            const j = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ name, password }) });
            S.busy = false; S.session = { ...S.session, signedIn: true, name: j.name };
            await loadContent();
        } catch (err) {
            S.busy = false; render();
            document.getElementById('lg-name').value = name || '';
            document.getElementById('lg-err').innerHTML = `<div class="errs" style="margin-bottom:14px">${esc(err.message)}</div>`;
            document.getElementById('lg-pass').focus();
        }
    });

    root.addEventListener('click', async (e) => {
        const el = e.target.closest('[data-act]');
        if (!el) return;
        const a = el.dataset.act, p = el.dataset.path, i = +el.dataset.i;
        switch (a) {
            case 'nav': S.sec = el.dataset.id; S.errors = []; history.replaceState(null, '', `#${S.sec}`); render(); window.scrollTo(0, 0); break;
            case 'toggle': S.open.has(p) ? S.open.delete(p) : S.open.add(p); render(); break;
            case 'tr': S.tr.has(p) ? S.tr.delete(p) : S.tr.add(p); render(); break;
            case 'add': {
                const spec = findListSpec(p), arr = get(S.draft, p);
                arr.push(spec.add()); S.open.add(`${p}.${arr.length - 1}`); markDirty(); render();
                const items = root.querySelectorAll(`[data-item^="${p}."]`); const last = items[items.length - 1];
                if (last) { last.scrollIntoView({ block: 'center' }); const inp = last.querySelector('input,textarea'); if (inp) inp.focus({ preventScroll: true }); }
                break;
            }
            case 'addstr': get(S.draft, p).push(''); markDirty(); render(); break;
            case 'del': {
                const arr = get(S.draft, p), it = arr[i];
                const spec = findListSpec(p);
                const name = typeof it === 'string' ? it : (spec && spec.title ? spec.title(it) : 'this item');
                if (!confirm(`Remove "${name}"? You can still undo by not publishing.`)) return;
                arr.splice(i, 1); S.open.clear(); markDirty(); render(); break;
            }
            case 'up': case 'down': {
                const arr = get(S.draft, p), j = a === 'up' ? i - 1 : i + 1;
                if (j < 0 || j >= arr.length) return;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                const oi = `${p}.${i}`, oj = `${p}.${j}`, hi = S.open.has(oi), hj = S.open.has(oj);
                S.open.delete(oi); S.open.delete(oj); if (hi) S.open.add(oj); if (hj) S.open.add(oi);
                markDirty(); render(); break;
            }
            case 'preview': S.preview = true; render(); break;
            case 'closePreview': S.preview = false; render(); break;
            case 'publish': await publish(); break;
            case 'restore':
                if (!confirm('Put the previous version back live? Your current live version becomes the new "previous" version.')) return;
                try { await api('/api/admin/restore', { method: 'POST' }); toast('Previous version restored.'); await loadContent(); } catch (err) { toast(err.message); }
                break;
            case 'logout': await api('/api/admin/logout', { method: 'POST' }).catch(() => {}); S.session.signedIn = false; S.draft = null; S.dirty = false; render(); break;
        }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && S.preview) { S.preview = false; render(); } });
    window.addEventListener('beforeunload', (e) => { if (S.dirty) { e.preventDefault(); e.returnValue = ''; } });

    async function publish() {
        S.busy = true; S.errors = []; render();
        try {
            const j = await api('/api/admin/content', { method: 'PUT', body: JSON.stringify({ content: S.draft }) });
            S.meta = j.meta; S.draft.meta = j.meta; S.dirty = false; S.hasPrev = true; S.busy = false;
            render(); toast('Published. Guests will see the changes within about 15 seconds.');
        } catch (err) {
            S.busy = false; S.errors = (err.data && err.data.errors) || [err.message]; render(); window.scrollTo(0, 0);
        }
    }

    async function loadContent() {
        const j = await api('/api/admin/content');
        S.draft = j.content; S.meta = j.content.meta; S.hasPrev = j.hasPrevious; S.prevAt = j.previousUpdatedAt; S.dirty = false; S.errors = [];
        render();
    }

    (async function init() {
        try { S.session = await api('/api/admin/session'); } catch { S.session = { signedIn: false, passwordConfigured: true }; }
        render();
        if (S.session.signedIn) await loadContent();
    })();
})();
