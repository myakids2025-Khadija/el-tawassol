/* =========================================================
   El Tawassol - فضاء التلميذ
   ========================================================= */

function currentLessons() { return LESSONS[State.stage] || []; }
function nextLesson() { return currentLessons().find(l => !State.isPassed(l.id)); }
function isLocked(idx) { return idx > 0 && !State.isPassed(currentLessons()[idx - 1].id); }

Views.student = v => {
  const u = State.session;
  const lessons = currentLessons();
  const done = lessons.filter(l => State.isPassed(l.id)).length;
  const nx = nextLesson();
  const teacher = TEACHERS.find(x => x.id === State.teacherFor('svt'));
  v.innerHTML = `
  <section class="dash">
    <div class="welcome-card">
      <div>
        <h1>مرحباً ${esc(u.name)} 👋</h1>
        <p>${yearLabel(State.stage, State.year)} • <a href="#/stages">تغيير</a></p>
      </div>
      <div class="points">⭐ ${DEMO.student.points + done * 20}<small>نقطة</small></div>
    </div>

    <div class="notice-bar" onclick="location.hash='#/notifications'">🔔 ${DEMO.notifications[0].text}</div>

    <div class="dash-grid">
      <div class="card continue-card">
        <h3>▶️ واصل التعلم</h3>
        ${nx ? `
          <div class="continue">
            <span class="c-emoji">${nx.emoji}</span>
            <div><b>${nx.title}</b><small>🌿 علوم الطبيعة والحياة • ${nx.duration}</small></div>
          </div>
          <a class="btn btn-primary" href="${teacher ? '#/lesson/' + nx.id : '#/teachers/svt'}">${teacher ? 'متابعة الدرس' : 'اختر أستاذك أولاً'}</a>`
        : '<p>🎉 أنهيت كل دروس هذه السنة!</p>'}
        <div class="progress-line"><i style="width:${lessons.length ? (done / lessons.length) * 100 : 0}%"></i></div>
        <small class="muted">${done} / ${lessons.length} دروس منجزة</small>
      </div>
      <div class="card">
        <h3>📊 أدائي</h3>
        <div class="mini-stats">
          <div><b>${DEMO.report.attendance}%</b><small>المواظبة</small></div>
          <div><b>${reportAverage().toFixed(2)}</b><small>المعدل</small></div>
          <div><b>${DEMO.report.rank}</b><small>الترتيب</small></div>
        </div>
        <a href="#/report" class="btn btn-ghost">عرض التقرير</a>
      </div>
    </div>

    <h2 class="section-title start">الوصول السريع</h2>
    <div class="quick-grid">
      ${[
        ['#/subjects', '📚', t('my_lessons'), '#3b82f6'], ['#/dictionary', '🤟', t('dictionary'), '#16a34a'],
        ['#/report', '📊', t('report'), '#f59e0b'], ['#/private', '🗓️', t('private_lesson'), '#a855f7'],
        ['#/support', '💚', t('support'), '#10b981'], ['kids/index.html', '🧸', t('nav_channel'), '#ec4899'],
      ].map(([h, e, n, c]) => `<a class="quick" href="${h}" style="--c:${c}"><span>${e}</span>${n}</a>`).join('')}
    </div>
  </section>`;
  if (!sessionStorage.getItem('hlFlashShown')) {
    sessionStorage.setItem('hlFlashShown', '1');
    setTimeout(() => flashAlert(DEMO.notifications[0].text), 1200);
  }
};

Views.stages = v => {
  v.innerHTML = `
  <section>
    <h1 class="page-title start">🎓 ${t('choose_stage')}</h1>
    <div class="stage-cards">
      ${STAGES.map(s => `
        <div class="stage-card" style="--c:${s.color}">
          <span class="stage-emoji">${s.emoji}</span><h3>${t(s.key)}</h3>
          <div class="year-buttons">
            ${Array.from({ length: s.years }, (_, i) => `
              <button class="year-btn ${State.stage === s.id && State.year === i + 1 ? 'active' : ''}" data-s="${s.id}" data-y="${i + 1}">${yearLabel(s.id, i + 1)}</button>`).join('')}
          </div>
        </div>`).join('')}
    </div>
  </section>`;
  $$('.year-btn').forEach(b => (b.onclick = () => { State.setYear(b.dataset.s, Number(b.dataset.y)); location.hash = '#/subjects'; }));
};

