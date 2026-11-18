/* =========================================================
   El Tawassol - أدوات مشتركة، التخطيط العام، والعناصر العائمة
   ========================================================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stageName = id => t(STAGES.find(s => s.id === id)?.key || id);
const yearLabel = (stage, year) =>
  State.lang === 'fr' ? `${year}e année ${stageName(stage)}`
  : State.lang === 'en' ? `${stageName(stage)} – Year ${year}`
  : `السنة ${year} ${stageName(stage)}`;
const fmtDA = n => n.toLocaleString('fr-DZ') + ' دج';
const BASE_URL = 'https://el-tawassol.web.app';

function toast(msg, type = 'ok') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3000);
}

/** تنبيه بصري قوي: وميض الشاشة + اهتزاز الهاتف (بديل الصوت) */
function flashAlert(text) {
  const f = document.createElement('div');
  f.className = 'flash-alert';
  f.innerHTML = `<div class="flash-card"><div class="flash-icon">🔔</div><div>${text}</div></div>`;
  document.body.appendChild(f);
  if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
  f.onclick = () => f.remove();
  setTimeout(() => f.remove(), 4500);
}

function logoHTML(small) {
  return `<span class="logo ${small ? 'sm' : ''}"><img class="logo-img" src="assets/tawassol-horizontal.png" alt="${t('brand')}" /></span>`;
}

function langSelect() {
  return `<select class="lang-select" id="langSelect" aria-label="Language">
    ${Object.entries(I18N).map(([k, v]) => `<option value="${k}" ${State.lang === k ? 'selected' : ''}>${v.langName}</option>`).join('')}
  </select>`;
}

function qrImg(size = 140) {
  return `<img class="qr" width="${size}" height="${size}" alt="QR"
    src="https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&data=${encodeURIComponent(BASE_URL)}"
    onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'qr qr-fallback',textContent:'QR'}))" />`;
}

/* ---------- التخطيط العام للزوار ---------- */
function publicLayout() {
  return `
  <div class="demo-ribbon">🧪 ${t('demo_note')}</div>
  <header class="site-header">
    <a href="#/" class="brand-link">${logoHTML()}</a>
    <button class="menu-btn" id="menuBtn" aria-label="menu">☰</button>
    <nav class="site-nav" id="siteNav">
      <a href="#/">${t('nav_home')}</a>
      <a href="#/about">${t('nav_about')}</a>
      <a href="#/courses">${t('nav_courses')}</a>
      <a href="kids/index.html">${t('nav_channel')}</a>
      <a href="#/faq">${t('nav_faq')}</a>
      <a href="#/contact">${t('nav_contact')}</a>
    </nav>
    <div class="header-actions">
      ${langSelect()}
      <a class="btn btn-ghost" href="#/login">${t('login')}</a>
      <a class="btn btn-primary" href="#/register">${t('register')}</a>
    </div>
  </header>
  <main id="view"></main>
  <footer class="site-footer">
    <div class="footer-grid">
      <div>
        ${logoHTML()}
        <p class="muted">${t('tagline')}</p>
        <div class="socials"><span>📘</span><span>📸</span><span>▶️</span><span>💬</span></div>
      </div>
      <div>
        <h4>${t('brandShort')}</h4>
        <a href="#/about">${t('nav_about')}</a>
        <a href="#/courses">${t('nav_courses')}</a>
        <a href="#/join">${t('nav_join')}</a>
        <a href="kids/index.html">${t('nav_channel')}</a>
      </div>
      <div>
        <h4>${t('nav_contact')}</h4>
        <a href="#/faq">${t('nav_faq')}</a>
        <a href="#/terms">${t('terms')}</a>
        <a href="#/contact">${t('nav_contact')}</a>
        <span class="muted">📧 contact@el-tawassol.dz</span>
      </div>
      <div class="footer-qr">
        ${qrImg(110)}
        <small>${t('qr_title')}</small>
      </div>
    </div>
    <div class="footer-bottom">© 2026 ${t('brand')} — ${t('footer_rights')}</div>
  </footer>`;
}

