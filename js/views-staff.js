/* =========================================================
   El Tawassol - لوحات الأستاذ، المدير، الأخصائي النفساني (واجهات فقط)
   ========================================================= */

const statCards = items => `<div class="stat-cards">${items.map(([e, n, l, c]) =>
  `<div class="stat-card" style="--c:${c}"><span>${e}</span><b>${n}</b><small>${l}</small></div>`).join('')}</div>`;

/* ---------- الأستاذ ---------- */
Views.teacher = (v, params, sub) => {
  const pages = {
    undefined: () => `
      <h1 class="page-title start">👋 مرحباً ${esc(State.session.name)}</h1>
      ${statCards([['🧑‍🎓', 214, 'تلميذ', '#3b82f6'], ['🎬', 23, 'درس منشور', '#16a34a'], ['📝', 12, 'تصحيح بانتظارك', '#f59e0b'], ['⭐', 4.9, 'التقييم', '#a855f7']])}
      <div class="dash-grid">
        <div class="card"><h3>🧑‍🎓 تلاميذي</h3>${studentsTable()}</div>
        <div class="card"><h3>⚡ إجراءات سريعة</h3>
          <div class="quick-list">
            <a href="#/teacher/upload">⬆️ رفع درس جديد</a><a href="#/teacher/corrections">✅ تصحيح التمارين (12)</a>
            <a href="#/teacher/requests">🗓️ طلبات الدروس الخصوصية (3)</a>
          </div>
        </div>
      </div>`,
    upload: () => `
      <h1 class="page-title start">⬆️ رفع درس جديد</h1>
      <form class="card form two-cols" id="uploadForm">
        <label>الطور والسنة<select>${STAGES.flatMap(s => Array.from({ length: s.years }, (_, i) => `<option>${yearLabel(s.id, i + 1)}</option>`)).join('')}</select></label>
        <label>المادة<select>${SUBJECTS.map(s => `<option>${s.name}</option>`)}</select></label>
        <label class="full">عنوان الدرس<input required placeholder="مثال: التنفس عند الإنسان" /></label>
        <div class="upload-box"><span>🎬</span><b>فيديو الشرح (HD)</b><small>MP4 — الأستاذ يشرح أو يكتب على السبورة</small><input type="file" accept="video/*" /></div>
        <div class="upload-box"><span>🧏</span><b>فيديو مترجم الإشارة</b><small>يُعرض بجانب الفيديو (يمين أو يسار)</small><input type="file" accept="video/*" /></div>
        <div class="upload-box"><span>💬</span><b>النص المكتوب (الترجمة النصية)</b><small>ملف SRT / VTT أو كتابة يدوية</small><input type="file" accept=".srt,.vtt,.txt" /></div>
        <div class="upload-box"><span>📄</span><b>ملخص الدرس PDF</b><small>للمراجعة والطباعة</small><input type="file" accept=".pdf" /></div>
        <div class="full">
          <h3>📝 التمارين</h3>
          <div class="q-builder"><input placeholder="نص السؤال" /><input placeholder="الخيار 1 (الصحيح)" /><input placeholder="الخيار 2" /><input placeholder="الخيار 3" /></div>
          <button type="button" class="btn btn-ghost" onclick="this.insertAdjacentHTML('beforebegin', this.previousElementSibling.outerHTML)">➕ إضافة سؤال</button>
        </div>
        <label class="full">مصطلحات القاموس الإشاري (مفصولة بفاصلة)<input placeholder="رئة، أكسجين، شهيق" /></label>
        <button class="btn btn-primary btn-lg full">📤 نشر الدرس</button>
      </form>`,
    corrections: () => `
      <h1 class="page-title start">✅ التمارين بانتظار التصحيح</h1>
      <div class="card"><table class="table"><thead><tr><th>التلميذ</th><th>الدرس</th><th>النتيجة الآلية</th><th>التاريخ</th><th></th></tr></thead><tbody>
        ${DEMO.myStudents.map((s, i) => `<tr><td>${s.avatar} ${s.name}</td><td>${LESSONS.middle[i % 4].title}</td><td>${2 + (i % 2)}/3</td><td>اليوم</td>
        <td><button class="btn btn-ghost sm approve">✔ اعتماد</button></td></tr>`).join('')}
      </tbody></table></div>`,
    requests: () => `
      <h1 class="page-title start">🗓️ طلبات الدروس الخصوصية</h1>
      <div class="card-list">
        ${[['أمين بوزيد', 'التنفس عند الإنسان', 'الأحد 16:00'], ['ملاك سعدي', 'الخلية', 'الإثنين 17:00'], ['وليد بركاني', 'الهضم', 'الثلاثاء 15:00']].map(([n, l, d]) => `
          <div class="card req-card"><div><b>${n}</b><small>📚 ${l} • 📅 ${d} • 60 د</small></div>
          <div class="gap"><button class="btn btn-primary sm approve">قبول</button><button class="btn btn-ghost sm approve">اقتراح موعد آخر</button></div></div>`).join('')}
      </div>`,
  };
  v.innerHTML = `<section>${(pages[sub] || pages.undefined)()}</section>`;
  $('#uploadForm') && ($('#uploadForm').onsubmit = e => { e.preventDefault(); toast('✅ تم نشر الدرس (تجريبي)'); });
  $$('.approve').forEach(b => (b.onclick = () => { b.closest('tr, .req-card').classList.add('done-row'); b.textContent = '✔ تم'; b.disabled = true; }));
};

