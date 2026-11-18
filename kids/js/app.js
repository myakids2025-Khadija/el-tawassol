/* =========================================================
   أكاديمية الأمل - التطبيق الرئيسي (التوجيه والواجهات)
   ========================================================= */

/* ---------- أدوات مساعدة ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const app = $('#app');

function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content;
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const sample = (arr, n) => shuffle(arr).slice(0, n);
const toArabicDigits = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function vibrate(pattern) {
  if (Store.settings.vibration && navigator.vibrate) navigator.vibrate(pattern);
}

/** تغذية راجعة بصرية كبيرة (بديل الأصوات) */
function showFeedback(ok, text) {
  const fb = $('#feedback');
  fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
  fb.innerHTML = ok
    ? `<div class="fb-icon">🌟</div><div class="fb-text">${text || 'أحسنت!'}</div>`
    : `<div class="fb-icon">🤔</div><div class="fb-text">${text || 'حاول مرة أخرى'}</div>`;
  fb.hidden = false;
  vibrate(ok ? [60, 40, 60] : 250);
  clearTimeout(showFeedback.t);
  showFeedback.t = setTimeout(() => (fb.hidden = true), ok ? 900 : 1100);
}

function confetti() {
  if (Store.settings.reduceMotion) return;
  const items = ['⭐', '🎉', '🌟', '✨', '🎈', '💛'];
  for (let i = 0; i < 30; i++) {
    const s = document.createElement('span');
    s.className = 'confetti';
    s.textContent = items[i % items.length];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDelay = Math.random() * 0.6 + 's';
    s.style.fontSize = 18 + Math.random() * 22 + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3000);
  }
}

function refreshHeader() {
  const p = Store.current;
  $('#starsCount').textContent = p ? p.stars : 0;
  $('#profileAvatar').textContent = p ? p.avatar : '👤';
  $('#profileName').textContent = p ? p.name : 'اختر طفلاً';
}

function applySettings() {
  const s = Store.settings;
  document.documentElement.style.setProperty('--font-scale', s.fontScale);
  document.body.classList.toggle('high-contrast', s.highContrast);
  document.body.classList.toggle('reduce-motion', s.reduceMotion);
}

function requireProfile() {
  if (Store.current) return true;
  app.innerHTML = '';
  app.appendChild(h(`
    <section class="empty-state">
      <div class="big-emoji">👋</div>
      <h2>مرحباً! من سيتعلم اليوم؟</h2>
      <p>أنشئ ملفاً للطفل أولاً لحفظ النجوم والتقدم.</p>
      <a class="btn btn-primary btn-lg" href="#/profiles">➕ إنشاء ملف طفل</a>
    </section>`));
  return false;
}

