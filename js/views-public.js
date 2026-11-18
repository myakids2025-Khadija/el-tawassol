/* =========================================================
   El Tawassol - صفحات الزوار: الرئيسية، من نحن، الدورات، الأسئلة،
   تواصل معنا، الشروط، كن معلماً، التسجيل (5 خطوات)، الدخول
   ========================================================= */
const Views = {};

Views.landing = v => {
  const P = 'assets/photos/';
  const slides = [
    { img: 'hero-1.jpg', n: 1 },
    { img: 'hero-2.jpg', n: 2 },
    { img: 'hero-3.jpg', n: 3 },
  ];
  const kicker = (k, title) => `<div class="kicker"><span>${t(k)}</span></div><h2 class="section-title">${t(title)}</h2>`;

  v.innerHTML = `
  <!-- شرائح الواجهة بالصور -->
  <section class="hero-slider" id="heroSlider">
    ${slides.map((s, i) => `
      <div class="slide ${i === 0 ? 'active' : ''} ${s.alt ? 'alt' : ''}">
        <div class="slide-bg" style="background-image:url('${P + s.img}')"></div>
        <div class="slide-content">
          <span class="slide-eyebrow">${t('s' + s.n + '_eyebrow')}</span>
          <h1>${t('s' + s.n + '_title')}</h1>
          <p>${t('s' + s.n + '_sub')}</p>
          <div class="hero-actions">
            <a class="btn btn-teal btn-lg" href="#/login">${t('login')}</a>
            <a class="btn btn-white btn-lg" href="#/register">${t('register')}</a>
          </div>
        </div>
      </div>`).join('')}
    <div class="slider-arrows">
      <button class="s-arrow" data-d="-1" aria-label="previous">‹</button>
      <button class="s-arrow" data-d="1" aria-label="next">›</button>
    </div>
    <div class="photo-credit">📷 <a href="https://www.pexels.com" target="_blank" rel="noopener">Pexels</a></div>
    <div class="slider-dots">${slides.map((_, i) => `<button class="${i === 0 ? 'active' : ''}" data-i="${i}" aria-label="slide ${i + 1}"></button>`).join('')}</div>
  </section>

  <div class="hero-stats floating">
    <div><b>+1200</b><small>${t('stat_students')}</small></div>
    <div><b>45</b><small>${t('stat_teachers')}</small></div>
    <div><b>+600</b><small>${t('stat_lessons')}</small></div>
    <div><b>98%</b><small>${t('stat_satisfaction')}</small></div>
  </div>

  <!-- خدماتنا -->
  <section class="section">
    ${kicker('services_kicker', 'services_title')}
    <div class="service-grid">
      ${[['🎬', 'lf1'], ['🧏', 'lf2'], ['📄', 'lf3'], ['📝', 'lf4']].map(([e, k]) => `
        <div class="service"><span class="s-icon">${e}</span><b>${t(k)}</b><small>${t(k + '_d')}</small></div>`).join('')}
    </div>
  </section>

  <!-- من نحن -->
  <section class="section about-split">
    <div class="about-img reveal"><img src="${P}about-hands.jpg" alt="" loading="lazy" /></div>
    <div class="about-text">
      <div class="kicker start"><span>${t('about_kicker')}</span></div>
      <h2>${t('about_title')}</h2>
      <p>${t('about_p1')}</p>
      <p>${t('about_p2')}</p>
      <ul class="check-list">
        ${['about_l1', 'about_l2', 'about_l3', 'about_l4'].map(k => `<li>${t(k)}</li>`).join('')}
      </ul>
      <a class="btn btn-primary" href="#/about">${t('learn_more')}</a>
    </div>
  </section>

  <!-- فئات الدروس: شبكة صور -->
  <section class="section alt">
    ${kicker('cats_kicker', 'cats_title')}
    <div class="mosaic">
      <a class="tile t-tall" href="#/register"><img src="${P}cat-exams.jpg" alt="" loading="lazy" /><span class="tile-label">📝 ${t('cat_exams')}</span></a>
      <a class="tile t-wide" href="#/register"><img src="${P}cat-video.jpg" alt="" loading="lazy" /><span class="tile-label">🎬 ${t('cat_video')}</span></a>
      <a class="tile" href="kids/index.html"><img src="${P}cat-games.jpg" alt="" loading="lazy" /><span class="tile-label">🎮 ${t('cat_games')}</span></a>
      <a class="tile" href="#/register"><img src="${P}cat-pdf.jpg" alt="" loading="lazy" /><span class="tile-label">📄 ${t('cat_pdf')}</span></a>
    </div>
  </section>

  <!-- كيف تعمل المنصة -->
  <section class="section">
    <h2 class="section-title">${t('how_title')}</h2>
    <div class="steps">
      ${[1, 2, 3, 4, 5].map(i => `
        <div class="step"><span class="step-num">${i}</span><span class="step-icon">${['📝', '🩺', '💳', '⚡', '🎓'][i - 1]}</span>
        <b>${t('step' + i)}</b><small>${t('step' + i + '_d')}</small></div>`).join('')}
    </div>
  </section>

  <section class="section alt">
    <h2 class="section-title">${t('stages_title')}</h2>
    <div class="stage-cards">
      ${STAGES.map(s => `
        <div class="stage-card" style="--c:${s.color}">
          <span class="stage-emoji">${s.emoji}</span>
          <h3>${t(s.key)}</h3>
          <div class="year-chips">${Array.from({ length: s.years }, (_, i) => `<span>${yearLabel(s.id, i + 1)}</span>`).join('')}</div>
        </div>`).join('')}
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">${t('features_title')}</h2>
    <div class="feature-grid">
      ${['👨‍🏫', '🗓️', '💚', '📖', '📊', '🤖', '📳', '🌐'].map((e, i) => `
        <div class="feature"><span class="f-icon">${e}</span><b>${t('f' + (i + 1))}</b><small>${t('f' + (i + 1) + '_d')}</small></div>`).join('')}
    </div>
  </section>

  <!-- المرافقة النفسية والأرطفونية: صورة + نص -->
  <section class="section">
    <div class="photo-banner">
      <div class="pb-img" style="background-image:url('${P}support.jpg')"></div>
      <div class="pb-content">
        <div class="kicker start light"><span>${t('support_kicker')}</span></div>
        <h2>💚 ${t('f3')}</h2>
        <p>${t('f3_d')}</p>
        <a class="btn btn-white" href="#/register">${t('learn_more')}</a>
      </div>
    </div>
  </section>

  <section class="section alt">
    <h2 class="section-title">${t('teachers_title')}</h2>
    <div class="teacher-row">
      ${TEACHERS.map(tc => `
        <div class="teacher-mini"><span>${tc.avatar}</span><b>${tc.name}</b>
        <small>${SUBJECTS.find(s => s.id === tc.subject).name}</small><small>⭐ ${tc.rating} • 🤟 ${tc.sign}</small></div>`).join('')}
    </div>
  </section>

  <!-- كن معلماً: صورة -->
  <section class="section">
    <div class="photo-banner gold reverse">
      <div class="pb-img" style="background-image:url('${P}teacher-join.jpg')"></div>
      <div class="pb-content">
        <h2>🧑‍🏫 ${t('join_cta')}</h2>
        <p>${t('nav_join')}؟</p>
        <a class="btn btn-white" href="#/join">${t('nav_join')}</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="banner channel">
      <div><h2>🤟 ${t('channel_title')}</h2><p>${t('channel_d')}</p></div>
      <a class="btn btn-light btn-lg" href="kids/index.html">${t('channel_cta')}</a>
    </div>
  </section>

  <section class="section">
    <div class="banner qr-banner">
      ${qrImg(150)}
      <div><h2>📱 ${t('qr_title')}</h2><p dir="ltr">${BASE_URL}</p></div>
    </div>
  </section>`;

  /* --- تشغيل الشرائح --- */
  const slidesEl = $$('.slide', v), dots = $$('.slider-dots button', v);
  let cur = 0;
  const go = i => {
    cur = (i + slidesEl.length) % slidesEl.length;
    slidesEl.forEach((s, k) => s.classList.toggle('active', k === cur));
    dots.forEach((d, k) => d.classList.toggle('active', k === cur));
  };
  let auto = setInterval(() => go(cur + 1), 6000);
  const restart = () => { clearInterval(auto); auto = setInterval(() => go(cur + 1), 6000); };
  $$('.s-arrow', v).forEach(b => (b.onclick = () => { go(cur + Number(b.dataset.d) * (State.lang === 'ar' ? -1 : 1)); restart(); }));
  dots.forEach(d => (d.onclick = () => { go(Number(d.dataset.i)); restart(); }));

  /* --- ظهور الأقسام عند التمرير --- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: .15 }) : null;
  $$('.section', v).forEach(s => { s.classList.add('reveal'); io ? io.observe(s) : s.classList.add('in'); });

  Views._cleanup = () => { clearInterval(auto); io && io.disconnect(); };
};

Views.about = v => {
  v.innerHTML = `
  <section class="page">
    <h1 class="page-title">${t('nav_about')}</h1>
    <div class="card prose">
      <p><b>أكاديمية التواصل (El Tawassol Academy)</b> منصة علمية تعليمية لفائدة تلاميذ ذوي الإعاقة السمعية، شعارها: <b>«تمكين معرفي متكامل للصم وضعاف السمع»</b>.</p>
      <div class="name-meaning">
        <div><h3>🤝 التواصل — El Tawassol</h3><p>اسم بسيط وعميق يعبّر عن كسر حاجز الصمت وبناء لغة مشتركة بين الجميع: بين التلميذ وأستاذه، وبين الطفل وأسرته، وبينه وبين مجتمعه.</p></div>
        <div><h3>🌉 جسر نحو المعرفة</h3><p>يرمز إلى كون المنصة جسراً يعبر به التلاميذ نحو المعرفة والاندماج، ويؤكد أن عائق السمع أو النطق لا يمنع من الطموح والتعلّم.</p></div>
      </div>
      <h3>🎯 رسالتنا</h3>
      <p>كسر حاجز الصمت وبناء لغة مشتركة بين الجميع، من خلال دروس المنهاج الرسمي مترجمة بلغة الإشارة، وأساتذة متخصصين، ومرافقة نفسية وأرطفونية تساعد أطفالنا على الاندماج في المجتمع.</p>
      <h3>🎨 شرح الشعار</h3>
      <div class="logo-story">
        <img src="assets/tawassol-full.png" alt="شعار أكاديمية التواصل" />
        <div>
          <ul class="logo-elements">
            <li><b>▶️ زر التشغيل:</b> الدروس المصوّرة والتعلّم عبر الفيديو.</li>
            <li><b>T حرف التاء:</b> الحرف الأول من «التواصل» (Tawassol).</li>
            <li><b>🤟 اليد:</b> لغة الإشارة، لغة تلاميذنا الأولى.</li>
            <li><b>👂 الأذن الذهبية:</b> الإعاقة السمعية، والإصغاء والاهتمام بكل تلميذ.</li>
            <li><b>🖱️ المؤشر والمربعات:</b> التعلّم الرقمي عن بُعد.</li>
            <li><b>⭕ المدار الذهبي:</b> المرافقة المستمرة التي تحيط بالطفل.</li>
          </ul>
          <div class="brand-colors">
            <div><span style="background:#133963"></span><b>الأزرق الداكن</b><small>الثقة والاستقرار والطابع الأكاديمي</small></div>
            <div><span style="background:#0fa7a3"></span><b>الفيروزي</b><small>التواصل والتجدد والشمول</small></div>
            <div><span style="background:#d3a344"></span><b>الذهبي</b><small>الدفء والتفاؤل، الأمل والإنجاز</small></div>
          </div>
        </div>
      </div>
      <h3>👥 فريقنا</h3>
      <div class="team-grid">
        <div>🧑‍🏫<b>أساتذة</b><small>يتقنون لغة الإشارة</small></div>
        <div>🧏<b>مترجمو إشارة</b><small>معتمدون</small></div>
        <div>🧠<b>أخصائيون نفسانيون</b><small>مرافقة ودعم</small></div>
        <div>🗣️<b>أرطفونيون</b><small>تقويم النطق والسمع</small></div>
      </div>
    </div>
  </section>`;
};

Views.courses = v => {
  v.innerHTML = `
  <section class="page">
    <h1 class="page-title">${t('nav_courses')}</h1>
    <div class="tabs" id="courseTabs">
      <button class="active" data-f="all">الكل</button><button data-f="free">${t('free')}</button><button data-f="paid">${t('paid')}</button>
    </div>
    <div class="course-grid">
      ${COURSES.map(c => `
        <div class="course-card" data-type="${c.free ? 'free' : 'paid'}">
          <span class="course-emoji">${c.emoji}</span>
          <span class="tag ${c.free ? 'tag-green' : 'tag-purple'}">${c.free ? t('free') : fmtDA(c.price)}</span>
          <h3>${c.title}</h3>
          <small>⏱️ ${c.hours} ساعة • 👥 ${c.audience}</small>
          <a class="btn ${c.free ? 'btn-outline' : 'btn-primary'}" href="#/register">${c.free ? 'ابدأ مجاناً' : 'اشترك'}</a>
        </div>`).join('')}
    </div>
    <h2 class="section-title">خطط الاشتراك</h2>
    <div class="plans">${plansHTML()}</div>
  </section>`;
  $$('#courseTabs button').forEach(b => (b.onclick = () => {
    $$('#courseTabs button').forEach(x => x.classList.toggle('active', x === b));
    $$('.course-card').forEach(c => (c.hidden = b.dataset.f !== 'all' && c.dataset.type !== b.dataset.f));
  }));
};

function plansHTML(selectable) {
  return PLANS.map(p => `
    <label class="plan ${p.popular ? 'popular' : ''}">
      ${selectable ? `<input type="radio" name="plan" value="${p.id}" ${p.popular ? 'checked' : ''}/>` : ''}
      ${p.popular ? '<span class="plan-badge">الأكثر طلباً</span>' : ''}
      <h3>${p.name}</h3>
      <div class="plan-price">${p.price ? fmtDA(p.price) : t('free')}<small>${p.period}</small></div>
      <ul>${p.perks.map(x => `<li>✔ ${x}</li>`).join('')}</ul>
    </label>`).join('');
}

Views.faq = v => {
  v.innerHTML = `
  <section class="page narrow">
    <h1 class="page-title">${t('nav_faq')}</h1>
    ${FAQ.map(f => `<details class="faq"><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}
  </section>`;
};

Views.contact = v => {
  v.innerHTML = `
  <section class="page">
    <h1 class="page-title">${t('nav_contact')}</h1>
    <div class="two-col">
      <form class="card form" id="contactForm">
        <label>الاسم<input required /></label>
        <label>البريد الإلكتروني أو الهاتف<input required /></label>
        <label>الموضوع<select><option>استفسار عام</option><option>التسجيل والدفع</option><option>مشكلة تقنية</option><option>شراكة / مؤسسة</option></select></label>
        <label>الرسالة<textarea rows="5" required></textarea></label>
        <button class="btn btn-primary btn-lg">${t('submit')}</button>
      </form>
      <div class="card contact-info">
        <div>📧 <b>contact@el-tawassol.dz</b></div>
        <div>📱 <b dir="ltr">+213 5XX XX XX XX</b> <small>(واتساب — رسائل مكتوبة ومكالمات فيديو بلغة الإشارة)</small></div>
        <div>📍 <b>الجزائر</b></div>
        <div>🕘 <b>من الأحد إلى الخميس، 9:00 - 17:00</b></div>
        <div class="footer-qr">${qrImg(120)}<small>${t('qr_title')}</small></div>
      </div>
    </div>
  </section>`;
  $('#contactForm').onsubmit = e => { e.preventDefault(); e.target.reset(); toast('✅ تم إرسال رسالتك، سنرد عليك قريباً'); };
};

Views.terms = v => {
  v.innerHTML = `
  <section class="page narrow">
    <h1 class="page-title">${t('terms')}</h1>
    <div class="card prose">
      <h3>1. الحساب</h3><p>الحساب شخصي ولا يجوز مشاركة اسم المستخدم وكلمة المرور.</p>
      <h3>2. الخصوصية وحقوق المحتوى</h3><p>يُمنع تحميل الفيديوهات أو تسجيل الشاشة أو أخذ لقطات منها، حفاظاً على خصوصية المنصة وحقوق الأساتذة.</p>
      <h3>3. الدفع والتفعيل</h3><p>يتم تفعيل الحساب خلال 24 إلى 48 ساعة من تأكيد الدفع.</p>
      <h3>4. التقدم في الدروس</h3><p>لا يمكن الانتقال إلى الدرس الموالي إلا بعد اجتياز تمارين الدرس السابق وتصحيحها.</p>
      <h3>5. البيانات الشخصية</h3><p>نلتزم بحماية بيانات التلاميذ وأوليائهم وعدم مشاركتها مع أي طرف ثالث.</p>
      <p class="muted">— نص مبدئي، يُستكمل لاحقاً بالصيغة القانونية النهائية.</p>
    </div>
  </section>`;
};

Views.join = v => {
  v.innerHTML = `
  <section class="page">
    <div class="banner join-banner photo-bg" style="background-image:url('assets/photos/teacher-join.jpg')"><div><h1>🧑‍🏫 كن معلماً؟ كن ضمن فريقنا التعليمي!</h1>
    <p>نبحث عن أساتذة شغوفين لمرافقة التلاميذ الصم وضعاف السمع. إتقان لغة الإشارة ميزة، ونوفر تكويناً مجانياً لمن يرغب في تعلمها.</p></div></div>
    <form class="card form two-cols" id="joinForm">
      <label>الاسم الكامل<input required /></label>
      <label>البريد الإلكتروني<input type="email" required /></label>
      <label>الهاتف<input required /></label>
      <label>المادة<select>${SUBJECTS.map(s => `<option>${s.name}</option>`)}</select></label>
      <label>الطور<select>${STAGES.map(s => `<option>${t(s.key)}</option>`)}</select></label>
      <label>سنوات الخبرة<input type="number" min="0" value="3" /></label>
      <label>مستوى لغة الإشارة<select><option>متقن</option><option>متوسط</option><option>مبتدئ</option><option>لا أتقنها (أرغب في التكوين)</option></select></label>
      <label>السيرة الذاتية (PDF)<input type="file" accept=".pdf" /></label>
      <label class="full">لماذا تريد الانضمام إلينا؟<textarea rows="4"></textarea></label>
      <button class="btn btn-primary btn-lg full">إرسال الطلب</button>
    </form>
  </section>`;
  $('#joinForm').onsubmit = e => { e.preventDefault(); e.target.reset(); toast('✅ تم استلام طلبك! سيتواصل معك فريقنا قريباً'); };
};

/* ---------- التسجيل: 5 خطوات ---------- */
Views.register = (v, params) => {
  let step = Number(params.get('step')) || 1;
  const data = {};
  const titles = ['step1', 'step2', 'step3', 'step4', 'step5'].map(t);

  const days = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return d;
  });

  const bodies = {
    1: () => `
      <h2>📝 استمارة المعلومات</h2>
      <div class="radio-cards">
        <label><input type="radio" name="filler" value="student" checked /><span>🧑‍🎓 أنا التلميذ</span></label>
        <label><input type="radio" name="filler" value="parent" /><span>👨‍👩‍👧 أنا وليّ التلميذ</span></label>
      </div>
      <div class="form two-cols">
        <label>اسم التلميذ ولقبه<input name="name" required /></label>
        <label>تاريخ الميلاد<input type="date" name="birth" /></label>
        <label>الطور<select name="stage">${STAGES.map(s => `<option value="${s.id}">${t(s.key)}</option>`)}</select></label>
        <label>السنة<select name="year">${[1, 2, 3, 4, 5].map(y => `<option>${y}</option>`)}</select></label>
        <label>الحالة السمعية<select name="hearing"><option>أصم</option><option>ضعيف السمع</option><option>أبكم</option><option>أصم وأبكم</option></select></label>
        <label>هل يتقن لغة الإشارة؟<select><option>نعم</option><option>قليلاً</option><option>لا</option></select></label>
        <label>اسم الولي<input name="parent" /></label>
        <label>رقم الهاتف<input name="phone" required /></label>
        <label>البريد الإلكتروني<input type="email" name="email" /></label>
        <label>الولاية<input name="wilaya" placeholder="مثال: الجزائر العاصمة" /></label>
      </div>`,
    2: () => `
      <h2>🩺 حجز تشخيص مجاني</h2>
      <p class="muted">استشارة كاملة مع مختص تساعد على تحديد احتياجات التلميذ واتخاذ القرار المناسب.</p>
      <div class="radio-cards">
        <label><input type="radio" name="mode" checked /><span>💻 عن بُعد (مكالمة فيديو بلغة الإشارة)</span></label>
        <label><input type="radio" name="mode" /><span>🏢 حضورياً</span></label>
      </div>
      <h3>اختر اليوم</h3>
      <div class="day-picker">${days.map((d, i) => `<label><input type="radio" name="day" ${i === 0 ? 'checked' : ''}/><span><small>${d.toLocaleDateString('ar-DZ', { weekday: 'long' })}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('ar-DZ', { month: 'short' })}</small></span></label>`).join('')}</div>
      <h3>اختر الوقت</h3>
      <div class="time-picker">${['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((h, i) => `<label><input type="radio" name="time" ${i === 1 ? 'checked' : ''} ${i === 3 ? 'disabled' : ''}/><span>${h}</span></label>`).join('')}</div>`,
    3: () => `
      <h2>💳 إتمام عملية الدفع</h2>
      <div class="plans selectable">${plansHTML(true)}</div>
      <h3>طريقة الدفع</h3>
      <div class="radio-cards" id="payMethods">
        <label><input type="radio" name="pay" value="card" checked /><span>💳 بطاقة CIB / الذهبية</span></label>
        <label><input type="radio" name="pay" value="transfer" /><span>🏦 حوالة بريدية / بنكية</span></label>
      </div>
      <div id="payCard" class="form two-cols card-form">
        <label class="full">رقم البطاقة<input placeholder="0000 0000 0000 0000" dir="ltr" /></label>
        <label>تاريخ الانتهاء<input placeholder="MM/YY" dir="ltr" /></label>
        <label>CVV<input placeholder="***" dir="ltr" /></label>
      </div>
      <div id="payTransfer" class="transfer-box" hidden>
        <p>أرسل المبلغ إلى الحساب التالي ثم ارفع صورة الوصل:</p>
        <div><b>CCP:</b> <span dir="ltr">0000000000 clé 00</span></div>
        <div><b>RIP:</b> <span dir="ltr">007 99999 0000000000 00</span></div>
        <label>صورة وصل الدفع<input type="file" accept="image/*,.pdf" /></label>
      </div>
      <p class="muted small">🔒 دفع تجريبي — لن يتم خصم أي مبلغ.</p>`,
    4: () => `
      <div class="center">
        <div class="big-icon spin-slow">⏳</div>
        <h2>طلبك قيد المعالجة</h2>
        <p>سيتم <b>تفعيل حسابك تلقائياً خلال 24 إلى 48 ساعة</b>، وستصلك رسالة بالبريد الإلكتروني ورسالة نصية.</p>
        <ol class="timeline">
          <li class="done">📝 تم استلام الاستمارة</li>
          <li class="done">🩺 تم حجز التشخيص المجاني</li>
          <li class="done">💳 تم استلام الدفع</li>
          <li class="now">⚡ تفعيل الحساب (24 - 48 ساعة)</li>
          <li>🎓 بدء الدراسة</li>
        </ol>
      </div>`,
    5: () => `
      <div class="center">
        <div class="big-icon">🎉</div>
        <h2>تم تفعيل حسابك!</h2>
        <p>استخدم المعلومات التالية للدخول:</p>
        <div class="credentials">
          <div><span>User name</span><b dir="ltr">amine.bouzid</b></div>
          <div><span>Password</span><b dir="ltr">••••••••</b></div>
        </div>
        <a class="btn btn-primary btn-lg" href="#/login">🔑 ${t('login')}</a>
      </div>`,
  };

  const draw = () => {
    v.innerHTML = `
    <section class="page narrow">
      <h1 class="page-title">${t('register')}</h1>
      <ol class="stepper">${titles.map((x, i) => `<li class="${i + 1 < step ? 'done' : i + 1 === step ? 'now' : ''}"><span>${i + 1 < step ? '✔' : i + 1}</span><small>${x}</small></li>`).join('')}</ol>
      <form class="card wizard" id="wizard">${bodies[step]()}
        <div class="wizard-nav">
          ${step > 1 && step < 5 ? `<button type="button" class="btn btn-ghost" id="prevStep">${t('prev')}</button>` : '<span></span>'}
          ${step < 5 ? `<button class="btn btn-primary btn-lg">${step === 3 ? 'ادفع وأكمل' : step === 4 ? 'محاكاة التفعيل ⚡' : t('next')}</button>` : ''}
        </div>
      </form>
    </section>`;
    $('#wizard').onsubmit = e => { e.preventDefault(); Object.assign(data, Object.fromEntries(new FormData(e.target))); step++; draw(); window.scrollTo(0, 0); };
    $('#prevStep') && ($('#prevStep').onclick = () => { step--; draw(); });
    if (step === 3) {
      $$('[name=pay]').forEach(r => (r.onchange = () => {
        const m = $('[name=pay]:checked').value;
        $('#payCard').hidden = m !== 'card';
        $('#payTransfer').hidden = m !== 'transfer';
      }));
    }
  };
  draw();
};