function studentsTable() {
  return `<table class="table"><thead><tr><th>التلميذ</th><th>المستوى</th><th>التقدم</th><th>آخر نشاط</th></tr></thead><tbody>
    ${DEMO.myStudents.map(s => `<tr><td>${s.avatar} ${s.name}<br><small class="muted">${s.hearing}</small></td><td>${s.level}</td>
    <td><div class="progress-line sm"><i style="width:${s.progress}%"></i></div><small>${s.progress}%</small></td><td>${s.last}</td></tr>`).join('')}
  </tbody></table>`;
}

/* ---------- المدير (صاحب المنصة) ---------- */
Views.admin = (v, params, sub) => {
  const pages = {
    undefined: () => `
      <h1 class="page-title start">🛡️ لوحة صاحب المنصة</h1>
      ${statCards([['🧑‍🎓', '1,248', 'تلميذ', '#3b82f6'], ['🧑‍🏫', 45, 'أستاذ', '#16a34a'], ['🧠', 6, 'أخصائي', '#10b981'], ['💰', '2.4M دج', 'مداخيل الشهر', '#f59e0b'], ['⏳', DEMO.pendingActivations.length, 'حساب بانتظار التفعيل', '#ef4444']])}
      <div class="dash-grid">
        <div class="card"><h3>📈 التسجيلات (آخر 6 أشهر)</h3>
          <div class="bars">${[['جوان', 60], ['جويلية', 45], ['أوت', 70], ['سبتمبر', 140], ['أكتوبر', 180], ['نوفمبر', 120]].map(([m, n]) => `<div class="bar-col"><i style="height:${n / 2}%"><span>${n}</span></i><small>${m}</small></div>`).join('')}</div>
        </div>
        <div class="card"><h3>🎓 التلاميذ حسب الطور</h3>
          ${[['الابتدائي', 42, '#22c55e'], ['المتوسط', 35, '#3b82f6'], ['الثانوي', 23, '#a855f7']].map(([n, p, c]) => `
            <div class="prog-row"><span>${n}</span><div class="progress-line"><i style="width:${p}%;background:${c}"></i></div><b>${p}%</b></div>`).join('')}
        </div>
      </div>
      <div class="card"><h3>⏳ آخر طلبات التفعيل</h3>${activationsTable()}</div>`,
    users: () => `
      <h1 class="page-title start">👥 إدارة المستخدمين</h1>
      <div class="tabs"><button class="active">الكل</button><button>التلاميذ</button><button>الأساتذة</button><button>الأخصائيون</button></div>
      <div class="card"><table class="table"><thead><tr><th>الاسم</th><th>الدور</th><th>اسم المستخدم</th><th>الحالة</th><th></th></tr></thead><tbody>
        ${[...DEMO.myStudents.map(s => [s.avatar + ' ' + s.name, 'تلميذ']), ...TEACHERS.map(x => [x.avatar + ' ' + x.name, 'أستاذ']), ['🧠 د. أمينة لعريبي', 'أخصائية نفسانية']]
          .map(([n, r], i) => `<tr><td>${n}</td><td>${r}</td><td dir="ltr">user${100 + i}</td><td><span class="tag tag-green">نشط</span></td><td><button class="icon-btn">✏️</button><button class="icon-btn">🔑</button></td></tr>`).join('')}
      </tbody></table></div>`,
    activations: () => `<h1 class="page-title start">⏳ تفعيل الحسابات</h1><div class="card">${activationsTable()}</div>`,
    teachers: () => `
      <h1 class="page-title start">🧑‍🏫 طلبات الانضمام للفريق التعليمي</h1>
      <div class="card-list">${DEMO.teacherApplications.map(a => `
        <div class="card req-card"><div><b>${a.name}</b><small>📚 ${a.subject} • ${a.exp} سنوات خبرة • 🤟 ${a.sign}</small></div>
        <div class="gap"><button class="btn btn-ghost sm">📄 السيرة الذاتية</button><button class="btn btn-primary sm approve">قبول</button></div></div>`).join('')}</div>`,
  };
  v.innerHTML = `<section>${(pages[sub] || pages.undefined)()}</section>`;
  $$('.approve').forEach(b => (b.onclick = () => { b.closest('tr, .req-card').classList.add('done-row'); b.textContent = '✔ مفعّل'; b.disabled = true; toast('✅ تم التفعيل وإرسال اسم المستخدم وكلمة المرور'); }));
};