/* ---------- تخطيط لوحة التحكم (بعد الدخول) ---------- */
const MENUS = {
  student: [
    ['#/student', '🏠', 'dashboard'], ['#/stages', '🎓', 'choose_stage'], ['#/subjects', '📚', 'my_lessons'],
    ['#/dictionary', '🤟', 'dictionary'], ['#/report', '📊', 'report'], ['#/private', '🗓️', 'private_lesson'],
    ['#/support', '💚', 'support'], ['#/notifications', '🔔', 'notifications'], ['kids/index.html', '🧸', 'nav_channel'],
  ],
  teacher: [['#/teacher', '🏠', 'dashboard'], ['#/teacher/upload', '⬆️', 'upload_lesson'], ['#/teacher/corrections', '✅', 'corrections'], ['#/teacher/requests', '🗓️', 'private_lesson']],
  admin: [['#/admin', '🏠', 'dashboard'], ['#/admin/users', '👥', 'users'], ['#/admin/activations', '⏳', 'activations'], ['#/admin/teachers', '🧑‍🏫', 'teacher_apps']],
  psy: [['#/psy', '🏠', 'dashboard'], ['#/psy/sessions', '📅', 'sessions'], ['#/psy/children', '🧒', 'children']],
};
const MENU_LABELS = {
  upload_lesson: 'رفع درس جديد', corrections: 'التصحيحات', users: 'المستخدمون', activations: 'تفعيل الحسابات',
  teacher_apps: 'طلبات الأساتذة', sessions: 'الجلسات', children: 'الأطفال المتابَعون',
};
const ROLE_NAMES = { student: 'تلميذ', teacher: 'أستاذ', admin: 'مدير', psy: 'أخصائي نفساني / أرطفوني' };

function appLayout() {
  const u = State.session;
  const route = location.hash.split('?')[0] || '#/';
  const unread = !State.readNotifs && u.role === 'student';
  return `
  <div class="app-shell">
    <aside class="sidebar" id="sidebar">
      <a href="#/" class="brand-link">${logoHTML(true)}</a>
      <div class="user-box">
        <span class="user-avatar">${u.avatar}</span>
        <div><b>${esc(u.name)}</b><small>${ROLE_NAMES[u.role]}</small></div>
      </div>
      <nav class="side-nav">
        ${MENUS[u.role].map(([href, icon, key]) => `
          <a href="${href}" class="${route === href ? 'active' : ''}"><span>${icon}</span>${MENU_LABELS[key] || t(key)}</a>`).join('')}
      </nav>
      <button class="btn btn-ghost logout" id="logoutBtn">🚪 ${t('logout')}</button>
    </aside>
    <div class="app-main">
      <header class="app-header">
        <button class="menu-btn" id="sideBtn" aria-label="menu">☰</button>
        <div class="demo-pill">🧪 ${t('demo_note')}</div>
        <div class="header-actions">
          ${langSelect()}
          ${u.role === 'student' ? `<a class="icon-btn bell ${unread ? 'unread' : ''}" href="#/notifications" title="${t('notifications')}">🔔</a>` : ''}
          <span class="user-avatar sm">${u.avatar}</span>
        </div>
      </header>
      <main id="view"></main>
    </div>
  </div>`;
}