/* ---------- تهجئة الكلمة بالأصابع ---------- */
const LETTER_MAP = { 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ى': 'ي', 'ئ': 'ي', 'ؤ': 'و', 'ة': 'ه' };
function spellLetters(word) {
  return [...word]
    .map(c => LETTER_MAP[c] || c)
    .map(c => LETTERS.find(l => l.char === c))
    .filter(Boolean);
}

/* ---------- النافذة المنبثقة (عرض العناصر بالتسلسل) ---------- */
const Modal = {
  open(items, index, builder) {
    this.items = items; this.index = index; this.builder = builder;
    $('#modal').hidden = false;
    document.body.classList.add('no-scroll');
    this.render();
  },
  close() {
    $('#modal').hidden = true;
    document.body.classList.remove('no-scroll');
    $('#modalBody').innerHTML = '';
    if (this.onClose) { const f = this.onClose; this.onClose = null; f(); }
  },
  go(delta) {
    const n = this.items.length;
    this.index = (this.index + delta + n) % n;
    this.render();
  },
  render() {
    const item = this.items[this.index];
    const b = this.builder(item);
    const learned = Store.isLearned(b.key);
    const body = $('#modalBody');
    body.innerHTML = `
      <div class="detail">
        <div class="detail-sign" id="signBox"></div>
        <div class="detail-info">
          ${b.html}
          ${b.spell ? `<div class="spell-row"><div class="spell-label">✋ تهجئة بالأصابع:</div>
            <div class="spell-chips">${b.spell.map(l => `<button class="spell-chip" data-letter="${l.id}">${l.char}</button>`).join('')}</div></div>` : ''}
          <button class="btn ${learned ? 'btn-done' : 'btn-success'} btn-lg" id="learnBtn">
            ${learned ? '✔ تعلّمتها' : '⭐ تعلّمتها!'}
          </button>
        </div>
      </div>
      <div class="detail-nav">
        <button class="btn btn-ghost" id="prevBtn">➡ السابق</button>
        <span class="counter">${toArabicDigits(this.index + 1)} / ${toArabicDigits(this.items.length)}</span>
        <button class="btn btn-ghost" id="nextBtn">التالي ⬅</button>
      </div>`;
    Media.render($('#signBox'), b.media, b.fallback);

    $('#learnBtn').onclick = () => {
      if (!Store.current) return;
      if (Store.markLearned(b.key)) {
        showFeedback(true, '+١ ⭐');
        confetti();
        refreshHeader();
        this.dirty = true;
      }
      const btn = $('#learnBtn');
      btn.className = 'btn btn-done btn-lg';
      btn.textContent = '✔ تعلّمتها';
    };
    $('#prevBtn').onclick = () => this.go(-1);
    $('#nextBtn').onclick = () => this.go(1);
    body.querySelectorAll('.spell-chip').forEach(chip => {
      chip.onclick = () => {
        const idx = LETTERS.findIndex(l => l.id === chip.dataset.letter);
        const prev = { items: this.items, index: this.index, builder: this.builder };
        Modal.open(LETTERS, idx, letterBuilder);
        // زر للعودة إلى الكلمة
        const back = document.createElement('button');
        back.className = 'btn btn-ghost back-word';
        back.textContent = '↩ العودة إلى الكلمة';
        back.onclick = () => Modal.open(prev.items, prev.index, prev.builder);
        $('#modalBody').prepend(back);
      };
    });
  },
};
$('#modalClose').onclick = () => Modal.close();
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') Modal.close(); });
document.addEventListener('keydown', e => {
  if ($('#modal').hidden) return;
  if (e.key === 'Escape') Modal.close();
  if (e.key === 'ArrowLeft') Modal.go(1);
  if (e.key === 'ArrowRight') Modal.go(-1);
});

/* ---------- بُناة التفاصيل لكل قسم ---------- */
function letterBuilder(l) {
  return {
    key: 'letters:' + l.id,
    media: Media.pathFor('letters', l.id),
    fallback: `<span class="fb-char">${l.char}</span>`,
    html: `
      <div class="detail-big">${l.char}</div>
      <div class="detail-title">حرف ${l.name}</div>
      <div class="detail-example"><span class="ex-emoji">${l.emoji}</span><span>${l.word}</span></div>`,
  };
}
function numberBuilder(n) {
  const dots = n.value > 0 && n.value <= 10
    ? `<div class="dots">${'<span class="dot"></span>'.repeat(n.value)}</div>` : '';
  return {
    key: 'numbers:' + n.id,
    media: Media.pathFor('numbers', n.id),
    fallback: `<span class="fb-char">${n.digit}</span>`,
    html: `
      <div class="detail-big">${n.digit}</div>
      <div class="detail-sub" dir="ltr">${n.value}</div>
      <div class="detail-title">${n.name}</div>
      ${dots}`,
  };
}
function vocabBuilder(cat) {
  return item => ({
    key: `vocab:${cat}:${item.id}`,
    media: Media.pathFor('vocab', item.id, cat),
    fallback: item.swatch ? `<span class="swatch big" style="background:${item.swatch}"></span>` : `<span class="fb-emoji">${item.emoji}</span>`,
    spell: spellLetters(item.word),
    html: `
      <div class="detail-big">${item.swatch ? `<span class="swatch big" style="background:${item.swatch}"></span>` : item.emoji}</div>
      <div class="detail-title">${item.word}</div>`,
  });
}

/* ---------- الواجهات ---------- */
const Views = {
  home() {
    const p = Store.current;
    if (!p) {
      app.appendChild(h(`
        <section class="hero">
          <div class="hero-emoji">🤟</div>
          <h1>أهلاً بك في التواصل للأطفال</h1>
          <p>منصة تعليمية تفاعلية للأطفال الصم والبكم من ٣ إلى ١٧ سنة.<br/>نتعلم بالإشارة والصورة والكلمة معاً.</p>
          <a class="btn btn-primary btn-lg" href="#/profiles">🚀 ابدأ الآن</a>
        </section>
        <section class="features">
          <div class="feature"><span>👀</span><b>تعلم بصري</b><small>بدون الاعتماد على الصوت</small></div>
          <div class="feature"><span>🤟</span><b>لغة الإشارة</b><small>فيديو لكل حرف وكلمة</small></div>
          <div class="feature"><span>🎮</span><b>ألعاب ممتعة</b><small>نجوم ومكافآت</small></div>
          <div class="feature"><span>📊</span><b>متابعة التقدم</b><small>للأهل والمعلمين</small></div>
        </section>`));
      return;
    }
    const level = LEVELS.find(l => l.id === p.level);
    const sections = [
      { href: '#/letters',  emoji: '🔤', title: 'الحروف',   color: '#ff8a65', prog: progressOf('letters') },
      { href: '#/numbers',  emoji: '🔢', title: 'الأرقام',  color: '#4fc3f7', prog: progressOf('numbers') },
      { href: '#/vocab',    emoji: '📚', title: 'المفردات', color: '#aed581', prog: progressOf('vocab') },
      { href: '#/games',    emoji: '🎮', title: 'الألعاب',  color: '#ba68c8' },
      { href: '#/progress', emoji: '📊', title: 'تقدّمي',    color: '#ffd54f' },
    ];
    app.appendChild(h(`
      <section class="welcome">
        <div class="welcome-avatar">${p.avatar}</div>
        <div>
          <h1>مرحباً ${esc(p.name)} 👋</h1>
          <div class="level-pill">${level.emoji} مستوى ${level.name} (${toArabicDigits(level.ages)} سنوات)</div>
        </div>
      </section>
      <section class="section-grid">
        ${sections.map(s => `
          <a class="section-card" href="${s.href}" style="--c:${s.color}">
            <span class="section-emoji">${s.emoji}</span>
            <span class="section-title">${s.title}</span>
            ${s.prog ? `<span class="mini-bar"><i style="width:${s.prog.pct}%"></i></span>
              <small>${toArabicDigits(s.prog.done)} / ${toArabicDigits(s.prog.total)}</small>` : ''}
          </a>`).join('')}
      </section>`));
  },

  profiles() {
    const list = Store.profiles;
    app.appendChild(h(`
      <h1 class="page-title">👨‍👩‍👧 من سيتعلم اليوم؟</h1>
      <section class="profile-grid">
        ${list.map(p => `
          <div class="profile-card ${Store.current?.id === p.id ? 'active' : ''}">
            <button class="profile-select" data-id="${p.id}">
              <span class="pc-avatar">${p.avatar}</span>
              <span class="pc-name">${esc(p.name)}</span>
              <span class="pc-meta">${toArabicDigits(p.age)} سنة • ⭐ ${toArabicDigits(p.stars)}</span>
            </button>
            <div class="pc-actions">
              <button class="icon-btn" data-edit="${p.id}" title="تعديل">✏️</button>
              <button class="icon-btn" data-del="${p.id}" title="حذف">🗑️</button>
            </div>
          </div>`).join('')}
        <button class="profile-card add" id="addProfileBtn"><span class="pc-avatar">➕</span><span class="pc-name">طفل جديد</span></button>
      </section>
      <form class="profile-form card" id="profileForm" hidden>
        <h2 id="formTitle">ملف طفل جديد</h2>
        <label>الاسم<input name="name" required maxlength="20" placeholder="اسم الطفل" /></label>
        <label>العمر
          <select name="age">${Array.from({ length: 15 }, (_, i) => i + 3).map(a => `<option value="${a}">${toArabicDigits(a)} سنة</option>`).join('')}</select>
        </label>
        <div class="avatar-label">اختر صورة:</div>
        <div class="avatar-picker">${AVATARS.map((a, i) => `<label><input type="radio" name="avatar" value="${a}" ${i === 0 ? 'checked' : ''}/><span>${a}</span></label>`).join('')}</div>
        <div class="form-actions">
          <button class="btn btn-primary btn-lg" type="submit">💾 حفظ</button>
          <button class="btn btn-ghost" type="button" id="cancelForm">إلغاء</button>
        </div>
      </form>`));

    const form = $('#profileForm');
    let editing = null;
    const openForm = p => {
      editing = p;
      form.hidden = false;
      $('#formTitle').textContent = p ? 'تعديل الملف' : 'ملف طفل جديد';
      const f = form.elements;
      f.namedItem('name').value = p ? p.name : '';
      f.namedItem('age').value = p ? p.age : 6;
      const av = p ? p.avatar : AVATARS[0];
      form.querySelectorAll('[name=avatar]').forEach(r => (r.checked = r.value === av));
      form.scrollIntoView({ behavior: 'smooth' });
      f.namedItem('name').focus();
    };
    $('#addProfileBtn').onclick = () => openForm(null);
    $('#cancelForm').onclick = () => (form.hidden = true);
    form.onsubmit = e => {
      e.preventDefault();
      const f = form.elements;
      const data = {
        name: f.namedItem('name').value.trim(),
        age: Number(f.namedItem('age').value),
        avatar: (form.querySelector('[name=avatar]:checked') || {}).value || AVATARS[0],
      };
      if (!data.name) return;
      if (editing) Store.updateProfile(editing.id, data);
      else Store.addProfile(data);
      refreshHeader();
      location.hash = '#/home';
    };
    app.querySelectorAll('.profile-select').forEach(b => (b.onclick = () => {
      Store.select(b.dataset.id); refreshHeader(); location.hash = '#/home';
    }));
    app.querySelectorAll('[data-edit]').forEach(b => (b.onclick = () => openForm(Store.profiles.find(p => p.id === b.dataset.edit))));
    app.querySelectorAll('[data-del]').forEach(b => (b.onclick = () => {
      const p = Store.profiles.find(x => x.id === b.dataset.del);
      if (confirm(`هل تريد حذف ملف "${p.name}" وكل تقدّمه؟`)) { Store.removeProfile(p.id); refreshHeader(); render(); }
    }));
    if (!list.length) openForm(null);
  },

  letters() {
    if (!requireProfile()) return;
    app.appendChild(h(`
      <h1 class="page-title">🔤 الحروف العربية بلغة الإشارة</h1>
      <p class="page-sub">اضغط على الحرف لترى إشارته ومثالاً عليه.</p>
      <section class="tile-grid letters">
        ${LETTERS.map((l, i) => `
          <button class="tile ${Store.isLearned('letters:' + l.id) ? 'learned' : ''}" data-i="${i}">
            <span class="tile-char">${l.char}</span>
            <span class="tile-emoji">${l.emoji}</span>
          </button>`).join('')}
      </section>`));
    bindTiles(LETTERS, letterBuilder);
  },

  numbers() {
    if (!requireProfile()) return;
    const p = Store.current;
    const nums = p.level === 1 ? NUMBERS.filter(n => n.value <= 10) : NUMBERS;
    app.appendChild(h(`
      <h1 class="page-title">🔢 الأرقام بلغة الإشارة</h1>
      <p class="page-sub">تعلّم إشارة كل رقم، ثم العب <a href="#/game/count">لنعدّ معاً</a> و<a href="#/game/math">تحدي الحساب</a>.</p>
      <section class="tile-grid numbers">
        ${nums.map((n, i) => `
          <button class="tile ${Store.isLearned('numbers:' + n.id) ? 'learned' : ''}" data-i="${i}">
            <span class="tile-char">${n.digit}</span>
            <span class="tile-label">${n.name}</span>
          </button>`).join('')}
      </section>`));
    bindTiles(nums, numberBuilder);
  },

  vocab(cat) {
    if (!requireProfile()) return;
    if (cat && VOCAB[cat]) {
      const c = VOCAB[cat];
      app.appendChild(h(`
        <a class="back-link" href="#/vocab">➡ كل المجموعات</a>
        <h1 class="page-title">${c.emoji} ${c.title}</h1>
        <section class="tile-grid vocab">
          ${c.items.map((it, i) => `
            <button class="tile ${Store.isLearned(`vocab:${cat}:${it.id}`) ? 'learned' : ''}" data-i="${i}" style="--c:${c.color}">
              <span class="tile-emoji big">${it.swatch ? `<span class="swatch" style="background:${it.swatch}"></span>` : it.emoji}</span>
              <span class="tile-label">${it.word}</span>
            </button>`).join('')}
        </section>`));
      bindTiles(c.items, vocabBuilder(cat));
      return;
    }
    app.appendChild(h(`
      <h1 class="page-title">📚 المفردات اليومية</h1>
      <p class="page-sub">اختر مجموعة لتتعلم كلماتها بالإشارة والصورة.</p>
      <section class="section-grid">
        ${Object.entries(VOCAB).map(([key, c]) => {
          const done = c.items.filter(it => Store.isLearned(`vocab:${key}:${it.id}`)).length;
          return `
          <a class="section-card" href="#/vocab/${key}" style="--c:${c.color}">
            <span class="section-emoji">${c.emoji}</span>
            <span class="section-title">${c.title}</span>
            <span class="mini-bar"><i style="width:${(done / c.items.length) * 100}%"></i></span>
            <small>${toArabicDigits(done)} / ${toArabicDigits(c.items.length)}</small>
          </a>`;
        }).join('')}
      </section>`));
  },

  games() {
    if (!requireProfile()) return;
    const p = Store.current;
    app.appendChild(h(`
      <h1 class="page-title">🎮 الألعاب والاختبارات</h1>
      <p class="page-sub">العب واجمع النجوم! الأسئلة تتغير حسب مستواك.</p>
      <section class="section-grid">
        ${GAMES.map(g => {
          const locked = p.level < g.minLevel;
          return `
          <a class="section-card game ${locked ? 'locked' : ''}" href="${locked ? '#/games' : '#/game/' + g.id}">
            <span class="section-emoji">${locked ? '🔒' : g.emoji}</span>
            <span class="section-title">${g.title}</span>
            <small>${locked ? 'متاحة من مستوى ' + LEVELS[g.minLevel - 1].name : g.desc}</small>
          </a>`;
        }).join('')}
      </section>`));
  },

  game(id) {
    if (!requireProfile()) return;
    const g = GAMES.find(x => x.id === id);
    if (!g) { location.hash = '#/games'; return; }
    Games.start(g, app);
  },

  progress() {
    if (!requireProfile()) return;
    const p = Store.current;
    const parts = [
      { title: 'الحروف', emoji: '🔤', ...progressOf('letters') },
      { title: 'الأرقام', emoji: '🔢', ...progressOf('numbers') },
      ...Object.entries(VOCAB).map(([k, c]) => {
        const done = c.items.filter(it => Store.isLearned(`vocab:${k}:${it.id}`)).length;
        return { title: c.title, emoji: c.emoji, done, total: c.items.length, pct: Math.round((done / c.items.length) * 100) };
      }),
    ];
    const totalDone = parts.reduce((s, x) => s + x.done, 0);
    const totalAll = parts.reduce((s, x) => s + x.total, 0);
    const games = p.history;
    const avg = games.length ? Math.round(games.reduce((s, g) => s + g.score / g.total, 0) / games.length * 100) : 0;
    const gameName = id => GAMES.find(g => g.id === id)?.title || id;
    const badges = [
      { ok: p.stars >= 10, emoji: '🥉', name: '١٠ نجوم' },
      { ok: p.stars >= 50, emoji: '🥈', name: '٥٠ نجمة' },
      { ok: p.stars >= 150, emoji: '🥇', name: '١٥٠ نجمة' },
      { ok: progressOf('letters').pct === 100, emoji: '🔤', name: 'بطل الحروف' },
      { ok: progressOf('numbers').pct === 100, emoji: '🔢', name: 'بطل الأرقام' },
      { ok: games.length >= 10, emoji: '🎮', name: '١٠ ألعاب' },
    ];

    app.appendChild(h(`
      <h1 class="page-title">📊 لوحة متابعة التقدم</h1>
      <section class="stats">
        <div class="stat"><span>${p.avatar}</span><b>${esc(p.name)}</b><small>${toArabicDigits(p.age)} سنة • ${LEVELS[p.level - 1].name}</small></div>
        <div class="stat"><span>⭐</span><b>${toArabicDigits(p.stars)}</b><small>نجمة</small></div>
        <div class="stat"><span>✅</span><b>${toArabicDigits(totalDone)} / ${toArabicDigits(totalAll)}</b><small>عنصر متعلَّم</small></div>
        <div class="stat"><span>🎯</span><b>${toArabicDigits(avg)}٪</b><small>متوسط الألعاب</small></div>
      </section>

      <section class="card">
        <h2>🏅 الأوسمة</h2>
        <div class="badges">${badges.map(b => `<div class="badge ${b.ok ? '' : 'off'}"><span>${b.emoji}</span><small>${b.name}</small></div>`).join('')}</div>
      </section>

      <section class="card">
        <h2>📈 التقدم في الأقسام</h2>
        ${parts.map(x => `
          <div class="prog-row">
            <span class="prog-name">${x.emoji} ${x.title}</span>
            <span class="bar"><i style="width:${x.pct}%"></i></span>
            <span class="prog-val">${toArabicDigits(x.pct)}٪</span>
          </div>`).join('')}
      </section>

      <section class="card">
        <h2>🕹️ آخر الألعاب</h2>
        ${games.length ? `<table class="table"><thead><tr><th>اللعبة</th><th>النتيجة</th><th>التاريخ</th></tr></thead><tbody>
          ${games.slice(0, 10).map(g => `<tr><td>${gameName(g.game)}</td><td>${toArabicDigits(g.score)} / ${toArabicDigits(g.total)}</td>
            <td>${new Date(g.date).toLocaleDateString('ar')}</td></tr>`).join('')}
        </tbody></table>` : '<p class="muted">لم يلعب أي لعبة بعد. <a href="#/games">ابدأ اللعب</a></p>'}
      </section>

      ${Store.profiles.length > 1 ? `
      <section class="card">
        <h2>👨‍🏫 كل الأطفال (للمعلم / الأهل)</h2>
        <table class="table"><thead><tr><th>الطفل</th><th>العمر</th><th>النجوم</th><th>المتعلَّم</th><th>الألعاب</th></tr></thead><tbody>
          ${Store.profiles.map(c => `<tr><td>${c.avatar} ${esc(c.name)}</td><td>${toArabicDigits(c.age)}</td><td>⭐ ${toArabicDigits(c.stars)}</td>
            <td>${toArabicDigits(c.learned.length)}</td><td>${toArabicDigits(c.history.length)}</td></tr>`).join('')}
        </tbody></table>
      </section>` : ''}`));
  },

  settings() {
    const s = Store.settings;
    app.appendChild(h(`
      <h1 class="page-title">⚙️ الإعدادات</h1>
      <section class="card settings">
        <h2>👁️ العرض وسهولة الاستخدام</h2>
        <label class="setting">حجم الخط
          <input type="range" min="0.85" max="1.4" step="0.05" value="${s.fontScale}" data-set="fontScale" />
        </label>
        <label class="setting switch"><input type="checkbox" data-set="highContrast" ${s.highContrast ? 'checked' : ''}/><span>تباين عالٍ</span></label>
        <label class="setting switch"><input type="checkbox" data-set="reduceMotion" ${s.reduceMotion ? 'checked' : ''}/><span>تقليل الحركة والمؤثرات</span></label>
        <label class="setting switch"><input type="checkbox" data-set="vibration" ${s.vibration ? 'checked' : ''}/><span>الاهتزاز عند الإجابة (للأجهزة اللوحية والهواتف)</span></label>
        <label class="setting switch"><input type="checkbox" data-set="autoplay" ${s.autoplay ? 'checked' : ''}/><span>تشغيل فيديو الإشارة تلقائياً</span></label>
      </section>
      <section class="card">
        <h2>💾 البيانات</h2>
        <p class="muted">كل التقدم محفوظ على هذا الجهاز. يمكنك تصديره لنقله إلى جهاز آخر.</p>
        <div class="form-actions">
          <button class="btn btn-primary" id="exportBtn">⬇ تصدير البيانات</button>
          <label class="btn btn-ghost">⬆ استيراد<input type="file" accept=".json" id="importInput" hidden /></label>
        </div>
      </section>
      <section class="card">
        <h2>🎬 إضافة فيديوهات لغة الإشارة</h2>
        <p>ضع ملفات الفيديو (<code>.mp4</code>) أو الصور (<code>.gif</code> / <code>.png</code>) في مجلد <code>media</code> بالأسماء التالية:</p>
        <ul class="paths" dir="ltr">
          <li><code>media/letters/alef.mp4</code> … (${LETTERS.length} حرفاً)</li>
          <li><code>media/numbers/1.mp4</code> …</li>
          <li><code>media/vocab/animals/cat.mp4</code> …</li>
        </ul>
        <p class="muted">التفاصيل الكاملة وقائمة كل الأسماء في الملف <code>media/README.md</code>.</p>
      </section>`));

    app.querySelectorAll('[data-set]').forEach(inp => {
      inp.oninput = inp.onchange = () => {
        Store.setSetting(inp.dataset.set, inp.type === 'checkbox' ? inp.checked : Number(inp.value));
        applySettings();
      };
    });
    $('#exportBtn').onclick = () => {
      const blob = new Blob([Store.exportData()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `tawassol-kids-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    };
    $('#importInput').onchange = e => {
      const f = e.target.files[0];
      if (!f) return;
      f.text().then(t => {
        try { Store.importData(t); applySettings(); refreshHeader(); showFeedback(true, 'تم الاستيراد'); render(); }
        catch { showFeedback(false, 'ملف غير صالح'); }
      });
    };
  },
};

function progressOf(section) {
  let keys;
  if (section === 'letters') keys = LETTERS.map(l => 'letters:' + l.id);
  else if (section === 'numbers') {
    const nums = Store.current?.level === 1 ? NUMBERS.filter(n => n.value <= 10) : NUMBERS;
    keys = nums.map(n => 'numbers:' + n.id);
  } else keys = Object.entries(VOCAB).flatMap(([k, c]) => c.items.map(it => `vocab:${k}:${it.id}`));
  const done = keys.filter(k => Store.isLearned(k)).length;
  return { done, total: keys.length, pct: Math.round((done / keys.length) * 100) };
}

function bindTiles(items, builder) {
  app.querySelectorAll('.tile[data-i]').forEach(t => {
    t.onclick = () => {
      Modal.dirty = false;
      Modal.onClose = () => { if (Modal.dirty) render(); };
      Modal.open(items, Number(t.dataset.i), builder);
    };
  });
}

/* ---------- التوجيه ---------- */
function render() {
  const [, route = 'home', param] = (location.hash || '#/home').split('/');
  app.innerHTML = '';
  Games.stop();
  (Views[route] || Views.home)(param);
  document.querySelectorAll('[data-nav]').forEach(a => {
    const nav = a.dataset.nav;
    a.classList.toggle('active', nav === route || (route === 'game' && nav === 'games'));
  });
  refreshHeader();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', () => { if (!$('#modal').hidden) Modal.close(); render(); });
applySettings();
render();
