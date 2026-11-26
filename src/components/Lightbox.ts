// 灯箱逻辑：文章正文图片点击放大，支持多图切换/ESC/方向键/触摸滑动
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
  let lastTrigger: HTMLElement | null = null; // 打开前的触发元素，关闭时还原焦点

  function openAt(index: number, trigger: HTMLElement) {
    current = index;
    const target = images[current];
    img.src = target.currentSrc || target.src;
    caption!.textContent = target.getAttribute('alt') || '';
    lastTrigger = trigger;
    overlay!.classList.add('open');
    overlay!.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    syncNav();
    closeBtn?.focus();
  }

  function close() {
    overlay!.classList.remove('open');
    overlay!.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastTrigger?.focus();
    lastTrigger = null;
  }

  function next() {
    if (current < images.length - 1 && lastTrigger) openAt(current + 1, lastTrigger);
  }

  function prev() {
    if (current > 0 && lastTrigger) openAt(current - 1, lastTrigger);
  }

  function syncNav() {
    if (prevBtn) prevBtn.style.display = images.length > 1 ? '' : 'none';
    if (nextBtn) nextBtn.style.display = images.length > 1 ? '' : 'none';
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === images.length - 1;
  }

  // 只重建索引，不重复绑定事件（绑定交给下方的事件委托，一次完成）
  function refresh() {
    images = Array.from(document.querySelectorAll('.prose img'));
  }

  // 事件委托：在 document 上只绑定一次，动态增删图片无需重新绑定，也不累积监听器
  document.addEventListener('click', (e) => {
    const el = e.target as HTMLElement | null;
    const target = el?.closest?.('.prose img');
    if (!target) return;
    e.preventDefault();
    refresh();
    const idx = images.indexOf(target as HTMLImageElement);
    if (idx !== -1) openAt(idx, target as HTMLElement);
  });

  refresh();

  // 仅观察正文容器，新增图片时防抖刷新索引
  const prose = document.querySelector('.prose');
  let moTimer: number | undefined;
  const mo = new MutationObserver(() => {
    window.clearTimeout(moTimer);
    moTimer = window.setTimeout(refresh, 100);
  });
  if (prose) mo.observe(prose, { childList: true, subtree: true });

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // 触摸滑动：preventDefault 阻止滑动结束合成的 click，避免翻页后误触关闭
  let touchX = 0;
  let swiped = false;
  overlay.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
    swiped = false;
  });
  overlay.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });
  overlay.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) {
      swiped = true;
      dx < 0 ? next() : prev();
    }
  });
  overlay.addEventListener('click', (e) => {
    if (swiped) {
      swiped = false;
      return;
    }
    if (e.target === overlay) close();
  });
}
