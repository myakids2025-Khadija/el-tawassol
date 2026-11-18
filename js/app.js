/* =========================================================
   El Tawassol - التوجيه (Router)
   ========================================================= */
const ROUTES = {
  '':          { view: 'landing' },
  about:       { view: 'about' },
  courses:     { view: 'courses' },
  faq:         { view: 'faq' },
  contact:     { view: 'contact' },
  terms:       { view: 'terms' },
  join:        { view: 'join' },
  register:    { view: 'register' },
  login:       { view: 'login' },
  student:     { view: 'student', role: 'student' },
  stages:      { view: 'stages', role: 'student' },
  subjects:    { view: 'subjects', role: 'student' },
  teachers:    { view: 'teachers', role: 'student' },
  lessons:     { view: 'lessons', role: 'student' },
  lesson:      { view: 'lesson', role: 'student' },
  dictionary:  { view: 'dictionary', role: 'student' },
  report:      { view: 'report', role: 'student' },
  private:     { view: 'private', role: 'student' },
  support:     { view: 'support', role: 'student' },
  notifications: { view: 'notifications', role: 'student' },
  teacher:     { view: 'teacher', role: 'teacher' },
  admin:       { view: 'admin', role: 'admin' },
  psy:         { view: 'psy', role: 'psy' },
};

function render() {
  if (Views._cleanup) { Views._cleanup(); Views._cleanup = null; }
  const [path, query] = (location.hash.replace(/^#\/?/, '') || '').split('?');
  const [name = '', arg] = path.split('/');
  const params = new URLSearchParams(query || '');
  const route = ROUTES[name] || ROUTES[''];
  const session = State.session;

  // حماية الصفحات حسب نوع الحساب
  if (route.role && (!session || session.role !== route.role)) {
    location.hash = session ? (session.role === 'student' ? '#/student' : '#/' + session.role) : '#/login';
    return;
  }

  const lang = I18N[State.lang];
  document.documentElement.lang = State.lang;
  document.documentElement.dir = lang.dir;
  document.title = `${t('brandShort')} | ${t('brand')}`;

  const root = $('#root');
  root.innerHTML = route.role ? appLayout() : publicLayout();
  Views[route.view]($('#view'), params, arg);

  // أحداث مشتركة
  $('#langSelect').onchange = e => { State.lang = e.target.value; Assistant.remount(); render(); };
  $('#menuBtn') && ($('#menuBtn').onclick = () => $('#siteNav').classList.toggle('open'));
  $('#sideBtn') && ($('#sideBtn').onclick = () => $('#sidebar').classList.toggle('open'));
  $('#logoutBtn') && ($('#logoutBtn').onclick = () => { State.logout(); sessionStorage.removeItem('hlFlashShown'); location.hash = '#/'; });
  $$('.site-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#/' + name));
  Assistant.mount();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
