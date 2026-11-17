// Light structural checks before content is published, so a broken save
// can never take the guest app down. Returns a list of problems (empty = OK).
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const SAFE_URL = /^(https?:\/\/|tel:|mailto:|$)/i;

function validate(c) {
    const errs = [];
    const need = ['hotel', 'wifi', 'contacts', 'departure', 'hours', 'directory', 'shuttle', 'activities', 'menu', 'about', 'policies', 'sponsor', 'announcement'];
    if (!c || typeof c !== 'object') return ['Content must be an object.'];
    for (const k of need) if (!(k in c)) errs.push(`Missing section: ${k}`);
    if (errs.length) return errs;

    if (!c.hotel.name) errs.push('Lodge name is required.');
    if (!TIME.test(c.departure.time || '')) errs.push('Departure time must be HH:MM (24-hour).');
    (c.hours || []).forEach((h, i) => {
        if (!h.label || !h.label.en) errs.push(`Hours row ${i + 1}: English label is required.`);
        if (!TIME.test(h.open || '') || !TIME.test(h.close || '')) errs.push(`Hours "${h.label && h.label.en}": times must be HH:MM (24-hour).`);
    });
    (c.shuttle.schedule || []).forEach((s, i) => {
        if (!TIME.test(s.toRainforest || '') || !TIME.test(s.fromRainforest || '')) errs.push(`Shuttle row ${i + 1}: times must be HH:MM (24-hour).`);
    });
    if (!/^\d{8,15}$/.test(String(c.contacts.whatsapp || ''))) errs.push('WhatsApp number must be digits only, with country code (e.g. 263771234567).');

    const urls = [];
    const walk = (o, p) => {
        if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${p}[${i}]`));
        if (o && typeof o === 'object') return Object.entries(o).forEach(([k, v]) => {
            if (/(url|link|href|image|Url|Image)$/.test(k) && typeof v === 'string') urls.push([`${p}.${k}`, v]);
            walk(v, `${p}.${k}`);
        });
    };
    walk(c, 'content');
    for (const [p, u] of urls) if (!SAFE_URL.test(u.trim())) errs.push(`Link must start with https://, tel: or mailto: (${p}).`);
    return errs;
}

module.exports = { validate };