Views.subjects = v => {
  v.innerHTML = `
  <section>
    <h1 class="page-title start">📚 مواد ${yearLabel(State.stage, State.year)}</h1>
    <p class="muted">نبدأ مبدئياً بمادة علوم الطبيعة والحياة، وبقية المواد قريباً.</p>
    <div class="subject-grid">
      ${SUBJECTS.map(s => `
        <a class="subject-card ${s.active ? '' : 'soon'}" style="--c:${s.color}" href="${s.active ? (State.teacherFor(s.id) ? '#/lessons/' + s.id : '#/teachers/' + s.id) : '#/subjects'}">
          <span class="subject-emoji">${s.emoji}</span><b>${s.name}</b>
          ${s.active ? `<small>${currentLessons().length} دروس</small>` : `<span class="tag tag-gray">${t('coming_soon')}</span>`}
        </a>`).join('')}
    </div>
  </section>`;
};

Views.teachers = (v, params, subject) => {
  const list = TEACHERS.filter(x => x.subject === subject);
  const sub = SUBJECTS.find(s => s.id === subject);
  v.innerHTML = `
  <section>
    <a class="back" href="#/subjects">→ ${t('back')}</a>
    <h1 class="page-title start">👨‍🏫 اختر أستاذ مادة ${sub.name}</h1>
    <div class="teacher-grid">
      ${list.map(tc => `
        <div class="teacher-card ${State.teacherFor(subject) === tc.id ? 'chosen' : ''}">
          <span class="t-avatar">${tc.avatar}</span>
          <h3>${tc.name}</h3>
          <p class="muted">${tc.bio}</p>
          <div class="t-meta"><span>⭐ ${tc.rating}</span><span>🧑‍🎓 ${tc.students}</span><span>📅 ${tc.exp} سنوات</span></div>
          <span class="tag tag-green">🤟 لغة الإشارة: ${tc.sign}</span>
          <div class="t-actions">
            <button class="btn btn-primary" data-t="${tc.id}">${State.teacherFor(subject) === tc.id ? '✔ أستاذي' : 'اختيار'}</button>
            <a class="btn btn-ghost" href="#/private">درس خصوصي</a>
          </div>
        </div>`).join('')}
    </div>
  </section>`;
  $$('[data-t]').forEach(b => (b.onclick = () => { State.setTeacher(subject, b.dataset.t); toast('✅ تم اختيار الأستاذ'); location.hash = '#/lessons/' + subject; }));
};

Views.lessons = (v, params, subject) => {
  const tc = TEACHERS.find(x => x.id === State.teacherFor(subject));
  if (!tc) { location.hash = '#/teachers/' + subject; return; }
  const lessons = currentLessons();
  v.innerHTML = `
  <section>
    <a class="back" href="#/subjects">→ ${t('back')}</a>
    <div class="lessons-head">
      <h1 class="page-title start">🌿 علوم الطبيعة والحياة — ${yearLabel(State.stage, State.year)}</h1>
      <div class="chosen-teacher">${tc.avatar} ${tc.name} <a href="#/teachers/${subject}">تغيير</a></div>
    </div>
    <div class="lesson-list">
      ${lessons.map((l, i) => {
        const passed = State.isPassed(l.id), locked = isLocked(i);
        return `
        <a class="lesson-item ${passed ? 'passed' : ''} ${locked ? 'locked' : ''}" href="${locked ? 'javascript:void(0)' : '#/lesson/' + l.id}" data-locked="${locked}">
          <span class="l-num">${i + 1}</span>
          <span class="l-emoji">${l.emoji}</span>
          <div class="l-info"><b>${l.title}</b><small>🎬 فيديو + 🧏 إشارة • 📄 PDF • 📝 تمارين • ⏱️ ${l.duration}</small></div>
          <span class="l-status">${passed ? '✅ ناجح' : locked ? '🔒 مقفل' : '▶️ ابدأ'}</span>
        </a>`;
      }).join('')}
    </div>
    <p class="muted small">🔒 لا يمكن الانتقال إلى الدرس الموالي إلا بعد اجتياز تمارين الدرس السابق.</p>
  </section>`;
  $$('.lesson-item[data-locked=true]').forEach(a => (a.onclick = () => toast('🔒 أكمل تمارين الدرس السابق أولاً', 'warn')));
};

