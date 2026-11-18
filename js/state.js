/* =========================================================
   El Tawassol - الحالة المحلية (مؤقتاً في المتصفح، لاحقاً عبر الخادم)
   ========================================================= */
const State = (() => {
  const KEY = 'hlAcademy.v1';
  const defaults = {
    lang: 'ar',
    session: null,          // { role: 'student'|'teacher'|'admin'|'psy', name, avatar }
    stage: 'middle', year: 1,
    teachers: {},           // subjectId -> teacherId
    passed: {},             // lessonKey -> score
    readNotifs: false,
  };
  let s;
  try { s = Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY)) || {}); }
  catch { s = { ...defaults }; }
  const save = () => localStorage.setItem(KEY, JSON.stringify(s));

  return {
    get lang() { return s.lang; },
    set lang(v) { s.lang = v; save(); },
    get session() { return s.session; },
    login(role) {
      const users = {
        student: { name: DEMO.student.name, avatar: DEMO.student.avatar },
        teacher: { name: TEACHERS[0].name, avatar: TEACHERS[0].avatar },
        admin:   { name: 'مدير المنصة', avatar: '🛡️' },
        psy:     { name: 'د. أمينة لعريبي', avatar: '🧠' },
      };
      s.session = { role, ...users[role] }; save();
    },
    logout() { s.session = null; save(); },
    get stage() { return s.stage; }, get year() { return s.year; },
    setYear(stage, year) { s.stage = stage; s.year = year; save(); },
    teacherFor(subject) { return s.teachers[subject]; },
    setTeacher(subject, id) { s.teachers[subject] = id; save(); },
    lessonKey(id) { return `${s.stage}-${s.year}-${id}`; },
    isPassed(id) { return this.lessonKey(id) in s.passed; },
    pass(id, score) { s.passed[this.lessonKey(id)] = score; save(); },
    get readNotifs() { return s.readNotifs; },
    set readNotifs(v) { s.readNotifs = v; save(); },
    resetProgress() { s.passed = {}; save(); },
  };
})();