/* ---------- المعلم المساعد (روبوت الأسئلة) ---------- */
const Assistant = (() => {
  const answers = [
    [/تسجيل|اشتراك|سجل|inscri|sign/i, 'للتسجيل اضغط زر "التسجيل" أعلى الصفحة، ثم اتبع الخطوات الخمس: الاستمارة ← التشخيص المجاني ← الدفع ← التفعيل ← الدخول.'],
    [/دفع|سعر|ثمن|price|paie|prix/i, 'يمكنك الدفع ببطاقة CIB أو الذهبية أو بحوالة بريدية/بنكية. الاشتراك الشهري 3000 دج والسنوي 25000 دج.'],
    [/تفعيل|activ/i, 'يتم تفعيل الحساب تلقائياً خلال 24 إلى 48 ساعة بعد تأكيد الدفع.'],
    [/خلية|cell/i, 'الخلية هي الوحدة البنائية والوظيفية للكائن الحي، وتتكون من غشاء وهيولى ونواة. 🔬 راجع درس "الخلية" في السنة الأولى متوسط.'],
    [/تنفس|respir|breath/i, 'التنفس: شهيق (دخول الأكسجين) وزفير (خروج CO₂). التبادل الغازي يحدث في الحويصلات الرئوية. 🫁'],
    [/adn|dna|وراث/i, 'ADN جزيء على شكل لولب مضاعف، قواعده متكاملة: A مع T و C مع G. 🧬'],
    [/إشارة|اشارة|signe|sign language/i, 'يمكنك تعلّم لغة الإشارة مجاناً عبر "قناة تعلّم لغة الإشارة"، ولكل مادة قاموس إشاري خاص بها. 🤟'],
    [/نفس|أرطفون|ارطفون|نطق|قلق|حزين|psy|ortho|support/i, 'نحن هنا من أجلك 💚. يمكنك حجز جلسة مع أخصائي نفساني أو أرطفوني من قسم "المرافقة النفسية والأرطفونية".'],
    [/أستاذ|استاذ|معلم|teacher|prof/i, 'يمكنك اختيار أستاذك من بين 2 إلى 3 أساتذة لكل مادة، أو طلب درس خصوصي عن بُعد.'],
    [/مرحبا|سلام|bonjour|hello|hi/i, 'أهلاً وسهلاً! 😊 كيف يمكنني مساعدتك اليوم؟'],
  ];
  const reply = q => (answers.find(([re]) => re.test(q)) || [, 'سؤال جيد! 🤔 في النسخة النهائية سأجيبك بالذكاء الاصطناعي (Gemini). حالياً جرّب أسئلة عن: التسجيل، الدفع، الخلية، التنفس، لغة الإشارة...'])[1];

  function mount() {
    if ($('#assistant')) return;
    const w = document.createElement('div');
    w.id = 'assistant';
    w.innerHTML = `
      <div class="chat-panel" id="chatPanel" hidden>
        <div class="chat-head"><span>🤖 ${t('assistant')}</span><button id="chatClose" aria-label="close">✖</button></div>
        <div class="chat-body" id="chatBody"><div class="msg bot">${t('assistant_hi')}</div></div>
        <div class="chat-suggest">
          ${['كيف أسجّل؟', 'ما هي الخلية؟', 'طرق الدفع', 'المرافقة النفسية والأرطفونية'].map(s => `<button>${s}</button>`).join('')}
        </div>
        <form class="chat-input" id="chatForm"><input id="chatInput" placeholder="${t('assistant_ph')}" autocomplete="off"/><button>${t('send')}</button></form>
      </div>
      <button class="chat-fab" id="chatFab" title="${t('assistant')}">🤖</button>`;
    document.body.appendChild(w);
    const body = $('#chatBody');
    const ask = q => {
      if (!q.trim()) return;
      body.insertAdjacentHTML('beforeend', `<div class="msg me">${esc(q)}</div><div class="msg bot typing">...</div>`);
      body.scrollTop = body.scrollHeight;
      setTimeout(() => {
        body.querySelector('.typing').outerHTML = `<div class="msg bot">${reply(q)}</div>`;
        body.scrollTop = body.scrollHeight;
      }, 700);
    };
    $('#chatFab').onclick = () => { $('#chatPanel').hidden = !$('#chatPanel').hidden; $('#chatInput').focus(); };
    $('#chatClose').onclick = () => ($('#chatPanel').hidden = true);
    $('#chatForm').onsubmit = e => { e.preventDefault(); ask($('#chatInput').value); $('#chatInput').value = ''; };
    $$('.chat-suggest button', w).forEach(b => (b.onclick = () => ask(b.textContent)));
  }
  function remount() { $('#assistant')?.remove(); mount(); }
  return { mount, remount };
})();