Views.lesson = (v, params, id) => {
  const lessons = currentLessons();
  const idx = lessons.findIndex(l => l.id === id);
  const l = lessons[idx];
  if (!l) { location.hash = '#/subjects'; return; }
  if (isLocked(idx)) { toast('🔒 هذا الدرس مقفل', 'warn'); location.hash = '#/lessons/svt'; return; }
  const tc = TEACHERS.find(x => x.id === State.teacherFor('svt')) || TEACHERS[0];
  const u = State.session;

  v.innerHTML = `
  <section class="lesson-page">
    <a class="back" href="#/lessons/svt">→ قائمة الدروس</a>
    <h1 class="page-title start">${l.emoji} الدرس ${idx + 1}: ${l.title}</h1>
    <div class="tabs" id="lessonTabs">
      <button class="active" data-tab="video">🎬 الفيديو</button>
      <button data-tab="pdf">📄 ملخص PDF</button>
      <button data-tab="quiz">📝 التمارين</button>
    </div>

    <div class="tab-pane" id="tab-video">
      <div class="player" id="player">
        <div class="player-stage">
          <div class="screen" id="screen">
            <div class="board">
              <div class="board-title">${l.emoji} ${l.title}</div>
              <ul class="board-lines" id="boardLines"></ul>
            </div>
            <div class="teacher-cam">${tc.avatar}<small>${tc.name}</small></div>
          </div>
          <div class="sign-window" id="signWin">
            <div class="sign-avatar">🧏‍♀️</div>
            <small>مترجمة لغة الإشارة</small>
          </div>
          <div class="watermark" id="watermark">${esc(u.name)} • ID 20431</div>
          <div class="shield" id="shield">🔒 المحتوى محمي</div>
        </div>
        <div class="captions" id="captions">اضغط ▶️ لبدء الدرس</div>
        <div class="controls">
          <button class="ctrl" id="playBtn">▶️</button>
          <div class="seek"><i id="seekBar"></i></div>
          <span id="timeLbl">0 / ${l.captions.length}</span>
          <button class="ctrl" id="signToggle" title="إظهار/إخفاء المترجم">🧏</button>
          <button class="ctrl" id="signSide" title="تبديل جهة المترجم">⇆</button>
        </div>
      </div>
      <p class="muted small">🚫 يمنع تحميل الفيديو أو تسجيل الشاشة. 🎬 (محاكاة — تُستبدل بفيديو الأستاذ الحقيقي ومترجم الإشارة)</p>
    </div>

    <div class="tab-pane" id="tab-pdf" hidden>
      <div class="pdf-sheet" id="pdfSheet">
        <div class="pdf-head">${logoHTML(true)}<span>علوم الطبيعة والحياة — ${yearLabel(State.stage, State.year)}</span></div>
        <h2>${l.emoji} ملخص الدرس: ${l.title}</h2>
        <ul>${l.summary.map(s => `<li>${s}</li>`).join('')}</ul>
        <h3>🤟 مصطلحات الدرس في القاموس الإشاري</h3>
        <div class="term-chips">${l.terms.map(x => `<a href="#/dictionary?q=${encodeURIComponent(x)}">${x}</a>`).join('')}</div>
        <div class="pdf-foot">${tc.name} • El Tawassol</div>
      </div>
      <button class="btn btn-primary" onclick="window.print()">⬇️ تحميل / طباعة PDF</button>
    </div>

    <div class="tab-pane" id="tab-quiz" hidden></div>
  </section>`;

  /* --- تبويبات --- */
  const showTab = name => {
    $$('#lessonTabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    $$('.tab-pane').forEach(p => (p.hidden = p.id !== 'tab-' + name));
  };
  $$('#lessonTabs button').forEach(b => (b.onclick = () => showTab(b.dataset.tab)));

  /* --- مشغل الفيديو (محاكاة) --- */
  let i = -1, playing = false, timer;
  const lines = $('#boardLines');
  const step = () => {
    i++;
    if (i >= l.captions.length) { stop(); $('#captions').textContent = '✅ انتهى الفيديو — انتقل إلى التمارين'; return; }
    lines.insertAdjacentHTML('beforeend', `<li>${l.captions[i]}</li>`);
    $('#captions').textContent = l.captions[i];
    $('#seekBar').style.width = ((i + 1) / l.captions.length) * 100 + '%';
    $('#timeLbl').textContent = `${i + 1} / ${l.captions.length}`;
  };
  const stop = () => { playing = false; clearInterval(timer); $('#playBtn').textContent = '▶️'; $('#signWin').classList.remove('signing'); };
  $('#playBtn').onclick = () => {
    if (playing) return stop();
    if (i >= l.captions.length - 1) { i = -1; lines.innerHTML = ''; }
    playing = true; $('#playBtn').textContent = '⏸️'; $('#signWin').classList.add('signing');
    step(); timer = setInterval(step, 3200);
  };
  $('#signToggle').onclick = () => $('#signWin').classList.toggle('hidden');
  $('#signSide').onclick = () => $('#signWin').classList.toggle('other-side');
  Views._cleanup = () => { clearInterval(timer); clearInterval(wm); window.removeEventListener('blur', onBlur); window.removeEventListener('focus', onFocus); document.removeEventListener('keyup', onKey); };

  /* --- حماية المحتوى (ردع): علامة مائية متحركة + حجب عند فقدان التركيز --- */
  const wm = setInterval(() => {
    const w = $('#watermark'); if (!w) return;
    w.style.top = 10 + Math.random() * 70 + '%'; w.style.left = 5 + Math.random() * 60 + '%';
  }, 4000);
  const player = $('#player');
  player.oncontextmenu = e => { e.preventDefault(); toast('🚫 غير مسموح', 'warn'); };
  const onBlur = () => player.classList.add('protected');
  const onFocus = () => player.classList.remove('protected');
  const onKey = e => { if (e.key === 'PrintScreen') { player.classList.add('protected'); toast('🚫 لقطات الشاشة غير مسموحة', 'warn'); setTimeout(onFocus, 1500); } };
  window.addEventListener('blur', onBlur); window.addEventListener('focus', onFocus); document.addEventListener('keyup', onKey);

  /* --- التمارين --- */
  const quiz = $('#tab-quiz');
  const drawQuiz = () => {
    quiz.innerHTML = `
      <form class="card quiz-form" id="quizForm">
        <h2>📝 تمارين التقويم</h2>
        ${State.isPassed(l.id) ? `<div class="alert ok">✅ اجتزت هذا الدرس سابقاً — يمكنك إعادة المحاولة للتدرب.</div>` : ''}
        ${l.quiz.map((q, qi) => `
          <fieldset class="q" data-q="${qi}">
            <legend>${qi + 1}. ${q.q}</legend>
            ${q.options.map((o, oi) => `<label class="q-opt"><input type="radio" name="q${qi}" value="${oi}" required /><span>${o}</span></label>`).join('')}
          </fieldset>`).join('')}
        <button class="btn btn-primary btn-lg">تصحيح الإجابات</button>
      </form>`;
    $('#quizForm').onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      let score = 0;
      l.quiz.forEach((q, qi) => {
        const ans = Number(fd.get('q' + qi));
        const fs = $(`[data-q="${qi}"]`);
        $$('.q-opt', fs).forEach((lab, oi) => {
          lab.classList.toggle('right', oi === q.a);
          lab.classList.toggle('wrong', oi === ans && ans !== q.a);
        });
        if (ans === q.a) score++;
      });
      const pass = score >= Math.ceil(l.quiz.length * 0.6);
      $$('#quizForm input').forEach(x => (x.disabled = true));
      const nx = lessons[idx + 1];
      if (pass) State.pass(l.id, score);
      e.target.querySelector('button').outerHTML = `
        <div class="result ${pass ? 'ok' : 'bad'}">
          <div class="result-score">${score} / ${l.quiz.length}</div>
          <p>${pass ? '🎉 أحسنت! اجتزت الدرس وحصلت على 20 نقطة.' : '💪 لم تنجح هذه المرة. راجع الفيديو والملخص ثم أعد المحاولة.'}</p>
          <div class="center gap">
            ${pass && nx ? `<a class="btn btn-primary btn-lg" href="#/lesson/${nx.id}">🔓 الدرس التالي: ${nx.title}</a>` : ''}
            ${pass && !nx ? `<a class="btn btn-primary btn-lg" href="#/lessons/svt">🏆 أنهيت كل الدروس!</a>` : ''}
            <button type="button" class="btn btn-ghost" id="retry">🔁 إعادة المحاولة</button>
          </div>
        </div>`;
      $('#retry').onclick = drawQuiz;
      if (pass) flashAlert(nx ? `🔓 تم فتح الدرس التالي: ${nx.title}` : '🏆 مبروك! أنهيت كل الدروس');
    };
  };
  drawQuiz();
};

