/* A'Zambezi River Lodge guest concierge.
 * Content is loaded from /api/content (edited in /admin). Nothing guest-facing
 * is hard-coded here except UI wording. All text from content is escaped
 * before display, and all buttons use data attributes (no inline JS strings),
 * so names such as "Chef's Cake" can never break a button.
 */
(function () {
    'use strict';

    // ------------------------------------------------------------------
    // UI wording (content itself comes from the admin)
    // ------------------------------------------------------------------
    const T = {
        en: {
            loading: 'Loading the lodge…', chooseLanguage: 'Please choose your language', welcomeTo: 'Welcome to',
            getConnected: 'Get connected', detailsTitle: 'Who is staying with us?', detailsSub: 'Optional. Your name and room are added to your WhatsApp requests so staff know where to find you.',
            nameLabel: 'Guest name', namePh: 'e.g. David Livingstone', roomLabel: 'Room number', roomPh: 'e.g. 204',
            privacy: 'Saved on this phone only. Nothing is sent until you choose to message us.', continue: 'Continue', skip: 'Skip for now', save: 'Save',
            wifiTitle: 'Lodge WiFi', wifiSub: 'Free high-speed internet throughout the lodge.', network: 'Network name', password: 'Password',
            copy: 'Copy password', copied: 'Password copied', wifiQr: 'Connecting another device? Scan this code with its camera.', explore: 'Explore the lodge',
            portalTitle: 'River Concierge', morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening',
            room: 'Room', addDetails: 'Add your name and room', edit: 'Edit',
            today: 'Today at the lodge', openUntil: 'Open until {t}', opensAt: 'Opens at {t}', opensTomorrow: 'Opens tomorrow {t}',
            services: 'Guest services', menu: 'Menu & Room Service', menuSub: 'Order on WhatsApp', activities: 'Activities', activitiesSub: 'Heritage Expeditions',
            shuttle: 'Shuttle', shuttleSub: 'Town & Rainforest', wifi: 'WiFi', wifiTileSub: 'Network & password', info: 'Lodge information',
            nextShuttle: 'Next shuttle {t}', departingNow: 'Departing now', tomorrow: 'tomorrow', departure: 'Departure today at {t}', lateCheckout: 'Request a late check-out',
            lateMsg: 'I would like to request a late check-out.', directory: 'Lodge directory', dialNote: 'Dial these extensions from your room phone.',
            about: 'About the lodge', guidelines: 'Guest guidelines', callReception: 'Call Reception', chat: 'Chat with us', waHello: 'Hello A\'Zambezi Concierge, I need help with ',
            order: 'Order', soldOut: 'Sold out today', served: 'Served {a} to {b}', orderMsg: 'Order: {item}', guestLine: 'Guest: {g}',
            addRoom: 'Add your room number so orders reach you.', add: 'Add', activityMsg: 'I would like help booking: {a}', activityGeneral: 'I would like help booking an activity.',
            viewBook: 'View and book', browseAll: 'Browse all activities', heritageDesk: 'Heritage Desk', askWa: 'Ask on WhatsApp',
            route: 'Route', toRF: 'To Rainforest', fromRF: 'From Rainforest', next: 'Next', taxi: 'Book a private taxi', taxiMsg: 'I would like to book a private taxi.',
            close: 'Close', back: 'Back', portalBanner: 'Some buttons work best in your phone\'s browser.', copyLink: 'Copy link', linkCopied: 'Link copied',
            offline: 'Showing saved information. Some details may be out of date.', errorTitle: 'The concierge could not load', errorSub: 'Please check your connection, or call Reception.', retry: 'Try again',
            language: 'Language', diningHours: 'Opening hours', partner: 'Partner service', inX: 'in {x}', range: '{a} to {b}'
        },
        fr: {
            loading: 'Chargement du lodge…', chooseLanguage: 'Veuillez choisir votre langue', welcomeTo: 'Bienvenue au',
            getConnected: 'Se connecter', detailsTitle: 'Qui séjourne chez nous ?', detailsSub: 'Facultatif. Votre nom et votre chambre sont ajoutés à vos demandes WhatsApp afin que le personnel sache où vous trouver.',
            nameLabel: 'Nom du client', namePh: 'ex. David Livingstone', roomLabel: 'Numéro de chambre', roomPh: 'ex. 204',
            privacy: 'Enregistré uniquement sur ce téléphone. Rien n\'est envoyé tant que vous ne nous écrivez pas.', continue: 'Continuer', skip: 'Plus tard', save: 'Enregistrer',
            wifiTitle: 'WiFi du Lodge', wifiSub: 'Internet haut débit gratuit dans tout le lodge.', network: 'Nom du réseau', password: 'Mot de passe',
            copy: 'Copier le mot de passe', copied: 'Mot de passe copié', wifiQr: 'Un autre appareil ? Scannez ce code avec son appareil photo.', explore: 'Découvrir le lodge',
            portalTitle: 'Concierge du Fleuve', morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir',
            room: 'Chambre', addDetails: 'Ajoutez votre nom et votre chambre', edit: 'Modifier',
            today: 'Aujourd\'hui au lodge', openUntil: 'Ouvert jusqu\'à {t}', opensAt: 'Ouvre à {t}', opensTomorrow: 'Ouvre demain à {t}',
            services: 'Services aux clients', menu: 'Menu & Room Service', menuSub: 'Commander sur WhatsApp', activities: 'Activités', activitiesSub: 'Heritage Expeditions',
            shuttle: 'Navette', shuttleSub: 'Ville & Forêt tropicale', wifi: 'WiFi', wifiTileSub: 'Réseau & mot de passe', info: 'Informations sur le lodge',
            nextShuttle: 'Prochaine navette {t}', departingNow: 'Départ imminent', tomorrow: 'demain', departure: 'Départ aujourd\'hui à {t}', lateCheckout: 'Demander un départ tardif',
            lateMsg: 'Je souhaite demander un départ tardif.', directory: 'Annuaire du lodge', dialNote: 'Composez ces numéros depuis le téléphone de votre chambre.',
            about: 'À propos du lodge', guidelines: 'Consignes aux clients', callReception: 'Appeler la réception', chat: 'Nous écrire', waHello: 'Bonjour Concierge A\'Zambezi, j\'ai besoin d\'aide pour ',
            order: 'Commander', soldOut: 'Épuisé aujourd\'hui', served: 'Servi de {a} à {b}', orderMsg: 'Commande : {item}', guestLine: 'Client : {g}',
            addRoom: 'Ajoutez votre numéro de chambre pour recevoir vos commandes.', add: 'Ajouter', activityMsg: 'Je souhaite réserver : {a}', activityGeneral: 'Je souhaite de l\'aide pour réserver une activité.',
            viewBook: 'Voir et réserver', browseAll: 'Toutes les activités', heritageDesk: 'Bureau Heritage', askWa: 'Demander sur WhatsApp',
            route: 'Itinéraire', toRF: 'Vers la forêt', fromRF: 'Depuis la forêt', next: 'Suivante', taxi: 'Réserver un taxi privé', taxiMsg: 'Je souhaite réserver un taxi privé.',
            close: 'Fermer', back: 'Retour', portalBanner: 'Certains boutons fonctionnent mieux dans votre navigateur.', copyLink: 'Copier le lien', linkCopied: 'Lien copié',
            offline: 'Informations enregistrées affichées. Certains détails peuvent être obsolètes.', errorTitle: 'Le concierge n\'a pas pu se charger', errorSub: 'Vérifiez votre connexion ou appelez la réception.', retry: 'Réessayer',
            language: 'Langue', diningHours: 'Horaires', partner: 'Service partenaire', inX: 'dans {x}', range: '{a} à {b}'
        },
        de: {
            loading: 'Lodge wird geladen…', chooseLanguage: 'Bitte wählen Sie Ihre Sprache', welcomeTo: 'Willkommen in der',
            getConnected: 'Verbinden', detailsTitle: 'Wer übernachtet bei uns?', detailsSub: 'Optional. Name und Zimmer werden Ihren WhatsApp-Anfragen hinzugefügt, damit das Personal Sie findet.',
            nameLabel: 'Gastname', namePh: 'z. B. David Livingstone', roomLabel: 'Zimmernummer', roomPh: 'z. B. 204',
            privacy: 'Nur auf diesem Telefon gespeichert. Es wird nichts gesendet, bis Sie uns schreiben.', continue: 'Weiter', skip: 'Später', save: 'Speichern',
            wifiTitle: 'Lodge-WLAN', wifiSub: 'Kostenloses Highspeed-Internet in der gesamten Lodge.', network: 'Netzwerkname', password: 'Passwort',
            copy: 'Passwort kopieren', copied: 'Passwort kopiert', wifiQr: 'Weiteres Gerät? Scannen Sie diesen Code mit dessen Kamera.', explore: 'Lodge entdecken',
            portalTitle: 'Fluss-Concierge', morning: 'Guten Morgen', afternoon: 'Guten Tag', evening: 'Guten Abend',
            room: 'Zimmer', addDetails: 'Name und Zimmer hinzufügen', edit: 'Ändern',
            today: 'Heute in der Lodge', openUntil: 'Geöffnet bis {t}', opensAt: 'Öffnet um {t}', opensTomorrow: 'Öffnet morgen um {t}',
            services: 'Gästeservice', menu: 'Speisekarte & Zimmerservice', menuSub: 'Per WhatsApp bestellen', activities: 'Aktivitäten', activitiesSub: 'Heritage Expeditions',
            shuttle: 'Shuttle', shuttleSub: 'Stadt & Regenwald', wifi: 'WLAN', wifiTileSub: 'Netzwerk & Passwort', info: 'Lodge-Informationen',
            nextShuttle: 'Nächster Shuttle {t}', departingNow: 'Fährt jetzt ab', tomorrow: 'morgen', departure: 'Abreise heute um {t}', lateCheckout: 'Späten Check-out anfragen',
            lateMsg: 'Ich möchte einen späten Check-out anfragen.', directory: 'Lodge-Verzeichnis', dialNote: 'Wählen Sie diese Durchwahlen vom Zimmertelefon.',
            about: 'Über die Lodge', guidelines: 'Gästerichtlinien', callReception: 'Rezeption anrufen', chat: 'Schreiben Sie uns', waHello: 'Hallo A\'Zambezi Concierge, ich brauche Hilfe bei ',
            order: 'Bestellen', soldOut: 'Heute ausverkauft', served: 'Serviert von {a} bis {b}', orderMsg: 'Bestellung: {item}', guestLine: 'Gast: {g}',
            addRoom: 'Fügen Sie Ihre Zimmernummer hinzu, damit Bestellungen ankommen.', add: 'Hinzufügen', activityMsg: 'Ich möchte Folgendes buchen: {a}', activityGeneral: 'Ich hätte gern Hilfe bei der Buchung einer Aktivität.',
            viewBook: 'Ansehen und buchen', browseAll: 'Alle Aktivitäten', heritageDesk: 'Heritage-Schalter', askWa: 'Per WhatsApp fragen',
            route: 'Route', toRF: 'Zum Regenwald', fromRF: 'Vom Regenwald', next: 'Nächster', taxi: 'Privates Taxi buchen', taxiMsg: 'Ich möchte ein privates Taxi buchen.',
            close: 'Schließen', back: 'Zurück', portalBanner: 'Manche Tasten funktionieren besser im Browser.', copyLink: 'Link kopieren', linkCopied: 'Link kopiert',
            offline: 'Gespeicherte Informationen werden angezeigt. Einige Angaben sind eventuell veraltet.', errorTitle: 'Der Concierge konnte nicht geladen werden', errorSub: 'Prüfen Sie Ihre Verbindung oder rufen Sie die Rezeption an.', retry: 'Erneut versuchen',
            language: 'Sprache', diningHours: 'Öffnungszeiten', partner: 'Partnerservice', inX: 'in {x}', range: '{a} bis {b}'
        },
        zh: {
            loading: '正在加载…', chooseLanguage: '请选择您的语言', welcomeTo: '欢迎来到',
            getConnected: '连接网络', detailsTitle: '请告诉我们入住客人信息', detailsSub: '选填。您的姓名和房间号会附在WhatsApp请求中，方便员工为您服务。',
            nameLabel: '客人姓名', namePh: '例如：David Livingstone', roomLabel: '房间号', roomPh: '例如：204',
            privacy: '仅保存在本手机上。在您主动发送消息前不会发送任何信息。', continue: '继续', skip: '稍后填写', save: '保存',
            wifiTitle: '旅舍WiFi', wifiSub: '全旅舍免费高速网络。', network: '网络名称', password: '密码',
            copy: '复制密码', copied: '密码已复制', wifiQr: '为其他设备联网？请用该设备的相机扫描此码。', explore: '探索旅舍',
            portalTitle: '河畔礼宾服务', morning: '早上好', afternoon: '下午好', evening: '晚上好',
            room: '房间', addDetails: '添加姓名和房间号', edit: '修改',
            today: '今日旅舍', openUntil: '营业至{t}', opensAt: '{t}开放', opensTomorrow: '明天{t}开放',
            services: '宾客服务', menu: '菜单与客房送餐', menuSub: '通过WhatsApp点餐', activities: '活动', activitiesSub: 'Heritage Expeditions',
            shuttle: '班车', shuttleSub: '市区与雨林', wifi: 'WiFi', wifiTileSub: '网络与密码', info: '旅舍信息',
            nextShuttle: '下一班车 {t}', departingNow: '即将发车', tomorrow: '明天', departure: '今日退房时间 {t}', lateCheckout: '申请延迟退房',
            lateMsg: '我想申请延迟退房。', directory: '旅舍电话簿', dialNote: '请使用房间电话拨打以下分机。',
            about: '关于旅舍', guidelines: '住客须知', callReception: '致电前台', chat: '联系我们', waHello: '您好，A\'Zambezi礼宾部！我需要帮助：',
            order: '点餐', soldOut: '今日售罄', served: '供应时间 {a} 至 {b}', orderMsg: '点餐：{item}', guestLine: '客人：{g}',
            addRoom: '请添加房间号，以便送餐。', add: '添加', activityMsg: '我想预订：{a}', activityGeneral: '我需要帮助预订活动。',
            viewBook: '查看并预订', browseAll: '浏览全部活动', heritageDesk: 'Heritage服务台', askWa: '通过WhatsApp咨询',
            route: '路线', toRF: '前往雨林', fromRF: '从雨林返回', next: '下一班', taxi: '预订专车', taxiMsg: '我想预订专车。',
            close: '关闭', back: '返回', portalBanner: '部分按钮在手机浏览器中效果更佳。', copyLink: '复制链接', linkCopied: '链接已复制',
            offline: '正在显示已保存的信息，部分内容可能已过期。', errorTitle: '礼宾服务无法加载', errorSub: '请检查网络连接，或致电前台。', retry: '重试',
            language: '语言', diningHours: '营业时间', partner: '合作服务', inX: '{x}后', range: '{a}至{b}'
        }
    };
    const LANGS = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh', label: '中文', flag: '🇨🇳' }
    ];
    const TZ = 'Africa/Harare'; // Victoria Falls local time

    // ------------------------------------------------------------------
    // Mode flags from the URL
    // ------------------------------------------------------------------
    const params = new URLSearchParams(location.search);
    const PREVIEW = params.get('preview') === '1';
    const DEMO = params.get('demo') === '1';
    const FROM_PORTAL = params.get('src') === 'portal';

    // Guest details persist on the phone; demo and preview start fresh each time.
    const mem = {};
    const store = {
        get(k) { try { return (DEMO || PREVIEW) ? mem[k] : JSON.parse(localStorage.getItem(k)); } catch { return null; } },
        set(k, v) { try { if (DEMO || PREVIEW) mem[k] = v; else localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } }
    };

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    let C = null;              // content
    let offline = false;
    const saved = store.get('azc-guest') || {};
    const state = {
        view: 'loading',
        lang: saved.lang || null,
        name: saved.name || '',
        room: saved.room || '',
        onboarded: Boolean(saved.onboarded),
        panel: null,
        tab: {},
        toast: ''
    };
    const app = document.getElementById('app');

    const t = (k, vars) => {
        let s = (T[state.lang] || T.en)[k] || T.en[k] || k;
        if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
        return s;
    };
    const L = (o) => (o && typeof o === 'object') ? (o[state.lang] || o.en || '') : (o || '');
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const safeUrl = (u) => /^(https?:\/\/|tel:|mailto:)/i.test(String(u || '').trim()) ? String(u).trim() : '';
    const persist = () => store.set('azc-guest', { lang: state.lang, name: state.name, room: state.room, onboarded: state.onboarded });

    // ------------------------------------------------------------------
    // Time (always Victoria Falls time, whatever the phone is set to)
    // ------------------------------------------------------------------
    function nowMins() {
        const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
        const h = +parts.find(p => p.type === 'hour').value, m = +parts.find(p => p.type === 'minute').value;
        return h * 60 + m;
    }
    const toMins = (hhmm) => { const [h, m] = String(hhmm || '0:0').split(':').map(Number); return h * 60 + m; };
    function inX(diff) {
        const h = Math.floor(diff / 60), m = diff % 60;
        const x = state.lang === 'zh' ? (h ? `${h}小时${m}分钟` : `${m}分钟`) : (h ? `${h}h ${m}m` : `${m} min`);
        return t('inX', { x });
    }
    function hoursStatus(h) {
        const n = nowMins(), o = toMins(h.open), c = toMins(h.close);
        const isOpen = c > o ? (n >= o && n < c) : (n >= o || n < c);
        if (isOpen) return { cls: 'open', text: t('openUntil', { t: h.close }) };
        if (n < o && o - n <= 60) return { cls: 'soon', text: t('opensAt', { t: h.open }) };
        if (n < o) return { cls: '', text: t('opensAt', { t: h.open }) };
        return { cls: '', text: t('opensTomorrow', { t: h.open }) };
    }
    function nextShuttle() {
        const list = (C.shuttle.schedule || []).map(s => s.toRainforest).filter(Boolean).sort((a, b) => toMins(a) - toMins(b));
        if (!list.length) return null;
        const n = nowMins();
        let next = list.find(x => toMins(x) >= n), tomorrow = false;
        if (!next) { next = list[0]; tomorrow = true; }
        const diff = toMins(next) - n + (tomorrow ? 1440 : 0);
        return { time: next, tomorrow, label: diff <= 0 ? t('departingNow') : inX(diff) };
    }
    function greeting() {
        const h = Math.floor(nowMins() / 60);
        return h < 12 ? t('morning') : h < 17 ? t('afternoon') : t('evening');
    }

    // ------------------------------------------------------------------
    // WhatsApp and links
    // ------------------------------------------------------------------
    function guestSuffix() {
        const g = [state.name.trim(), state.room.trim() ? `${t('room')} ${state.room.trim()}` : ''].filter(Boolean).join(', ');
        return g ? `\n${t('guestLine', { g })}` : '';
    }
    const wa = (msg) => `https://wa.me/${encodeURIComponent(C.contacts.whatsapp)}?text=${encodeURIComponent(msg + guestSuffix())}`;
    function tracked(url) {
        const u = safeUrl(url);
        if (!u || !C.activities.utmSource) return u;
        return `${u}${u.includes('?') ? '&' : '?'}utm_source=${encodeURIComponent(C.activities.utmSource)}&utm_medium=qr&utm_campaign=guest-concierge`;
    }
    function wifiString() {
        const e = s => String(s).replace(/([\\;,:"])/g, '\\$1');
        return `WIFI:T:${C.wifi.security || 'WPA'};S:${e(C.wifi.ssid)};P:${e(C.wifi.password)};;`;
    }
    const qrSrc = (data) => `/api/qr?data=${encodeURIComponent(data)}`;

    // ------------------------------------------------------------------
    // Navigation (browser back button closes panels, then steps back)
    // ------------------------------------------------------------------
    function go(view, push = true) {
        state.view = view; state.panel = null;
        if (push) history.pushState({ view, panel: null }, '');
        render(); window.scrollTo(0, 0);
    }
    function openPanel(p) {
        state.panel = p;
        history.pushState({ view: state.view, panel: p }, '');
        render();
    }
    function closePanel() { if (history.state && history.state.panel) history.back(); else { state.panel = null; render(); } }
    window.addEventListener('popstate', (e) => {
        const s = e.state || {};
        if (s.view && s.view !== 'loading') state.view = s.view;
        state.panel = s.panel || null;
        render();
    });

    function toast(msg) {
        state.toast = msg; render();
        clearTimeout(toast._t);
        toast._t = setTimeout(() => { state.toast = ''; render(); }, 1800);
    }
    async function copy(text, okMsg) {
        try { await navigator.clipboard.writeText(text); }
        catch {
            const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
            ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); } catch { /* ignore */ }
            ta.remove();
        }
        toast(okMsg);
    }

    // ------------------------------------------------------------------
    // Views
    // ------------------------------------------------------------------
    const img = (src, cls = '', alt = '') => safeUrl(src) ? `<img src="${esc(src)}" class="${cls}" alt="${esc(alt)}" loading="lazy" onerror="this.style.visibility='hidden'">` : '';

    function vLoading() {
        return `<div class="screen center"><div class="loader"></div><p class="sub" style="margin-top:14px">${esc(T.en.loading)}</p></div>`;
    }
    function vError() {
        return `<div class="screen center">
            ${icon('alert', 40)}
            <h1 class="h1">${esc(t('errorTitle'))}</h1><p class="sub">${esc(t('errorSub'))}</p>
            <div style="width:100%;max-width:340px;display:grid;gap:10px">
                <button class="btn btn-primary" data-act="retry">${esc(t('retry'))}</button>
                <a class="btn btn-ghost" href="tel:+263832844561">${icon('phone', 18)} ${esc(t('callReception'))}</a>
            </div></div>`;
    }
    function vLanguage() {
        return `<div class="screen center">
            ${img(C.hotel.logoUrl, 'logo', C.hotel.name)}
            <h1 class="h1">${esc(t('welcomeTo'))} ${esc(C.hotel.name)}</h1>
            <p class="sub">${esc(t('chooseLanguage'))}</p>
            <div class="lang-list">
                ${LANGS.map(l => `<button class="lang-btn ${state.lang === l.code ? 'on' : ''}" data-act="pickLang" data-arg="${l.code}">
                    <span class="flag" aria-hidden="true">${l.flag}</span><span class="name">${l.label}</span>${icon('chevronRight', 18)}</button>`).join('')}
            </div></div>`;
    }
    function vWelcome() {
        return `<div style="min-height:100dvh;display:flex;flex-direction:column">
            <div class="hero">${img(C.hotel.heroImage, '', C.hotel.name)}
                <div class="hero-text"><h1>${esc(C.hotel.name)}</h1><p>${esc(L(C.hotel.tagline))}</p></div></div>
            <div class="sheet">
                <button class="btn btn-primary" data-act="go" data-arg="details">${esc(t('getConnected'))} ${icon('wifi', 20)}</button>
                <button class="btn btn-link" data-act="go" data-arg="language" style="margin:6px 0 10px">${icon('globe', 16)}&nbsp;${esc(LANGS.find(l => l.code === state.lang).label)}</button>
                ${sponsorCard()}
                ${FROM_PORTAL ? `<div style="margin-top:14px">${portalBanner()}</div>` : ''}
            </div></div>`;
    }
    function detailsForm(btnLabel, act) {
        return `<label class="field"><span>${esc(t('nameLabel'))}</span><div class="input-wrap">${icon('user', 18)}
                <input class="input" id="g-name" autocomplete="name" placeholder="${esc(t('namePh'))}" value="${esc(state.name)}" maxlength="60"></div></label>
            <label class="field"><span>${esc(t('roomLabel'))}</span><div class="input-wrap">${icon('door', 18)}
                <input class="input" id="g-room" inputmode="numeric" placeholder="${esc(t('roomPh'))}" value="${esc(state.room)}" maxlength="12"></div></label>
            <p class="hint">${icon('lock', 14, 'inline')} ${esc(t('privacy'))}</p>
            <button class="btn btn-primary" data-act="${act}">${esc(btnLabel)}</button>`;
    }
    function vDetails() {
        return `<div class="screen">
            <button class="icon-btn" data-act="back" aria-label="${esc(t('back'))}">${icon('chevronLeft', 24)}</button>
            <div style="max-width:420px;width:100%;margin:8px auto 0">
                <h1 class="h1" style="margin-top:4px">${esc(t('detailsTitle'))}</h1>
                <p class="sub">${esc(t('detailsSub'))}</p>
                ${detailsForm(t('continue'), 'saveDetails')}
                <button class="btn btn-link" data-act="skipDetails" style="margin-top:6px">${esc(t('skip'))}</button>
            </div></div>`;
    }
    function wifiCard() {
        return `<div class="wifi-card">
            <div class="kv-label">${esc(t('network'))}</div><div class="kv-value">${esc(C.wifi.ssid)}</div>
            <div class="kv-label">${esc(t('password'))}</div><div class="kv-value mono pass">${esc(C.wifi.password)}</div>
            <button class="btn btn-ghost" data-act="copyPass">${icon('copy', 18)} ${esc(t('copy'))}</button>
            <div class="wifi-qr"><img src="${qrSrc(wifiString())}" alt="WiFi QR code" width="92" height="92"><p>${esc(t('wifiQr'))}</p></div>
        </div>`;
    }
    function vWifi() {
        return `<div class="screen wifi-screen">
            <div style="flex:1;display:flex;flex-direction:column;justify-content:center;text-align:center">
                <div class="wifi-badge">${icon('wifi', 42)}</div>
                <h1 class="h1" style="margin:0 0 4px;color:#fff">${esc(t('wifiTitle'))}</h1>
                <p style="opacity:.85;margin:0 0 22px">${esc(t('wifiSub'))}</p>
                ${wifiCard()}
            </div>
            <button class="btn" style="margin-top:20px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.45);color:#fff" data-act="finishOnboarding">${esc(t('explore'))} ${icon('chevronRight', 18)}</button>
        </div>`;
    }
    function portalBanner() {
        return `<div class="banner info">${icon('external', 18)}<div class="grow">${esc(t('portalBanner'))}</div>
            <button class="btn btn-sm" data-act="copyLink">${esc(t('copyLink'))}</button></div>`;
    }
    function sponsorCard() {
        const s = C.sponsor;
        if (!s || !s.enabled || !L(s.title)) return '';
        const link = safeUrl(s.link);
        const inner = `${img(s.image, '', s.company)}<div class="grow"><div class="lbl">${esc(t('partner'))}</div><b>${esc(L(s.title))}</b><small>${esc(s.company)}</small></div>${link ? icon('external', 18, 'end') : ''}`;
        return link ? `<a class="sponsor" href="${esc(link)}" target="_blank" rel="noopener">${inner}</a>` : `<div class="sponsor">${inner}</div>`;
    }

    function vPortal() {
        const ns = nextShuttle();
        const hours = (C.hours || []).filter(h => h.show !== false);
        const hasGuest = state.name.trim() || state.room.trim();
        const ann = C.announcement && C.announcement.enabled && L(C.announcement.text);
        const reception = (C.contacts.frontDeskDial || '').replace(/[^\d+]/g, '');
        return `
        <header class="topbar">
            ${img(C.hotel.logoUrl, '', C.hotel.name)}
            <div class="t"><b>${esc(t('portalTitle'))}</b><small>${esc(C.hotel.name)}</small></div>
            <button class="lang-chip" data-act="openPanel" data-arg="lang" aria-label="${esc(t('language'))}">${icon('globe', 16)} ${state.lang.toUpperCase()}</button>
        </header>
        <main class="content">
            ${FROM_PORTAL ? portalBanner() : ''}
            ${offline ? `<div class="banner">${icon('alert', 18)}<div class="grow">${esc(t('offline'))}</div></div>` : ''}
            ${ann ? `<div class="banner info">${icon('megaphone', 18)}<div class="grow">${esc(ann)}</div></div>` : ''}

            <div class="greet">
                <h2>${esc(greeting())}${state.name.trim() ? `, ${esc(state.name.trim().split(' ')[0])}` : ''}</h2>
                ${hasGuest
                    ? `<p>${state.room.trim() ? `${esc(t('room'))} ${esc(state.room.trim())} · ` : ''}<button data-act="openPanel" data-arg="guest">${esc(t('edit'))}</button></p>`
                    : `<p><button data-act="openPanel" data-arg="guest">${icon('plus', 14, 'inline')} ${esc(t('addDetails'))}</button></p>`}
            </div>

            ${hours.length ? `<section><h3 class="section-title">${esc(t('today'))}</h3><div class="today">
                ${hours.map(h => { const s = hoursStatus(h); return `<div class="pill-card"><b>${esc(L(h.label))}</b><div class="t">${esc(t('range', { a: h.open, b: h.close }))}</div><div class="status ${s.cls}">${esc(s.text)}</div></div>`; }).join('')}
            </div></section>` : ''}

            <section><h3 class="section-title">${esc(t('services'))}</h3><div class="tiles">
                <button class="tile" data-act="openPanel" data-arg="menu"><span class="ib c-orange">${icon('utensils', 22)}</span><span><b>${esc(t('menu'))}</b><small>${esc(t('menuSub'))}</small></span></button>
                <button class="tile" data-act="openPanel" data-arg="activities"><span class="ib c-teal">${icon('compass', 22)}</span><span><b>${esc(t('activities'))}</b><small>${esc(t('activitiesSub'))}</small></span></button>
                <button class="tile" data-act="openPanel" data-arg="shuttle"><span class="ib c-purple">${icon('bus', 22)}</span><span><b>${esc(t('shuttle'))}</b><small>${esc(t('shuttleSub'))}</small></span></button>
                <button class="tile" data-act="openPanel" data-arg="wifi"><span class="ib c-green">${icon('wifi', 22)}</span><span><b>${esc(t('wifi'))}</b><small>${esc(t('wifiTileSub'))}</small></span></button>
            </div></section>

            <section><h3 class="section-title">${esc(t('info'))}</h3><div class="list">
                ${ns ? `<button class="row" data-act="openPanel" data-arg="shuttle">${icon('clock', 20)}<span class="grow"><b>${esc(t('nextShuttle', { t: ns.time }))}${ns.tomorrow ? ` (${esc(t('tomorrow'))})` : ''}</b><small class="accent">${esc(ns.label)}</small></span>${icon('chevronRight', 18, 'end')}</button>` : ''}
                <div class="row">${icon('calendar', 20)}<span class="grow"><b>${esc(t('departure', { t: C.departure.time }))}</b>
                    ${C.departure.lateCheckout ? `<small><a class="accent" href="${esc(wa(t('lateMsg')))}" target="_blank" rel="noopener">${esc(t('lateCheckout'))}</a></small>` : ''}</span></div>
                <button class="row" data-act="openPanel" data-arg="directory">${icon('phone', 20)}<span class="grow"><b>${esc(t('directory'))}</b></span>${icon('chevronRight', 18, 'end')}</button>
                <button class="row" data-act="openPanel" data-arg="about">${icon('info', 20)}<span class="grow"><b>${esc(t('about'))}</b></span>${icon('chevronRight', 18, 'end')}</button>
                <button class="row" data-act="openPanel" data-arg="guidelines">${icon('shield', 20)}<span class="grow"><b>${esc(t('guidelines'))}</b></span>${icon('chevronRight', 18, 'end')}</button>
                ${reception ? `<a class="row" href="tel:${esc(reception)}">${icon('phone', 20)}<span class="grow"><b>${esc(t('callReception'))}</b><small>${esc(C.contacts.frontDesk)}</small></span></a>` : ''}
            </div></section>

            ${sponsorCard()}
        </main>
        <a class="fab" href="${esc(wa(t('waHello')))}" target="_blank" rel="noopener">${icon('message', 22)} ${esc(t('chat'))}</a>
        ${renderPanel()}`;
    }

    // ------------------------------------------------------------------
    // Panels
    // ------------------------------------------------------------------
    function tabs(group, items, active) {
        return `<div class="tabs" role="tablist">${items.map(i => `<button role="tab" aria-selected="${i.id === active}" class="tab ${i.id === active ? 'on' : ''}" data-act="tab" data-group="${group}" data-arg="${esc(i.id)}">${esc(L(i.label))}</button>`).join('')}</div>`;
    }

    function pMenu() {
        const m = C.menu, cats = m.categories || [];
        const active = cats.find(c => c.id === state.tab.menu) || cats[0];
        if (!active) return '';
        const svc = active.served && (C.hours || []).find(h => h.id === active.served);
        const needsRoom = !state.room.trim();
        return `${img(m.bannerImage, 'banner-img', m.name)}
            ${tabs('menu', cats, active.id)}
            ${needsRoom ? `<div class="banner info" style="margin-bottom:12px">${icon('door', 18)}<div class="grow">${esc(t('addRoom'))}</div><button class="btn btn-sm" data-act="openPanel" data-arg="guest">${esc(t('add'))}</button></div>` : ''}
            ${svc ? `<div class="served">${icon('clock', 14)} ${esc(t('served', { a: svc.open, b: svc.close }))}</div>` : ''}
            ${L(active.note) ? `<p class="note">${esc(L(active.note))}</p>` : ''}
            ${(active.items || []).map(i => `<div class="dish ${i.soldOut ? 'out' : ''}">
                <div class="grow"><b>${esc(i.name)}</b>${i.desc ? `<p>${esc(i.desc)}</p>` : ''}</div>
                <div class="side"><span class="price">${esc(i.price)}</span>
                ${i.soldOut ? `<span class="soldout">${esc(t('soldOut'))}</span>`
                    : `<a class="order-btn" href="${esc(wa(t('orderMsg', { item: i.name })))}" target="_blank" rel="noopener">${icon('message', 14)} ${esc(t('order'))}</a>`}</div>
            </div>`).join('')}
            <p class="small-print">${esc(L(m.allergyNote))}</p>`;
    }

    function pActivities() {
        const a = C.activities;
        const desk = a.deskExt ? `<div class="list" style="margin-top:4px"><div class="row">${icon('phone', 20)}<span class="grow"><b>${esc(t('heritageDesk'))}</b><small>${esc(t('dialNote'))}</small></span><span class="ext">${esc(a.deskExt)}</span></div></div>` : '';
        return `${img(a.bannerImage, 'banner-img', a.provider)}
            <div class="provider"><b>${esc(a.provider)}</b><span>${esc(L(a.tagline))}</span></div>
            <div class="act-grid">${(a.featured || []).map(f => `<a class="act" href="${esc(tracked(f.url))}" target="_blank" rel="noopener">
                <div class="art">${safeUrl(f.image) ? img(f.image, '', f.name) : icon(f.icon || 'compass', 40)}</div>
                <div class="bd"><b>${esc(f.name)}</b><p>${esc(L(f.blurb))}</p><span class="go">${esc(t('viewBook'))} ${icon('external', 14)}</span></div></a>`).join('')}</div>
            <div class="stack">
                ${safeUrl(a.browseUrl) ? `<a class="btn btn-primary" href="${esc(tracked(a.browseUrl))}" target="_blank" rel="noopener">${esc(t('browseAll'))} ${icon('external', 18)}</a>` : ''}
                <a class="btn btn-wa" href="${esc(wa(t('activityGeneral')))}" target="_blank" rel="noopener">${icon('message', 18)} ${esc(t('askWa'))}</a>
                ${desk}
            </div>`;
    }

    function pShuttle() {
        const s = C.shuttle, ns = nextShuttle();
        return `${img(s.bannerImage, 'banner-img', L(s.heading))}
            <h3 class="section-title">${esc(t('route'))}</h3>
            <ol class="route">${(s.route || []).map(r => `<li>${esc(r)}</li>`).join('')}</ol>
            <div class="list">
                <div class="sched-head"><span>${esc(t('toRF'))}</span><span>${esc(t('fromRF'))}</span></div>
                ${(s.schedule || []).map(r => `<div class="sched-row ${ns && !ns.tomorrow && ns.time === r.toRainforest ? 'next' : ''}">
                    <span>${esc(r.toRainforest)}${ns && !ns.tomorrow && ns.time === r.toRainforest ? `<span class="tag">${esc(t('next'))}</span>` : ''}</span><span style="color:var(--ink-2)">${esc(r.fromRainforest)}</span></div>`).join('')}
            </div>
            <ul class="notes">${(s.notes || []).map(n => `<li>${esc(L(n))}</li>`).join('')}</ul>
            <div class="stack"><a class="btn btn-wa" href="${esc(wa(t('taxiMsg')))}" target="_blank" rel="noopener">${icon('message', 18)} ${esc(t('taxi'))}</a></div>`;
    }

    function pDirectory() {
        return `<p class="note" style="font-style:normal">${icon('info', 14, 'inline')} ${esc(t('dialNote'))}</p>
            <div class="list">${(C.directory || []).map(d => `<div class="row"><span class="grow"><b>${esc(L(d.name))}</b></span><span class="ext">${icon('phone', 14)} ${esc(d.ext)}</span></div>`).join('')}</div>`;
    }

    function pAbout() {
        const cats = C.about.categories || [];
        const active = cats.find(c => c.id === state.tab.about) || cats[0];
        if (!active) return '';
        const hourRows = active.id === 'dining' ? (C.hours || []).filter(h => h.show !== false && h.id !== 'pool') : [];
        const rows = active.rows || [];
        return `${tabs('about', cats, active.id)}
            ${(active.paragraphs || []).map(p => L(p)).filter(Boolean).map(p => `<p class="para">${esc(p)}</p>`).join('')}
            ${hourRows.length ? `<h3 class="section-title" style="margin-top:6px">${esc(t('diningHours'))}</h3><div class="list" style="margin-bottom:12px">${hourRows.map(h => `<div class="row"><span class="grow"><b>${esc(L(h.label))}</b></span><span class="accent">${esc(t('range', { a: h.open, b: h.close }))}</span></div>`).join('')}</div>` : ''}
            ${rows.length ? `<div class="list">${rows.map(r => {
                const href = safeUrl(r.href);
                const v = r.value ? (href ? `<a class="accent" href="${esc(href)}">${esc(r.value)}</a>` : `<span class="accent">${esc(r.value)}</span>`) : '';
                return `<div class="row"><span class="grow"><b>${esc(L(r.label))}</b></span>${v}</div>`;
            }).join('')}</div>` : ''}`;
    }

    function pGuidelines() {
        return (C.policies || []).map(p => `<div class="policy"><b>${esc(L(p.title))}</b><p>${esc(L(p.desc))}</p></div>`).join('');
    }

    function pGuest() {
        return `<p class="sub" style="margin-top:0">${esc(t('detailsSub'))}</p>${detailsForm(t('save'), 'saveGuestPanel')}`;
    }

    function pLang() {
        return `<div class="lang-list" style="max-width:none">${LANGS.map(l => `<button class="lang-btn ${state.lang === l.code ? 'on' : ''}" data-act="switchLang" data-arg="${l.code}">
            <span class="flag" aria-hidden="true">${l.flag}</span><span class="name">${l.label}</span>${state.lang === l.code ? icon('check', 18) : ''}</button>`).join('')}</div>`;
    }

    function renderPanel() {
        const p = state.panel;
        if (!p) return '';
        const map = {
            menu: [C.menu.name, pMenu], activities: [t('activities'), pActivities], shuttle: [L(C.shuttle.heading) || t('shuttle'), pShuttle],
            wifi: [t('wifiTitle'), () => `<div style="padding-top:6px">${wifiCard()}</div>`], directory: [t('directory'), pDirectory],
            about: [t('about'), pAbout], guidelines: [t('guidelines'), pGuidelines], guest: [t('detailsTitle'), pGuest], lang: [t('language'), pLang]
        };
        const [title, fn] = map[p] || ['', () => ''];
        return `<div class="panel" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="panel-inner ${state.panel !== lastPanel ? 'anim' : ''}">
            <div class="panel-head"><button class="icon-btn" data-act="closePanel" aria-label="${esc(t('back'))}">${icon('chevronLeft', 24)}</button>
                <h2>${esc(title)}</h2><button class="icon-btn" data-act="closePanel" aria-label="${esc(t('close'))}">${icon('x', 22)}</button></div>
            <div class="panel-body" id="panel-body">${fn()}</div></div></div>`;
    }

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------
    let lastPanel = null;
    function render() {
        const scroll = document.getElementById('panel-body');
        const same = state.panel === lastPanel;
        const keep = scroll && same ? scroll.scrollTop : 0;
        const tabsEl = document.querySelector('.tabs');
        const keepTabs = tabsEl && same ? tabsEl.scrollLeft : 0;
        const todayEl = document.querySelector('.today');
        const keepToday = todayEl ? todayEl.scrollLeft : 0;
        const views = { loading: vLoading, error: vError, language: vLanguage, welcome: vWelcome, details: vDetails, wifi: vWifi, portal: vPortal };
        document.documentElement.lang = state.lang || 'en';
        document.body.style.overflow = state.panel ? 'hidden' : '';
        app.innerHTML = `<div class="shell">${(views[state.view] || vLoading)()}</div>
            ${state.toast ? `<div class="toast" role="status">${esc(state.toast)}</div>` : ''}
            ${PREVIEW ? '<div class="preview-flag">PREVIEW</div>' : ''}`;
        const nb = document.getElementById('panel-body');
        if (nb && keep) nb.scrollTop = keep;
        const nt = document.querySelector('.tabs');
        if (nt) {
            nt.scrollLeft = keepTabs;
            const on = nt.querySelector('.tab.on');
            if (on && (on.offsetLeft < nt.scrollLeft || on.offsetLeft + on.offsetWidth > nt.scrollLeft + nt.clientWidth)) nt.scrollLeft = on.offsetLeft - 16;
        }
        const nd = document.querySelector('.today');
        if (nd) nd.scrollLeft = keepToday;
        lastPanel = state.panel;
    }

    // ------------------------------------------------------------------
    // Events (one delegated listener; no inline JS)
    // ------------------------------------------------------------------
    function readForm() {
        const n = document.getElementById('g-name'), r = document.getElementById('g-room');
        if (n) state.name = n.value.trim();
        if (r) state.room = r.value.trim();
        persist();
    }
    app.addEventListener('click', (e) => {
        const el = e.target.closest('[data-act]');
        if (!el) return;
        const a = el.dataset.act, arg = el.dataset.arg;
        switch (a) {
            case 'pickLang': state.lang = arg; persist(); go('welcome'); break;
            case 'switchLang': state.lang = arg; persist(); closePanel(); break;
            case 'go': go(arg); break;
            case 'back': history.back(); break;
            case 'saveDetails': readForm(); go('wifi'); break;
            case 'skipDetails': go('wifi'); break;
            case 'finishOnboarding': state.onboarded = true; persist(); go('portal'); break;
            case 'saveGuestPanel': readForm(); closePanel(); break;
            case 'openPanel': openPanel(arg); break;
            case 'closePanel': closePanel(); break;
            case 'tab': state.tab[el.dataset.group] = arg; render(); { const b = document.getElementById('panel-body'); if (b) b.scrollTop = 0; } break;
            case 'copyPass': copy(C.wifi.password, t('copied')); break;
            case 'copyLink': copy(location.origin + location.pathname, t('linkCopied')); break;
            case 'retry': state.view = 'loading'; render(); load(); break;
        }
    });
    app.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.target.id === 'g-name' || e.target.id === 'g-room')) {
            const btn = app.querySelector('[data-act="saveDetails"],[data-act="saveGuestPanel"]');
            if (btn) btn.click();
        }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.panel) closePanel(); });

    // Keep "today" status and shuttle countdown fresh while the app is open.
    setInterval(() => { if (state.view === 'portal' && !document.querySelector('input:focus')) render(); }, 30000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && state.view === 'portal') render(); });

    // ------------------------------------------------------------------
    // Load content
    // ------------------------------------------------------------------
    function start() {
        if (!state.lang) state.lang = (navigator.language || 'en').slice(0, 2);
        if (!T[state.lang]) state.lang = 'en';
        const first = (state.onboarded && saved.lang) ? 'portal' : 'language';
        state.view = first;
        history.replaceState({ view: first, panel: null }, '');
        render();
    }
    async function load() {
        if (PREVIEW) {
            // Admin preview: content is passed in by the admin page.
            try { C = JSON.parse(sessionStorage.getItem('azc-preview') || localStorage.getItem('azc-preview')); } catch { C = null; }
            if (C) { state.onboarded = true; state.lang = state.lang || 'en'; state.view = 'portal'; history.replaceState({ view: 'portal', panel: null }, ''); render(); return; }
        }
        try {
            const r = await fetch('/api/content', { cache: 'no-store' });
            if (!r.ok) throw new Error(r.status);
            C = await r.json();
            store.set('azc-content-cache', C);
            offline = false;
        } catch (err) {
            C = (() => { try { return JSON.parse(localStorage.getItem('azc-content-cache')); } catch { return null; } })();
            offline = Boolean(C);
            if (!C) { state.lang = state.lang || 'en'; state.view = 'error'; render(); return; }
        }
        start();
    }
    window.addEventListener('message', (e) => {
        if (e.origin !== location.origin || !e.data || e.data.type !== 'azc-preview') return;
        C = e.data.content;
        if (e.data.lang) state.lang = e.data.lang;
        if (state.view === 'loading' || state.view === 'error') { state.onboarded = true; state.view = 'portal'; }
        render();
    });

    load();
})();
