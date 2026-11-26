// 灯箱逻辑：收集文章正文中的图片，点击放大，支持多图切换/ESC/触摸
export function initLightbox() {
  const overlay = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img') as HTMLImageElement;
  const caption = document.getElementById('lightbox-caption');
  const prevBtn = document.getElementById('lightbox-prev') as HTMLButtonElement | null;
  const nextBtn = document.getElementById('lightbox-next') as HTMLButtonElement | null;
  const closeBtn = document.getElementById('lightbox-close');

  if (!overlay || !img) return;

  let images: HTMLImageElement[] = [];
  let current = 0;

  function openAt(index: number) {
    current = index;
    const target = images[current];
    img.src = target.currentSrc || target.src;
    caption!.textContent = target.getAttribute('alt') || '';
    overlay!.classList.add('open');
    document.body.style.overflow = 'hidden';
    syncNav();
  }

  function close() {
    overlay!.classList.remove('open');
    document.body.style.overflow = '';
  }

  function next() {
    if (current < images.length - 1) openAt(current + 1);
  }

  function prev() {
    if (current > 0) openAt(current - 1);
  }

  function syncNav() {
    prevBtn!.style.display = images.length > 1 ? '' : 'none';
    nextBtn!.style.display = images.length > 1 ? '' : 'none';
    prevBtn!.disabled = current === 0;
    nextBtn!.disabled = current === images.length - 1;
  }

  // 收集 .prose 内的图片
  function collect() {
    images = Array.from(document.querySelectorAll('.prose img'));
    images.forEach((el, i) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openAt(i);
      });
      el.style.cursor = 'zoom-in';
    });
  }

  collect();
  // 若文章正文由客户端渲染动态插入，用 MutationObserver 兜底
  const mo = new MutationObserver(() => collect());
  mo.observe(document.body, { childList: true, subtree: true });

  closeBtn!.addEventListener('click', close);
  prevBtn!.addEventListener('click', prev);
  nextBtn!.addEventListener('click', next);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // 触摸滑动
  let touchX = 0;
  overlay.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
  });
  overlay.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
  });
}