Views.dictionary = (v, params) => {
  const q0 = params.get('q') || '';
  const lang = State.lang;
  v.innerHTML = `
  <section>
    <h1 class="page-title start">🤟 القاموس الإشاري — علوم الطبيعة والحياة</h1>
    <div class="dict-tools">
      <input class="search" id="dictSearch" placeholder="🔍 ابحث عن مصطلح..." value="${esc(q0)}" />
      <select id="dictSubject"><option>🌿 علوم الطبيعة والحياة</option>${SUBJECTS.filter(s => !s.active).map(s => `<option disabled>${s.emoji} ${s.name} — ${t('coming_soon')}</option>`)}</select>
    </div>
    <div class="dict-grid" id="dictGrid"></div>
  </section>`;
  const draw = q => {
    const items = SIGN_DICTIONARY.filter(d => !q || d.term.includes(q) || d.fr.toLowerCase().includes(q.toLowerCase()) || d.en.toLowerCase().includes(q.toLowerCase()));
    $('#dictGrid').innerHTML = items.length ? items.map(d => `
      <div class="dict-card">
        <div class="dict-sign"><span class="sign-anim">🧏</span><small>فيديو الإشارة</small></div>
        <div class="dict-body">
          <h3>${d.emoji} ${d.term}</h3>
          <div class="dict-trans"><span>🇫🇷 ${d.fr}</span><span>🇬🇧 ${d.en}</span></div>
          <p>${d.def}</p>
        </div>
      </div>`).join('') : '<p class="muted">لا توجد نتائج.</p>';
  };
  draw(q0);
  $('#dictSearch').oninput = e => draw(e.target.value.trim());
};

