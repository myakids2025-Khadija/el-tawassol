/* =========================================================
   التخزين المحلي: ملفات الأطفال، التقدم، الإعدادات
   (كل البيانات تُحفظ في المتصفح عبر localStorage)
   ========================================================= */
const Store = (() => {
  const KEY = 'hopeAcademy.v1';

  const defaults = () => ({
    profiles: [],
    currentId: null,
    settings: { fontScale: 1, highContrast: false, reduceMotion: false, vibration: true, autoplay: true },
  });

  let state;
  try {
    state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY)) || {});
  } catch (e) {
    state = defaults();
  }

  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  function levelForAge(age) {
    const a = Number(age);
    return (LEVELS.find(l => a >= l.min && a <= l.max) || (a < 3 ? LEVELS[0] : LEVELS[2])).id;
  }

  return {
    get settings() { return state.settings; },
    setSetting(k, v) { state.settings[k] = v; save(); },

    get profiles() { return state.profiles; },
    get current() { return state.profiles.find(p => p.id === state.currentId) || null; },

    addProfile({ name, age, avatar }) {
      const p = {
        id: uid(), name, age: Number(age), avatar,
        level: levelForAge(age), stars: 0, learned: [], history: [], createdAt: Date.now(),
      };
      state.profiles.push(p);
      state.currentId = p.id;
      save();
      return p;
    },
    updateProfile(id, data) {
      const p = state.profiles.find(x => x.id === id);
      if (!p) return;
      Object.assign(p, data);
      if (data.age !== undefined) p.level = levelForAge(data.age);
      save();
    },
    removeProfile(id) {
      state.profiles = state.profiles.filter(p => p.id !== id);
      if (state.currentId === id) state.currentId = state.profiles[0]?.id || null;
      save();
    },
    select(id) { state.currentId = id; save(); },

    /* التقدم */
    isLearned(key) { return !!this.current?.learned.includes(key); },
    markLearned(key) {
      const p = this.current;
      if (!p || p.learned.includes(key)) return false;
      p.learned.push(key);
      p.stars += 1;
      save();
      return true;
    },
    addStars(n) { const p = this.current; if (p) { p.stars += n; save(); } },
    logGame(game, score, total) {
      const p = this.current;
      if (!p) return;
      p.history.unshift({ game, score, total, date: Date.now() });
      p.history = p.history.slice(0, 50);
      save();
    },

    levelForAge,
    exportData() { return JSON.stringify(state, null, 2); },
    importData(json) { state = Object.assign(defaults(), JSON.parse(json)); save(); },
  };
})();
