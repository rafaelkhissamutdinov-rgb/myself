(function () {
  'use strict';

  const AUTHORS = { bulgakov: 'Михаил Булгаков', chekhov: 'Антон Чехов', dostoevsky: 'Фёдор Достоевский' };
  const QUOTES = window.QUOTES;
  const PREDICTIONS = window.PREDICTIONS;
  const THEMES = window.THEMES;
  const MOTIFS = window.MOTIFS;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const params = new URLSearchParams(location.search);
  const NAME = (params.get('name') || 'Дарина').trim().slice(0, 40);

  const $ = (id) => document.getElementById(id);
  // ?day=ГГГГ-ММ-ДД — посмотреть, что выпадет в другой день (для проверки)
  const forced = params.get('day');
  const FORCED = forced && /^\d{4}-\d{2}-\d{2}$/.test(forced) ? Math.floor(Date.parse(forced + 'T00:00:00Z') / 864e5) : null;

  // ---------- детерминированный «случай»: у всех в один день одно и то же ----------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffled(arr, seed) {
    const rnd = mulberry32(seed), a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const range = (n) => Array.from({ length: n }, (_, i) => i);
  const dayNumber = (d) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);

  const themeOrder = shuffled(range(THEMES.length), 1903);
  const quoteOrder = shuffled(range(QUOTES.length), 1860);
  const predOrder = shuffled(range(PREDICTIONS.length), 1821);

  // ?theme=peach — посмотреть конкретные обои
  const forcedTheme = THEMES.find((t) => t.id === params.get('theme'));
  function themeFor(day) { return forcedTheme || THEMES[themeOrder[day % THEMES.length]]; }
  function predictionFor(day) { return predOrder[day % PREDICTIONS.length]; }
  function quoteFor(day, theme) {
    // шагаем по перемешанному списку; берём первую цитату, чьё настроение подходит обоям дня
    const n = QUOTES.length;
    const start = (day * 11) % n;
    for (let k = 0; k < n; k++) {
      const idx = quoteOrder[(start + k) % n];
      if (theme.moods.includes(QUOTES[idx].m)) return idx;
    }
    return quoteOrder[start];
  }

  // ---------- часы и приветствие ----------
  const fmtDate = new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
  function greetingFor(h) {
    if (h >= 5 && h < 12) return 'Доброе утро';
    if (h >= 12 && h < 17) return 'Добрый день';
    if (h >= 17 && h < 23) return 'Добрый вечер';
    return 'Доброй ночи';
  }
  function tick() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const clock = $('clock');
    clock.innerHTML = `${hh}<span class="colon">:</span>${mm}`;
    clock.dateTime = now.toISOString();
    $('date').textContent = fmtDate.format(now);
    const g = `${greetingFor(now.getHours())}, ${NAME}`;
    if ($('greeting').textContent !== g) $('greeting').textContent = g;
    document.body.classList.toggle('night', now.getHours() >= 23 || now.getHours() < 5);
    // в полночь — новый день: новые обои, предсказание и цитата
    if (FORCED === null && dayNumber(now) !== state.day) showDay(dayNumber(now), true);
  }

  // ---------- обои ----------
  let activeLayer = 'wp-a';
  function paintWallpaper(theme, day) {
    const next = activeLayer === 'wp-a' ? 'wp-b' : 'wp-a';
    const el = $(next);
    const stops = theme.bg.map((c, i) => `${c} ${Math.round((i / (theme.bg.length - 1)) * 100)}%`).join(', ');
    el.style.background = `linear-gradient(160deg, ${stops})`;
    el.innerHTML = '';

    const rnd = mulberry32(day * 7919 + 17);
    const w = window.innerWidth, h = window.innerHeight;
    const cols = w < 520 ? 4 : w < 960 ? 6 : 8;
    const rows = Math.max(5, Math.round(h / (w / cols)));
    const frag = document.createDocumentFragment();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rnd() < 0.2) continue; // пропуски, чтобы не было ровной сетки
        const name = theme.motifs[Math.floor(rnd() * theme.motifs.length)];
        const xc = (c + 0.5) / cols;
        // в центральной колонке — только мелкие и прозрачные, чтобы не мешать тексту
        const central = xc > 0.2 && xc < 0.8;
        const far = central || rnd() < 0.3;
        const size = far ? 26 + rnd() * 22 : 42 + rnd() * 46;
        const span = document.createElement('span');
        span.className = 'motif' + (far ? ' far' : '');
        span.style.setProperty('--s', `${Math.round(size)}px`);
        span.style.setProperty('--x', `${((c + 0.15 + rnd() * 0.7) / cols) * 100}%`);
        span.style.setProperty('--y', `${((r + 0.1 + rnd() * 0.8) / rows) * 100}%`);
        span.style.setProperty('--o', (central ? 0.34 + rnd() * 0.14 : far ? 0.45 + rnd() * 0.2 : 0.75 + rnd() * 0.25).toFixed(2));
        span.style.setProperty('--r', `${Math.round(rnd() * 70 - 35)}deg`);
        span.style.setProperty('--dx', `${Math.round(rnd() * 16 - 8)}px`);
        span.style.setProperty('--d', `${(7 + rnd() * 8).toFixed(1)}s`);
        span.style.setProperty('--delay', `${(-rnd() * 10).toFixed(1)}s`);
        span.style.marginLeft = span.style.marginTop = `${-Math.round(size / 2)}px`;
        span.innerHTML = MOTIFS[name](theme.col);
        frag.appendChild(span);
      }
    }
    el.appendChild(frag);
    el.classList.add('on');
    $(activeLayer).classList.remove('on');
    activeLayer = next;

    const root = document.documentElement.style;
    root.setProperty('--ink', theme.ink);
    root.setProperty('--accent', theme.accent);
    root.setProperty('--bg1', theme.bg[0]);
    document.querySelector('meta[name="theme-color"]').content = theme.bg[0];
    $('theme-name').textContent = `обои дня · ${theme.name}`;
  }

  // ---------- текст ----------
  function wordsInto(el, text, baseMs) {
    el.textContent = '';
    el.style.setProperty('--base', `${baseMs}ms`);
    text.split(' ').forEach((word, i, all) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.style.setProperty('--i', i);
      s.textContent = word;
      el.appendChild(s);
      if (i < all.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  function render(predIdx, quoteIdx, opts) {
    const q = QUOTES[quoteIdx];
    const pred = $('prediction');
    const words = PREDICTIONS[predIdx].split(' ').length;
    const base = opts.first ? 900 : 0;
    const quoteStart = base + words * 75 + 500;

    pred.classList.remove('show', 'leaving');
    wordsInto(pred, PREDICTIONS[predIdx], base);

    const bq = $('quote');
    bq.textContent = q.t;
    $('author').textContent = AUTHORS[q.a];
    $('work').textContent = q.s ? `${q.w} · ${q.s}` : q.w;
    $('label').textContent = opts.custom ? 'Ещё одно предсказание' : 'Предсказание на сегодня';

    const fig = document.querySelector('.quote');
    fig.classList.remove('show', 'leaving');
    [bq, $('author'), $('work')].forEach((el, i) => {
      el.classList.add('fade');
      el.style.setProperty('--base', `${quoteStart + i * 260}ms`);
    });
    void pred.offsetWidth; // перезапуск анимации
    pred.classList.add('show');
    fig.classList.add('show');
  }

  function leave() {
    if (reduceMotion) return Promise.resolve();
    $('prediction').classList.add('leaving');
    document.querySelector('.quote').classList.add('leaving');
    return new Promise((r) => setTimeout(r, 560));
  }

  // ---------- состояние ----------
  const state = { day: null, theme: null, pred: null, quote: null, seenQ: new Set(), seenP: new Set(), busy: false };

  function showDay(day, animate) {
    state.day = day;
    state.theme = themeFor(day);
    state.pred = predictionFor(day);
    state.quote = quoteFor(day, state.theme);
    state.seenQ = new Set([state.quote]);
    state.seenP = new Set([state.pred]);
    paintWallpaper(state.theme, day);
    const go = () => render(state.pred, state.quote, { first: !animate, custom: false });
    $('back').hidden = true;
    animate ? leave().then(go) : go();
  }

  function pickOther(list, seen, ok) {
    let pool = list.filter((i) => !seen.has(i) && ok(i));
    if (!pool.length) { seen.clear(); pool = list.filter(ok); }
    const i = pool[Math.floor(Math.random() * pool.length)];
    seen.add(i);
    return i;
  }

  $('another').addEventListener('click', async () => {
    if (state.busy) return;
    state.busy = true;
    const btn = $('another');
    btn.classList.toggle('spin');
    const qi = pickOther(range(QUOTES.length), state.seenQ, (i) => state.theme.moods.includes(QUOTES[i].m) && i !== state.quote);
    const pi = pickOther(range(PREDICTIONS.length), state.seenP, (i) => i !== state.pred);
    await leave();
    state.quote = qi; state.pred = pi;
    render(pi, qi, { first: false, custom: true });
    $('back').hidden = false;
    setTimeout(() => { state.busy = false; }, 700);
  });

  $('back').addEventListener('click', async () => {
    if (state.busy) return;
    state.busy = true;
    await leave();
    state.pred = predictionFor(state.day);
    state.quote = quoteFor(state.day, state.theme);
    render(state.pred, state.quote, { first: false, custom: false });
    $('back').hidden = true;
    setTimeout(() => { state.busy = false; }, 700);
  });

  // ---------- старт ----------
  showDay(FORCED !== null ? FORCED : dayNumber(new Date()), false);
  tick();
  setInterval(tick, 1000);

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => paintWallpaper(state.theme, state.day), 300);
  });

  requestAnimationFrame(() => document.body.classList.add('ready'));
})();