function reportAverage() {
  const r = DEMO.report.rows;
  return r.reduce((s, x) => s + x.grade * x.coef, 0) / r.reduce((s, x) => s + x.coef, 0);
}

Views.report = v => {
  const r = DEMO.report, avg = reportAverage();
  const mention = avg >= 16 ? 'امتياز' : avg >= 14 ? 'تهنئة' : avg >= 12 ? 'تشجيع' : avg >= 10 ? 'لوحة شرف' : '—';
  v.innerHTML = `
  <section class="report">
    <div class="report-head">
      ${logoHTML(true)}
      <div><h1>📊 التقرير الفصلي</h1><small>${r.term}</small></div>
      <button class="btn btn-primary no-print" onclick="window.print()">🖨️ طباعة / PDF</button>
    </div>
    <div class="card report-student">
      <span class="user-avatar">${DEMO.student.avatar}</span>
      <div><b>${DEMO.student.name}</b><small>${yearLabel(State.stage, State.year)} • الحالة السمعية: ${DEMO.student.hearing}</small></div>
      <div class="avg-box"><b>${avg.toFixed(2)}</b><small>/ 20 — ${mention}</small></div>
    </div>
    <div class="mini-stats wide">
      <div><b>${r.attendance}%</b><small>نسبة المواظبة</small></div>
      <div><b>${r.lessonsDone}</b><small>درس منجز</small></div>
      <div><b>${r.exercises}</b><small>تمرين محلول</small></div>
      <div><b>${r.rank} / ${r.classSize}</b><small>الترتيب</small></div>
    </div>
    <div class="card">
      <table class="table">
        <thead><tr><th>المادة</th><th>المعامل</th><th>العلامة</th><th>العلامة × المعامل</th><th>ملاحظة الأستاذ</th></tr></thead>
        <tbody>${r.rows.map(x => `
          <tr><td>${x.subject}</td><td>${x.coef}</td>
          <td><span class="grade ${x.grade >= 14 ? 'g-good' : x.grade >= 10 ? 'g-ok' : 'g-bad'}">${x.grade}</span></td>
          <td>${(x.grade * x.coef).toFixed(2)}</td><td>${x.remark}</td></tr>`).join('')}
        </tbody>
        <tfoot><tr><td>المعدل الفصلي</td><td>${r.rows.reduce((s, x) => s + x.coef, 0)}</td><td colspan="3"><b>${avg.toFixed(2)} / 20</b></td></tr></tfoot>
      </table>
    </div>
    <div class="card">
      <h3>📈 العلامات حسب المادة</h3>
      <div class="bars">${r.rows.map(x => `<div class="bar-col"><i style="height:${(x.grade / 20) * 100}%"><span>${x.grade}</span></i><small>${x.subject.split(' ')[0]}</small></div>`).join('')}</div>
    </div>
    <div class="card"><h3>💬 ملاحظة عامة</h3><p>تلميذ مجتهد ومنضبط، يتفاعل بشكل ممتاز مع الدروس المترجمة. ننصح بمواصلة العمل على اللغة الفرنسية.</p></div>
  </section>`;
};

