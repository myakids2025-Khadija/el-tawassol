/* =========================================================
   عرض وسائط لغة الإشارة
   يحاول بالترتيب: فيديو (.mp4 ثم .webm) ← صورة (.gif ثم .png ثم .jpg)
   وإذا لم يجد أي ملف يعرض بطاقة "مكان الإشارة" مع المسار المطلوب.
   ========================================================= */
const Media = (() => {
  const VIDEO_EXT = ['mp4', 'webm'];
  const IMAGE_EXT = ['gif', 'png', 'jpg', 'webp'];
  const cache = {}; // basePath -> {type, src} | null

  function pathFor(section, id, category) {
    if (section === 'vocab') return `media/vocab/${category}/${id}`;
    return `media/${section}/${id}`;
  }

  function placeholder(basePath, fallbackHTML) {
    const div = document.createElement('div');
    div.className = 'sign-placeholder';
    div.innerHTML = `
      <div class="sign-fallback">${fallbackHTML || '🤟'}</div>
      <div class="sign-hint">
        <span class="hand">🤟</span>
        <span>مكان فيديو الإشارة</span>
        <code dir="ltr">${basePath}.mp4</code>
      </div>`;
    return div;
  }

  function makeVideo(src) {
    const v = document.createElement('video');
    v.className = 'sign-media';
    v.src = src;
    v.muted = true; v.loop = true; v.playsInline = true;
    v.autoplay = Store.settings.autoplay;
    v.controls = true;
    v.setAttribute('aria-label', 'فيديو لغة الإشارة');
    return v;
  }

  function makeImage(src) {
    const img = document.createElement('img');
    img.className = 'sign-media';
    img.src = src;
    img.alt = 'صورة لغة الإشارة';
    return img;
  }

  function probe(src, kind) {
    return new Promise(resolve => {
      const el = kind === 'video' ? document.createElement('video') : new Image();
      const done = ok => { el.onerror = el.onload = el.onloadedmetadata = null; resolve(ok); };
      el.onerror = () => done(false);
      if (kind === 'video') { el.preload = 'metadata'; el.onloadedmetadata = () => done(true); }
      else el.onload = () => done(true);
      el.src = src;
      setTimeout(() => done(false), 4000);
    });
  }

  async function resolve(basePath) {
    if (basePath in cache) return cache[basePath];
    for (const ext of VIDEO_EXT) {
      if (await probe(`${basePath}.${ext}`, 'video')) return (cache[basePath] = { type: 'video', src: `${basePath}.${ext}` });
    }
    for (const ext of IMAGE_EXT) {
      if (await probe(`${basePath}.${ext}`, 'image')) return (cache[basePath] = { type: 'image', src: `${basePath}.${ext}` });
    }
    return (cache[basePath] = null);
  }

  /** يملأ الحاوية بوسيط الإشارة المناسب */
  async function render(container, basePath, fallbackHTML) {
    container.innerHTML = '<div class="sign-loading">⏳</div>';
    const found = await resolve(basePath);
    container.innerHTML = '';
    if (!found) container.appendChild(placeholder(basePath, fallbackHTML));
    else container.appendChild(found.type === 'video' ? makeVideo(found.src) : makeImage(found.src));
  }

  return { pathFor, render };
})();