function activationsTable() {
  return `<table class="table"><thead><tr><th>التلميذ</th><th>المستوى</th><th>الخطة</th><th>طريقة الدفع</th><th>التاريخ</th><th></th></tr></thead><tbody>
    ${DEMO.pendingActivations.map(a => `<tr><td>${a.name}</td><td>${a.stage}</td><td>${a.plan}</td><td>${a.method}</td><td>${a.date}</td>
    <td><button class="btn btn-primary sm approve">⚡ تفعيل</button></td></tr>`).join('')}
  </tbody></table>`;
}

/* ---------- الأخصائي النفساني ---------- */
Views.psy = (v, params, sub) => {
  const sessions = `<div class="card-list">${DEMO.psySessions.map(s => `
    <div class="card req-card"><div><b>${s.avatar} ${s.child}</b><small>${s.type} • 📅 ${s.date}</small></div>
    <div class="gap"><span class="tag ${s.status === 'مؤكدة' ? 'tag-green' : 'tag-orange'}">${s.status}</span><button class="btn btn-primary sm">🎥 بدء الجلسة</button></div></div>`).join('')}</div>`;
  const pages = {
    undefined: () => `
      <h1 class="page-title start">🧠 مرحباً ${esc(State.session.name)}</h1>
      ${statCards([['🧒', 38, 'طفل متابَع', '#10b981'], ['📅', 3, 'جلسات هذا الأسبوع', '#3b82f6'], ['🩺', 5, 'تشخيصات مجانية جديدة', '#f59e0b'], ['😟', 2, 'تنبيهات مزاج', '#ef4444']])}
      <div class="dash-grid"><div><h3>📅 الجلسات القادمة</h3>${sessions}</div>
      <div class="card"><h3>😟 تنبيهات "كيف تشعر اليوم؟"</h3>
        <div class="notif"><span>😢</span><div><p>وليد بركاني اختار "حزين" ثلاث مرات هذا الأسبوع</p><small>منذ ساعة</small></div></div>
        <div class="notif"><span>😟</span><div><p>ريم بوعلام اختارت "قلق" قبل الاختبار</p><small>أمس</small></div></div>
      </div></div>`,
    sessions: () => `<h1 class="page-title start">📅 الجلسات</h1>${sessions}`,
    children: () => `
      <h1 class="page-title start">🧒 الأطفال المتابَعون</h1>
      <div class="card"><table class="table"><thead><tr><th>الطفل</th><th>المستوى</th><th>الحالة السمعية</th><th>آخر جلسة</th><th>ملاحظات</th></tr></thead><tbody>
        ${DEMO.myStudents.map(s => `<tr><td>${s.avatar} ${s.name}</td><td>${s.level}</td><td>${s.hearing}</td><td>${s.last}</td><td><button class="btn btn-ghost sm">📝 الملف</button></td></tr>`).join('')}
      </tbody></table></div>`,
  };
  v.innerHTML = `<section>${(pages[sub] || pages.undefined)()}</section>`;
};