Views.private = v => {
  const reqs = JSON.parse(sessionStorage.getItem('hlPrivate') || '[]');
  v.innerHTML = `
  <section>
    <h1 class="page-title start">🗓️ طلب درس خصوصي عن بُعد</h1>
    <div class="two-col">
      <form class="card form" id="privForm">
        <label>المادة<select name="subject">${SUBJECTS.map(s => `<option ${s.active ? '' : 'disabled'}>${s.name}${s.active ? '' : ' — ' + t('coming_soon')}</option>`)}</select></label>
        <label>الأستاذ<select name="teacher">${TEACHERS.filter(x => x.subject === 'svt').map(x => `<option>${x.name}</option>`)}</select></label>
        <label>التاريخ<input type="date" name="date" required /></label>
        <label>الوقت<input type="time" name="time" value="16:00" required /></label>
        <label>المدة<select name="dur"><option>30 دقيقة</option><option selected>60 دقيقة</option><option>90 دقيقة</option></select></label>
        <label>ماذا تريد أن تراجع؟<textarea name="note" rows="3" placeholder="مثال: درس التنفس، التبادل الغازي"></textarea></label>
        <div class="price-line">السعر: <b>1500 دج / ساعة</b> <small>(خصم 30% للاشتراك السنوي)</small></div>
        <button class="btn btn-primary btn-lg">إرسال الطلب</button>
      </form>
      <div class="card">
        <h3>📋 طلباتي</h3>
        <div id="reqList">${reqs.length ? reqs.map(r => `<div class="req"><b>${r.subject}</b><small>${r.teacher} • ${r.date} ${r.time} • ${r.dur}</small><span class="tag tag-orange">بانتظار تأكيد الأستاذ</span></div>`).join('') : '<p class="muted">لا توجد طلبات بعد.</p>'}</div>
      </div>
    </div>
  </section>`;
  $('#privForm').onsubmit = e => {
    e.preventDefault();
    reqs.unshift(Object.fromEntries(new FormData(e.target)));
    sessionStorage.setItem('hlPrivate', JSON.stringify(reqs));
    toast('✅ تم إرسال طلبك للأستاذ');
    Views.private(v);
  };
};