/* حسابات تجريبية (مؤقتة إلى حين ربط الخادم وقاعدة البيانات) */
const DEMO_ACCOUNTS = {
  eleve: { pass: '1234', role: 'student' },
  prof:  { pass: '1234', role: 'teacher' },
  psy:   { pass: '1234', role: 'psy' },
  admin: { pass: '1234', role: 'admin' },
};

Views.login = v => {
  v.innerHTML = `
  <section class="page auth">
    <div class="auth-wrap">
    <div class="auth-photo" style="background-image:url('assets/photos/hero-1.jpg')"><div><h2>${t('s2_title')}</h2><p>${t('s2_sub')}</p></div></div>
    <form class="card auth-card" id="loginForm" autocomplete="off">
      <div class="center">${logoHTML()}</div>
      <h1>${t('login')}</h1>
      <label>User name<input name="user" dir="ltr" placeholder="User name" required autocapitalize="none" /></label>
      <label>Password
        <span class="pass-wrap"><input name="pass" type="password" dir="ltr" placeholder="••••" required /><button type="button" class="pass-eye" id="passEye" aria-label="show">👁️</button></span>
      </label>
      <div class="alert bad" id="loginErr" hidden>❌ اسم المستخدم أو كلمة المرور غير صحيحة</div>
      <button class="btn btn-primary btn-lg">🔑 ${t('login')}</button>
      <p class="center">ليس لديك حساب؟ <a href="#/register">${t('register')}</a></p>
    </form>
    </div>
  </section>`;
  $('#passEye').onclick = () => { const i = $('[name=pass]'); i.type = i.type === 'password' ? 'text' : 'password'; };
  $('#loginForm').onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const acc = DEMO_ACCOUNTS[String(fd.get('user')).trim().toLowerCase()];
    if (!acc || acc.pass !== fd.get('pass')) {
      $('#loginErr').hidden = false;
      e.target.classList.remove('shake'); void e.target.offsetWidth; e.target.classList.add('shake');
      if (navigator.vibrate) navigator.vibrate(200);
      return;
    }
    State.login(acc.role);
    location.hash = acc.role === 'student' ? '#/student' : '#/' + acc.role;
  };
};
