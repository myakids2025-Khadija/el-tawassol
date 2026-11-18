/* =========================================================
   أكاديمية الأمل - الألعاب والاختبارات
   كل الألعاب بصرية بالكامل (لا تعتمد على الصوت)،
   وتتكيف صعوبتها مع مستوى الطفل (1: 3-6، 2: 7-11، 3: 12-17).
   ========================================================= */
const Games = (() => {
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const stop = () => { timers.forEach(clearTimeout); timers = []; };

  const allVocab = () => Object.entries(VOCAB).flatMap(([cat, c]) => c.items.filter(i => i.emoji).map(i => ({ ...i, cat })));
  const level = () => Store.current.level;

  /* ---------- محرك الاختبار متعدد الخيارات ---------- */
  function quiz(game, root, makeQuestion, rounds = 8) {
    let i = 0, score = 0;

    const next = () => {
      if (i >= rounds) return finish(game, root, score, rounds);
      const q = makeQuestion(i);
      root.innerHTML = '';
      root.appendChild(h(`
        ${header(game, i, rounds, score)}
        <section class="quiz">
          <div class="quiz-prompt">${q.prompt}</div>
          <div class="quiz-question">${q.question}</div>
          <div class="quiz-options cols-${q.options.length}">
            ${q.options.map((o, k) => `<button class="option ${q.optionClass || ''}" data-k="${k}">${o.html}</button>`).join('')}
          </div>
        </section>`));
      if (q.media) Media.render($('#qSign', root), q.media.path, q.media.fallback);

      let answered = false;
      root.querySelectorAll('.option').forEach(btn => {
        btn.onclick = () => {
          if (answered) return;
          const o = q.options[btn.dataset.k];
          if (o.correct) {
            answered = true;
            btn.classList.add('correct');
            score++;
            Store.addStars(1);
            refreshHeader();
            showFeedback(true);
            later(() => { i++; next(); }, 1000);
          } else {
            btn.classList.add('wrong');
            btn.disabled = true;
            showFeedback(false);
            // بعد خطأين نُظهر الإجابة الصحيحة لدعم التعلم
            if (root.querySelectorAll('.option.wrong').length >= 2) {
              answered = true;
              root.querySelector(`.option[data-k="${q.options.findIndex(x => x.correct)}"]`).classList.add('reveal');
              later(() => { i++; next(); }, 1800);
            }
          }
        };
      });
    };
    next();
  }

  function header(game, i, total, score) {
    return `
      <div class="game-head">
        <a class="btn btn-ghost" href="#/games">➡ الألعاب</a>
        <h1>${game.emoji} ${game.title}</h1>
        <div class="game-score">⭐ ${toArabicDigits(score)}</div>
      </div>
      <div class="progress-dots">${Array.from({ length: total }, (_, k) =>
        `<span class="${k < i ? 'done' : k === i ? 'now' : ''}"></span>`).join('')}</div>`;
  }

  function finish(game, root, score, total) {
    Store.logGame(game.id, score, total);
    const ratio = score / total;
    const bonus = ratio === 1 ? 3 : ratio >= 0.7 ? 1 : 0;
    if (bonus) Store.addStars(bonus);
    refreshHeader();
    const medal = ratio === 1 ? '🏆' : ratio >= 0.7 ? '🥇' : ratio >= 0.4 ? '🥈' : '💪';
    const msg = ratio === 1 ? 'ممتاز! كل الإجابات صحيحة' : ratio >= 0.7 ? 'رائع جداً!' : ratio >= 0.4 ? 'جيد! استمر' : 'لا بأس، لنحاول مرة أخرى';
    root.innerHTML = '';
    root.appendChild(h(`
      <section class="finish card">
        <div class="finish-medal">${medal}</div>
        <h1>${msg}</h1>
        <div class="finish-score">${toArabicDigits(score)} / ${toArabicDigits(total)}</div>
        <div class="finish-stars">${'⭐'.repeat(Math.max(1, Math.round(ratio * 5)))}</div>
        ${bonus ? `<p>مكافأة إضافية: +${toArabicDigits(bonus)} ⭐</p>` : ''}
        <div class="form-actions center">
          <button class="btn btn-primary btn-lg" id="again">🔁 العب مرة أخرى</button>
          <a class="btn btn-ghost btn-lg" href="#/games">🎮 لعبة أخرى</a>
        </div>
      </section>`));
    if (ratio >= 0.7) confetti();
    $('#again', root).onclick = () => start(game, root);
  }

  const signBox = (path, fallback) => ({ path, fallback });

  /* ---------- الألعاب ---------- */
  const builders = {
    /* حرف وصورة: يظهر الحرف (وإشارته)، يختار الطفل الصورة التي تبدأ به */
    'letter-picture'(game, root) {
      const order = sample(LETTERS, 8);
      const n = level() === 1 ? 3 : 4;
      quiz(game, root, i => {
        const target = order[i];
        const others = sample(LETTERS.filter(l => l.id !== target.id), n - 1);
        const showWords = level() === 3;
        return {
          prompt: `<div class="prompt-split"><div class="q-sign" id="qSign"></div><div class="q-big">${target.char}</div></div>`,
          question: 'أي صورة تبدأ بهذا الحرف؟',
          media: signBox(Media.pathFor('letters', target.id), `<span class="fb-char">${target.char}</span>`),
          options: shuffle([target, ...others]).map(l => ({
            html: `<span class="opt-emoji">${l.emoji}</span>${showWords || level() === 2 ? `<span class="opt-word">${l.word}</span>` : ''}`,
            correct: l.id === target.id,
          })),
        };
      });
    },

    /* صورة وكلمة */
    'picture-word'(game, root) {
      const pool = allVocab();
      const order = sample(pool, 8);
      const lv = level();
      quiz(game, root, i => {
        const target = order[i];
        const others = sample(pool.filter(x => x.word !== target.word && x.emoji !== target.emoji), lv === 1 ? 2 : 3);
        const opts = shuffle([target, ...others]);
        if (lv === 1) {
          // للصغار: نعرض الإشارة والكلمة ويختار الطفل الصورة
          return {
            prompt: `<div class="prompt-split"><div class="q-sign" id="qSign"></div><div class="q-word">${target.word}</div></div>`,
            question: 'اختر الصورة الصحيحة',
            media: signBox(Media.pathFor('vocab', target.id, target.cat), `<span class="fb-emoji">🤟</span>`),
            options: opts.map(o => ({ html: `<span class="opt-emoji">${o.emoji}</span>`, correct: o === target })),
          };
        }
        return {
          prompt: `<div class="q-big emoji">${target.emoji}</div>`,
          question: 'ما اسم هذه الصورة؟',
          options: opts.map(o => ({ html: `<span class="opt-word big">${o.word}</span>`, correct: o === target })),
        };
      });
    },

    /* لنعدّ معاً */
    count(game, root) {
      const lv = level();
      const [min, max] = lv === 1 ? [1, 5] : lv === 2 ? [1, 10] : [6, 20];
      const icons = ['🍎', '⭐', '🐟', '🎈', '🌸', '🚗', '🐥', '⚽', '🍓', '🦋'];
      quiz(game, root, () => {
        const n = min + Math.floor(Math.random() * (max - min + 1));
        const icon = icons[Math.floor(Math.random() * icons.length)];
        const set = new Set([n]);
        while (set.size < (lv === 1 ? 3 : 4)) {
          const d = Math.max(0, n + Math.floor(Math.random() * 7) - 3);
          set.add(d);
        }
        return {
          prompt: `<div class="count-box">${`<span>${icon}</span>`.repeat(n)}</div>`,
          question: 'كم عدد الأشياء؟',
          options: shuffle([...set]).map(v => ({
            html: `<span class="opt-num">${toArabicDigits(v)}</span>${lv === 1 ? `<span class="opt-dots">${'•'.repeat(v)}</span>` : ''}`,
            correct: v === n,
          })),
        };
      });
    },

    /* تحدي الحساب */
    math(game, root) {
      const lv = level();
      const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
      const icon = '🍏';
      quiz(game, root, () => {
        let a, b, op, ans;
        if (lv === 1) {
          op = Math.random() < 0.7 ? '+' : '−';
          a = rnd(1, 5); b = rnd(0, op === '+' ? 5 - Math.min(a, 4) : a);
          if (op === '+' && a + b > 9) b = 9 - a;
        } else if (lv === 2) {
          op = Math.random() < 0.5 ? '+' : '−';
          a = rnd(2, 20); b = rnd(1, op === '+' ? 20 : a);
        } else {
          op = ['+', '−', '×', '÷'][rnd(0, 3)];
          if (op === '×') { a = rnd(2, 12); b = rnd(2, 12); }
          else if (op === '÷') { b = rnd(2, 10); a = b * rnd(2, 10); }
          else { a = rnd(10, 99); b = rnd(5, op === '+' ? 99 : a); }
        }
        ans = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b;
        const set = new Set([ans]);
        const spread = lv === 3 ? 10 : 3;
        while (set.size < (lv === 1 ? 3 : 4)) set.add(Math.max(0, ans + rnd(-spread, spread)));
        const visual = lv === 1
          ? `<div class="math-visual"><span>${icon.repeat(a)}</span><b>${op}</b><span>${icon.repeat(b) || '∅'}</span></div>` : '';
        return {
          prompt: `${visual}<div class="math-eq">${toArabicDigits(a)} ${op} ${toArabicDigits(b)} = ؟</div>`,
          question: 'اختر الناتج الصحيح',
          options: shuffle([...set]).map(v => ({ html: `<span class="opt-num">${toArabicDigits(v)}</span>`, correct: v === ans })),
        };
      }, lv === 1 ? 6 : 10);
    },

    /* لعبة الذاكرة: طابق الصورة مع الكلمة */
    memory(game, root) {
      const lv = level();
      const pairs = lv === 1 ? 4 : lv === 2 ? 6 : 8;
      const items = sample(allVocab(), pairs);
      const cards = shuffle(items.flatMap((it, k) => [
        { pair: k, html: `<span class="opt-emoji">${it.emoji}</span>` },
        { pair: k, html: lv === 1 ? `<span class="opt-emoji">${it.emoji}</span><span class="opt-word">${it.word}</span>` : `<span class="opt-word big">${it.word}</span>` },
      ]));
      let open = [], matched = 0, moves = 0, lock = false;

      root.innerHTML = '';
      root.appendChild(h(`
        <div class="game-head">
          <a class="btn btn-ghost" href="#/games">➡ الألعاب</a>
          <h1>${game.emoji} ${game.title}</h1>
          <div class="game-score">🔄 <span id="moves">٠</span></div>
        </div>
        <p class="page-sub">اقلب بطاقتين: طابق كل صورة مع كلمتها.</p>
        <section class="memory-grid cols-${pairs <= 4 ? 4 : pairs <= 6 ? 4 : 4}">
          ${cards.map((c, k) => `<button class="mem-card" data-k="${k}"><span class="mem-back">❓</span><span class="mem-front">${c.html}</span></button>`).join('')}
        </section>`));

      root.querySelectorAll('.mem-card').forEach(btn => {
        btn.onclick = () => {
          if (lock || btn.classList.contains('flipped')) return;
          btn.classList.add('flipped');
          open.push(btn);
          if (open.length < 2) return;
          moves++;
          $('#moves', root).textContent = toArabicDigits(moves);
          const [a, b] = open;
          if (cards[a.dataset.k].pair === cards[b.dataset.k].pair) {
            a.classList.add('matched'); b.classList.add('matched');
            open = []; matched++;
            vibrate([50]);
            if (matched === pairs) {
              // كل محاولة زائدة عن (عدد الأزواج × ١.٥) تنقص نقطة
              const score = Math.max(1, pairs - Math.max(0, Math.ceil(moves - pairs * 1.5)));
              Store.addStars(score);
              later(() => finish(game, root, score, pairs), 600);
            }
          } else {
            lock = true;
            later(() => { a.classList.remove('flipped'); b.classList.remove('flipped'); open = []; lock = false; }, 900);
          }
        };
      });
    },

    /* رتّب الحروف لتكوين الكلمة */
    spell(game, root) {
      const lv = level();
      const pool = allVocab().filter(w => {
        const len = spellLetters(w.word).length;
        return len >= 2 && (lv === 2 ? len <= 4 : len >= 3);
      });
      const words = sample(pool, 6);
      let i = 0, score = 0;

      const next = () => {
        if (i >= words.length) return finish(game, root, score, words.length);
        const w = words[i];
        const letters = spellLetters(w.word);
        const tiles = shuffle(letters.map((l, k) => ({ ...l, k })));
        let pos = 0, mistakes = 0;
        root.innerHTML = '';
        root.appendChild(h(`
          ${header(game, i, words.length, score)}
          <section class="quiz">
            <div class="quiz-prompt"><div class="prompt-split"><div class="q-sign" id="qSign"></div><div class="q-big emoji">${w.emoji}</div></div></div>
            <div class="quiz-question">رتّب الحروف لتكوين الكلمة</div>
            <div class="spell-slots">${letters.map(() => '<span class="slot"></span>').join('')}</div>
            <div class="spell-tiles">${tiles.map((t, k) => `<button class="spell-tile" data-k="${k}">${t.char}</button>`).join('')}</div>
          </section>`));
        Media.render($('#qSign', root), Media.pathFor('vocab', w.id, w.cat), `<span class="fb-emoji">🤟</span>`);
        const slots = root.querySelectorAll('.slot');
        root.querySelectorAll('.spell-tile').forEach(btn => {
          btn.onclick = () => {
            const t = tiles[btn.dataset.k];
            if (t.char === letters[pos].char) {
              slots[pos].textContent = t.char;
              slots[pos].classList.add('filled');
              btn.disabled = true; btn.classList.add('used');
              pos++;
              if (pos === letters.length) {
                if (mistakes < 2) { score++; Store.addStars(1); refreshHeader(); }
                root.querySelector('.spell-slots').classList.add('complete');
                showFeedback(true, w.word);
                later(() => { i++; next(); }, 1400);
              }
            } else {
              mistakes++;
              btn.classList.add('shake');
              later(() => btn.classList.remove('shake'), 500);
              vibrate(150);
              if (mistakes >= 3) slots[pos].classList.add('hint'), (slots[pos].textContent = letters[pos].char);
            }
          };
        });
      };
      next();
    },
  };

  function start(game, root) {
    stop();
    builders[game.id](game, root);
  }

  return { start, stop };
})();