Views.support = v => {
  v.innerHTML = `
  <section>
    <div class="banner support-banner photo-bg" style="background-image:url('assets/photos/support.jpg')">
      <div><h1>💚 فضاء المرافقة النفسية والأرطفونية</h1><p>مساحة خاصة وآمنة لمرافقة أطفالنا وطمأنتهم ومساعدتهم على الاندماج في المجتمع.</p></div>
    </div>
    <div class="card mood">
      <h3>كيف تشعر اليوم؟</h3>
      <div class="mood-row">${[['😄', 'سعيد'], ['🙂', 'بخير'], ['😐', 'عادي'], ['😟', 'قلق'], ['😢', 'حزين']].map(([e, n]) => `<button data-m="${n}"><span>${e}</span><small>${n}</small></button>`).join('')}</div>
      <p id="moodMsg" class="muted"></p>
    </div>
    <div class="specialists">
      ${[['🧠', 'د. أمينة لعريبي', 'أخصائية نفسانية', 'القلق، الثقة بالنفس، الاندماج'], ['🗣️', 'أ. رشيد عيساوي', 'أخصائي أرطفونيا', 'تقويم النطق، استغلال البقايا السمعية']].map(([e, n, r, s]) => `
        <div class="card spec">
          <span class="t-avatar">${e}</span><h3>${n}</h3><b>${r}</b><small class="muted">${s}</small>
          <button class="btn btn-primary book">📅 حجز جلسة</button>
        </div>`).join('')}
    </div>
    <h2 class="section-title start">🌱 ركن الطمأنينة</h2>
    <div class="feature-grid">
      ${[['🫁', 'تمرين التنفس', 'شهيق 4 ثوانٍ، احبس 4، زفير 4.'], ['💪', 'أنت قادر', 'الصمم لا يمنعك من تحقيق أحلامك.'], ['🤝', 'تحدث إلينا', 'اكتب لنا أو راسلنا بالإشارة في أي وقت.'], ['👨‍👩‍👧', 'نصائح للأولياء', 'كيف ترافق طفلك في دراسته؟']].map(([e, n, d]) => `
        <div class="feature"><span class="f-icon">${e}</span><b>${n}</b><small>${d}</small></div>`).join('')}
    </div>
  </section>`;
  $$('.mood-row button').forEach(b => (b.onclick = () => {
    $$('.mood-row button').forEach(x => x.classList.toggle('active', x === b));
    const sad = ['قلق', 'حزين'].includes(b.dataset.m);
    $('#moodMsg').innerHTML = sad ? '💚 نحن معك. هل تريد التحدث مع الأخصائية؟ اضغط "حجز جلسة".' : '🌟 رائع! نتمنى لك يوماً جميلاً.';
  }));
  $$('.book').forEach(b => (b.onclick = () => toast('✅ تم إرسال طلب الجلسة، سيتم التأكيد قريباً')));
};

Views.notifications = v => {
  State.readNotifs = true;
  v.innerHTML = `
  <section class="narrow-in">
    <h1 class="page-title start">🔔 ${t('notifications')}</h1>
    <div class="card notif-demo">
      <div><b>📳 التنبيه بالاهتزاز والضوء</b><small class="muted">لأن أطفالنا لا يسمعون رنين الإشعارات، نستخدم وميض الشاشة واهتزاز الهاتف.</small></div>
      <button class="btn btn-primary" id="testFlash">جرّب التنبيه</button>
    </div>
    <div class="notif-list">
      ${DEMO.notifications.map(n => `<div class="notif ${n.flash ? 'important' : ''}"><span>${n.icon}</span><div><p>${n.text}</p><small>${n.time}</small></div></div>`).join('')}
    </div>
  </section>`;
  $('#testFlash').onclick = () => flashAlert(DEMO.notifications[0].text);
  $('.bell')?.classList.remove('unread');
};
