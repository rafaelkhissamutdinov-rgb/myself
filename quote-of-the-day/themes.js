// Обои: пастельный фон + плавающие рисунки. Каждая тема подходит к одному-двум настроениям цитат.
(function () {
  // Рисунки — маленькие SVG в квадрате 64×64; цвета берутся из темы.
  const M = {
    peach: (c) => `<svg viewBox="0 0 64 64"><defs><radialGradient id="pg" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="${c.l}"/><stop offset="1" stop-color="${c.a}"/></radialGradient></defs><path d="M32 14c11-3 22 6 22 20 0 13-10 22-22 22S10 47 10 34c0-14 11-23 22-20z" fill="url(#pg)"/><path d="M32 15c-3 8-3 22 1 40" stroke="${c.b}" stroke-width="1.6" fill="none" opacity=".45"/><path d="M33 14c4-8 12-10 18-8-3 7-10 10-18 8z" fill="${c.g}"/></svg>`,
    cherry: (c) => `<svg viewBox="0 0 64 64"><path d="M22 44C26 28 34 16 44 8M42 44c-2-14-1-26 2-36" stroke="${c.g2}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M44 8c7-4 14-2 16 2-6 5-12 4-16-2z" fill="${c.g}"/><circle cx="21" cy="47" r="10" fill="${c.a}"/><circle cx="42" cy="48" r="10" fill="${c.a}"/><circle cx="18" cy="44" r="3" fill="#fff" opacity=".55"/><circle cx="39" cy="45" r="3" fill="#fff" opacity=".55"/></svg>`,
    blossom: (c) => `<svg viewBox="0 0 64 64"><g transform="translate(32 32)">${[0, 72, 144, 216, 288].map((r) => `<ellipse rx="10" ry="15" cy="-14" fill="${c.p}" transform="rotate(${r})"/>`).join('')}<circle r="7" fill="${c.c}"/></g></svg>`,
    petal: (c) => `<svg viewBox="0 0 64 64"><path d="M32 6c14 10 18 30 0 52C14 36 18 16 32 6z" fill="${c.p}"/><path d="M32 6l-4 8 4-2 4 2z" fill="${c.l}"/><path d="M32 14v36" stroke="${c.a}" stroke-width="1" opacity=".35"/></svg>`,
    daisy: (c) => `<svg viewBox="0 0 64 64"><g transform="translate(32 32)">${Array.from({ length: 12 }, (_, i) => `<ellipse rx="4.5" ry="13" cy="-15" fill="#fff" transform="rotate(${i * 30})"/>`).join('')}<circle r="8" fill="${c.c}"/></g></svg>`,
    leaf: (c) => `<svg viewBox="0 0 64 64"><path d="M10 54C10 26 28 10 56 8c0 28-18 46-46 46z" fill="${c.g}"/><path d="M12 52C26 38 38 26 52 12" stroke="${c.l}" stroke-width="1.6" fill="none" opacity=".7"/></svg>`,
    cloud: (c) => `<svg viewBox="0 0 64 64"><path d="M16 46h34a10 10 0 0 0 0-20 14 14 0 0 0-26-4 11 11 0 0 0-8 24z" fill="#fff"/><path d="M18 46h32" stroke="${c.a}" stroke-width="1.5" opacity=".25"/></svg>`,
    sun: (c) => `<svg viewBox="0 0 64 64"><g transform="translate(32 32)" fill="${c.a}">${Array.from({ length: 12 }, (_, i) => `<path d="M-2.5-30h5l-2.5 9z" transform="rotate(${i * 30})"/>`).join('')}<circle r="15" fill="${c.c}"/><circle r="15" fill="none" stroke="${c.a}" stroke-width="2"/></g></svg>`,
    lemon: (c) => `<svg viewBox="0 0 64 64"><path d="M8 34c2-12 16-22 30-20 6 1 12 4 16 9l4-1-1 4c1 12-12 22-28 22-6 0-12-3-17-7l-4 1 1-4c-1-1-1-3-1-4z" fill="${c.a}"/><ellipse cx="26" cy="27" rx="7" ry="3" fill="#fff" opacity=".45" transform="rotate(-20 26 27)"/><path d="M46 14c4-6 10-7 14-6-3 5-8 8-14 6z" fill="${c.g}"/></svg>`,
    slice: (c) => `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="${c.a}"/><circle cx="32" cy="32" r="21" fill="${c.l}"/><g transform="translate(32 32)">${Array.from({ length: 8 }, (_, i) => `<path d="M0 0L-6-18A19 19 0 0 1 6-18z" fill="${c.a}" opacity=".75" transform="rotate(${i * 45})"/>`).join('')}</g><circle cx="32" cy="32" r="2.5" fill="${c.l}"/></svg>`,
    strawberry: (c) => `<svg viewBox="0 0 64 64"><path d="M32 58C18 48 10 36 12 26c2-7 10-9 20-9s18 2 20 9c2 10-6 22-20 32z" fill="${c.a}"/>${[[22, 30], [32, 28], [42, 30], [26, 39], [38, 39], [32, 48], [18, 24], [46, 24]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.3" ry="2" fill="${c.c}"/>`).join('')}<path d="M32 20c-6-6-14-6-18-3 5 3 11 4 18 3zm0 0c6-6 14-6 18-3-5 3-11 4-18 3zm0 0c-2-6 0-12 3-14" fill="${c.g}" stroke="${c.g}" stroke-width="2" stroke-linecap="round"/></svg>`,
    raspberry: (c) => `<svg viewBox="0 0 64 64">${[[32, 22], [24, 28], [40, 28], [20, 37], [30, 34], [40, 36], [26, 45], [36, 45], [31, 53], [46, 30]].slice(0, 9).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c.a}"/><circle cx="${x - 2}" cy="${y - 2}" r="2" fill="#fff" opacity=".4"/>`).join('')}<path d="M32 16c-6-5-12-5-16-2 5 2 10 3 16 2zm0 0c6-5 12-5 16-2-5 2-10 3-16 2z" fill="${c.g}"/></svg>`,
    blueberry: (c) => `<svg viewBox="0 0 64 64"><circle cx="24" cy="38" r="14" fill="${c.a}"/><circle cx="42" cy="30" r="12" fill="${c.b}"/><path d="M24 31l-3-4 3 1 3-1z M42 24l-3-4 3 1 3-1z" fill="${c.c}"/><circle cx="19" cy="33" r="3" fill="#fff" opacity=".4"/><circle cx="38" cy="26" r="2.5" fill="#fff" opacity=".4"/></svg>`,
    sparkle: (c) => `<svg viewBox="0 0 64 64"><path d="M32 4c2 16 8 24 28 28-20 4-26 12-28 28-2-16-8-24-28-28C24 28 30 20 32 4z" fill="${c.s}"/></svg>`,
    star: (c) => `<svg viewBox="0 0 64 64"><path d="M32 6l7 17 18 1-14 12 5 18-16-10-16 10 5-18L7 24l18-1z" fill="${c.s}" stroke="${c.s}" stroke-width="3" stroke-linejoin="round"/></svg>`,
    rainbow: () => `<svg viewBox="0 0 64 64">${['#ff9aa8', '#ffc48a', '#ffe58a', '#a8e6a1', '#9ccfff', '#c6a8ff'].map((col, i) => `<path d="M${6 + i * 3.4} 48a${26 - i * 3.4} ${26 - i * 3.4} 0 0 1 ${52 - i * 6.8} 0" stroke="${col}" stroke-width="3.6" fill="none"/>`).join('')}<path d="M2 50c0-5 9-7 12-3 3-3 10-1 9 4z M41 51c0-5 9-7 12-3 3-3 10-1 9 4z" fill="#fff"/></svg>`,
    lavender: (c) => `<svg viewBox="0 0 64 64"><path d="M32 60V20" stroke="${c.g2}" stroke-width="2" stroke-linecap="round"/>${[10, 16, 22, 28, 34, 40].map((y, i) => `<ellipse cx="${i % 2 ? 28 : 36}" cy="${y}" rx="4" ry="6" fill="${c.a}" transform="rotate(${i % 2 ? -25 : 25} ${i % 2 ? 28 : 36} ${y})"/>`).join('')}<ellipse cx="32" cy="6" rx="3.5" ry="5" fill="${c.l}"/><path d="M32 52c-6-2-10-6-12-12 6 1 10 5 12 12z" fill="${c.g}"/></svg>`,
    butterfly: (c) => `<svg viewBox="0 0 64 64"><path d="M32 30C26 12 6 8 8 24c1 8 12 10 24 6zm0 0c6-18 26-22 24-6-1 8-12 10-24 6z" fill="${c.a}"/><path d="M32 32c-10 0-20 6-16 14 4 6 12 0 16-14zm0 0c10 0 20 6 16 14-4 6-12 0-16-14z" fill="${c.l}"/><path d="M32 20v26" stroke="${c.b}" stroke-width="2.6" stroke-linecap="round"/><path d="M32 20c-2-6-6-8-8-8m8 8c2-6 6-8 8-8" stroke="${c.b}" stroke-width="1.4" fill="none"/></svg>`,
    drop: (c) => `<svg viewBox="0 0 64 64"><path d="M32 6c10 16 18 25 18 35a18 18 0 0 1-36 0c0-10 8-19 18-35z" fill="${c.a}" opacity=".8"/><ellipse cx="25" cy="40" rx="4" ry="7" fill="#fff" opacity=".55"/></svg>`,
    bird: (c) => `<svg viewBox="0 0 64 64"><path d="M6 34c8-8 18-8 26 2 8-10 18-10 26-2-9-3-17 0-26 10-9-10-17-13-26-10z" fill="${c.b}" opacity=".7"/></svg>`,
    apple: (c) => `<svg viewBox="0 0 64 64"><path d="M32 20c-6-5-20-4-22 10-2 13 8 28 16 28 3 0 4-2 6-2s3 2 6 2c8 0 18-15 16-28-2-14-16-15-22-10z" fill="${c.a}"/><path d="M32 20c0-6 2-10 5-13" stroke="${c.g2}" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M35 14c6-5 13-4 16-2-5 5-11 5-16 2z" fill="${c.g}"/><ellipse cx="20" cy="32" rx="3.5" ry="6" fill="#fff" opacity=".4"/></svg>`,
    watermelon: (c) => `<svg viewBox="0 0 64 64"><path d="M4 22a28 28 0 0 0 56 0z" fill="${c.g}"/><path d="M8 22a24 24 0 0 0 48 0z" fill="#f6fff0"/><path d="M11 22a21 21 0 0 0 42 0z" fill="${c.a}"/>${[[22, 30], [32, 34], [42, 30], [27, 38], [37, 38]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.5" ry="2.6" fill="#3b2a2a"/>`).join('')}</svg>`,
  };

  // a — основной цвет, l — светлый, b — тёмный, g/g2 — листья/стебли, p — лепестки, c — сердцевина, s — искры
  const T = [
    { id: 'peach', name: 'персиковый сад', moods: ['warm', 'light'], bg: ['#ffe8da', '#ffcfb8', '#ffe2d4'], ink: '#5a2f24', accent: '#e9825f',
      col: { a: '#ff9f7a', l: '#ffd6a0', b: '#c4563a', g: '#8cc084', g2: '#6b8f4e', p: '#ffc1cc', c: '#ffe08a', s: '#fff4e8' }, motifs: ['peach', 'peach', 'blossom', 'leaf', 'sparkle'] },
    { id: 'cherry', name: 'вишнёвый', moods: ['dream', 'warm'], bg: ['#ffeef1', '#ffcdd6', '#ffe3e8'], ink: '#5b1f2b', accent: '#d64561',
      col: { a: '#d93a55', l: '#fff', b: '#8f1f33', g: '#7fbf7a', g2: '#6b4a35', p: '#ffdbe4', c: '#ffd36b', s: '#fff' }, motifs: ['cherry', 'cherry', 'blossom', 'petal', 'leaf'] },
    { id: 'rainbow', name: 'радужный', moods: ['light', 'dream'], bg: ['#ffe0ea', '#fff1cf', '#e0f7e3', '#dcecff', '#eee1ff'], ink: '#3d3355', accent: '#8f6bd6',
      col: { a: '#ffb3c6', l: '#fff', b: '#6b5aa8', g: '#a8e6a1', g2: '#7ab07a', p: '#ffd1e0', c: '#ffe58a', s: '#ffffff' }, motifs: ['rainbow', 'cloud', 'sparkle', 'sparkle', 'star'] },
    { id: 'sky', name: 'небесный', moods: ['dream', 'sigh'], bg: ['#e6f4ff', '#c6e4ff', '#f4faff'], ink: '#1f3b57', accent: '#4a8fd1',
      col: { a: '#9cc8f0', l: '#fff', b: '#4f7aa6', g: '#a8d8c0', g2: '#6f9c86', p: '#fff', c: '#ffe08a', s: '#ffffff' }, motifs: ['cloud', 'cloud', 'bird', 'sparkle', 'bird'] },
    { id: 'sunny', name: 'солнечный', moods: ['warm', 'light'], bg: ['#fff8d6', '#ffe49a', '#ffd9b0'], ink: '#4f3410', accent: '#e39b1f',
      col: { a: '#ffb627', l: '#fff3c4', b: '#b9770e', g: '#9fd18a', g2: '#6b9a52', p: '#fff', c: '#ffd23f', s: '#fffbe8' }, motifs: ['sun', 'daisy', 'sparkle', 'sun', 'leaf'] },
    { id: 'lemon', name: 'лимонный', moods: ['light', 'warm'], bg: ['#fffde0', '#fff2a8', '#eef8cf'], ink: '#43420f', accent: '#c9b200',
      col: { a: '#ffe14d', l: '#fff8c2', b: '#a99000', g: '#8fca6e', g2: '#5f8f45', p: '#fff', c: '#ffe14d', s: '#fffbe0' }, motifs: ['lemon', 'slice', 'leaf', 'lemon', 'blossom'] },
    { id: 'lavender', name: 'лавандовый', moods: ['dream', 'sigh'], bg: ['#f3edff', '#e0d4ff', '#f8eeff'], ink: '#3a2c5c', accent: '#8a6fd1',
      col: { a: '#a98be0', l: '#e9dcff', b: '#5d4596', g: '#a9c9a0', g2: '#7c9a72', p: '#efe6ff', c: '#ffe08a', s: '#ffffff' }, motifs: ['lavender', 'lavender', 'butterfly', 'sparkle', 'petal'] },
    { id: 'mint', name: 'мятный', moods: ['warm', 'sigh'], bg: ['#e8fcf3', '#c9f2e1', '#f2fce6'], ink: '#1f4a3c', accent: '#2fa37c',
      col: { a: '#8fdcc0', l: '#e3fff3', b: '#2f7d63', g: '#6fcf97', g2: '#3f8f66', p: '#fff', c: '#ffe08a', s: '#ffffff' }, motifs: ['leaf', 'leaf', 'drop', 'daisy', 'sparkle'] },
    { id: 'strawberry', name: 'клубничный', moods: ['light', 'warm'], bg: ['#fff0ee', '#ffd0d4', '#fff4ea'], ink: '#5a1f26', accent: '#e8455a',
      col: { a: '#f2475e', l: '#ffd6dc', b: '#a8233a', g: '#6fbf73', g2: '#4f8f53', p: '#fff', c: '#ffe08a', s: '#fff' }, motifs: ['strawberry', 'strawberry', 'blossom', 'leaf', 'sparkle'] },
    { id: 'orange', name: 'апельсиновый', moods: ['light', 'warm'], bg: ['#fff3e2', '#ffd8ad', '#ffeacd'], ink: '#55300f', accent: '#ee7f1f',
      col: { a: '#ff9a2e', l: '#ffd59a', b: '#c45f0c', g: '#8cc57a', g2: '#5d8f4a', p: '#fff', c: '#ffcf5c', s: '#fff6e8' }, motifs: ['slice', 'slice', 'blossom', 'leaf', 'sparkle'] },
    { id: 'blueberry', name: 'черничный', moods: ['sigh', 'dream'], bg: ['#eaedff', '#d2d8ff', '#f1e9ff'], ink: '#26295a', accent: '#5b63c9',
      col: { a: '#5b63c9', l: '#c9cdf7', b: '#3c4296', g: '#8fc79a', g2: '#5f8f6a', p: '#fff', c: '#2d3070', s: '#ffffff' }, motifs: ['blueberry', 'blueberry', 'star', 'sparkle', 'leaf'] },
    { id: 'sakura', name: 'сакура', moods: ['dream', 'warm'], bg: ['#fff3f8', '#ffdcea', '#f7ecff'], ink: '#55253d', accent: '#e06a9a',
      col: { a: '#f29bbd', l: '#fff', b: '#b94a78', g: '#a7d39a', g2: '#7b5a48', p: '#ffd3e4', c: '#ffcf7a', s: '#fff' }, motifs: ['petal', 'petal', 'blossom', 'butterfly', 'petal'] },
    { id: 'raspberry', name: 'малиновый', moods: ['light', 'warm'], bg: ['#ffeaf3', '#ffc6dd', '#ffeee6'], ink: '#5a1a37', accent: '#d63b7a',
      col: { a: '#e0447e', l: '#ffd6e6', b: '#a01f55', g: '#7cc27e', g2: '#4f8f53', p: '#fff', c: '#ffe08a', s: '#fff' }, motifs: ['raspberry', 'raspberry', 'leaf', 'sparkle', 'blossom'] },
    { id: 'watermelon', name: 'арбузный', moods: ['light'], bg: ['#effde9', '#ffdbe0', '#fff0f2'], ink: '#4a2229', accent: '#ef5a6f',
      col: { a: '#ff6b7f', l: '#ffd6dc', b: '#b8323f', g: '#5fbf6a', g2: '#3f8f4a', p: '#fff', c: '#ffe08a', s: '#fff' }, motifs: ['watermelon', 'watermelon', 'sparkle', 'drop', 'leaf'] },
    { id: 'chamomile', name: 'ромашковое поле', moods: ['warm', 'sigh'], bg: ['#f6fcec', '#e6f5cd', '#fffbe8'], ink: '#33421c', accent: '#8cb03a',
      col: { a: '#c5e38a', l: '#fff', b: '#5f7d22', g: '#8cc56b', g2: '#5d8f45', p: '#fff', c: '#ffd23f', s: '#ffffff' }, motifs: ['daisy', 'daisy', 'leaf', 'butterfly', 'daisy'] },
    { id: 'apple', name: 'яблочный', moods: ['warm', 'light'], bg: ['#f3fce6', '#dcf2c2', '#ffe9e2'], ink: '#2f421f', accent: '#e05a4a',
      col: { a: '#f0675a', l: '#ffe1da', b: '#a8322a', g: '#7cc46a', g2: '#6b4a35', p: '#fff3f5', c: '#ffd36b', s: '#fff' }, motifs: ['apple', 'apple', 'blossom', 'leaf', 'sparkle'] },
  ];

  window.THEMES = T;
  window.MOTIFS = M;
})();
