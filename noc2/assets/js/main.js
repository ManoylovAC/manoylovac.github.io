// ==========================================
// 1. P5.js Sketches: Controls & Auto-Pause
// ==========================================
function getAllEmbeds() {
  return document.querySelectorAll('.p5-example-embed, [data-type="example"] div.not-prose.clear-both');
}

function updatePauseButtonUI(embed, isPaused) {
  const pauseBtn = embed.querySelector('.sketch-pause-btn') || embed.querySelector('.flex button:nth-child(2)');
  if (!pauseBtn) return;

  const label = pauseBtn.querySelector('.sketch-pause-label') || pauseBtn.querySelector('span');
  const iconPause = pauseBtn.querySelector('.icon-pause');
  const iconPlay = pauseBtn.querySelector('.icon-play');

  if (label) {
    label.textContent = isPaused ? 'Play' : 'Pause';
  }
  if (iconPause && iconPlay) {
    iconPause.classList.toggle('hidden', isPaused);
    iconPlay.classList.toggle('hidden', !isPaused);
  }
}

function pauseSketch(embed, isManual = false) {
  const iframe = embed.querySelector('iframe');
  const cw = iframe ? iframe.contentWindow : null;
  embed.dataset.paused = 'true';
  updatePauseButtonUI(embed, true);
  if (!cw) return;

  try {
    if (typeof cw.noLoop !== 'function') return;

    // For auto-pause (viewport scroll), wait until at least 1 frame has rendered
    // so the sketch canvas is never blank and setup() has completed
    if (!isManual && (typeof cw.frameCount !== 'number' || cw.frameCount < 1)) {
      return;
    }

    if (typeof cw.isLooping === 'function' && !cw.isLooping()) {
      if (!cw.__pausedByController) {
        cw.__isStaticSketch = true;
      }
      return;
    }

    cw.__pausedByController = true;
    cw.noLoop();
  } catch (e) {
    // Ignore cross-origin or uninitialized frame errors
  }
}

function resumeSketch(embed, isManual = false) {
  const iframe = embed.querySelector('iframe');
  const cw = iframe ? iframe.contentWindow : null;
  embed.dataset.paused = 'false';
  updatePauseButtonUI(embed, false);
  if (!cw) return;

  try {
    if (cw.__isStaticSketch && !isManual) return;

    if (typeof cw.loop === 'function') {
      if (typeof cw.isLooping !== 'function' || !cw.isLooping()) {
        cw.__pausedByController = false;
        cw.loop();
      }
    }
  } catch (e) {
    // Ignore cross-origin or uninitialized frame errors
  }
}

function adjustCanvasFrame(iframe, canvas) {
  if (!canvas || !iframe) return;
  if (canvas.width && canvas.height) {
    iframe.style.aspectRatio = `${canvas.width} / ${canvas.height}`;
  }
  canvas.style.width = '100%';
  canvas.style.height = '100%';
}

function initSketchIframe(embed, iframe) {
  const cw = iframe.contentWindow;
  if (!cw) return;

  try {
    if (cw.location && cw.location.href === 'about:blank') return;
    if (cw.__sketchInitStarted) return;
    cw.__sketchInitStarted = true;

    if (cw.document && cw.document.body) {
      cw.document.body.style.margin = '0';
      cw.document.body.style.overflow = 'hidden';
    }

    if (embed._waitFrameId) {
      window.cancelAnimationFrame(embed._waitFrameId);
      embed._waitFrameId = null;
    }

    const pollUntilFirstFrame = () => {
      embed._waitFrameId = null;
      if (iframe.contentWindow !== cw) return;

      try {
        if (cw.document && cw.document.body) {
          cw.document.body.style.margin = '0';
          cw.document.body.style.overflow = 'hidden';
        }

        const canvas = cw.document ? cw.document.querySelector('canvas') : null;
        if (canvas && !cw.__canvasAdjusted) {
          cw.__canvasAdjusted = true;
          adjustCanvasFrame(iframe, canvas);
        }

        const setupDone =
          Boolean(cw._setupDone) ||
          (typeof cw.frameCount === 'number' && cw.frameCount >= 1);

        if (!setupDone) {
          embed._waitFrameId = window.requestAnimationFrame(pollUntilFirstFrame);
          return;
        }

        // Check if the sketch itself called noLoop() in setup()
        if (
          typeof cw.isLooping === 'function' &&
          !cw.isLooping() &&
          !cw.__pausedByController
        ) {
          cw.__isStaticSketch = true;
          embed.dataset.paused = 'true';
          updatePauseButtonUI(embed, true);
          return;
        }

        // Wait until at least 1 frame has been drawn so canvas is never blank
        if (typeof cw.frameCount === 'number' && cw.frameCount < 1) {
          embed._waitFrameId = window.requestAnimationFrame(pollUntilFirstFrame);
          return;
        }

        // Frame 1 is rendered: sync with current viewport and manual pause state
        if (
          embed.dataset.userPaused === 'true' ||
          embed.dataset.inViewport === 'false'
        ) {
          pauseSketch(embed);
        } else {
          resumeSketch(embed);
        }
      } catch (err) {
        // Ignore
      }
    };

    embed._waitFrameId = window.requestAnimationFrame(pollUntilFirstFrame);
  } catch (e) {
    // Ignore cross-origin errors
  }
}

function setupSketches() {
  const allEmbeds = getAllEmbeds();
  if (allEmbeds.length === 0) return;

  allEmbeds.forEach((embed) => {
    const iframe = embed.querySelector('iframe');
    const resetBtn = embed.querySelector('.sketch-reset-btn') || embed.querySelector('.flex button:nth-child(1)');
    const pauseBtn = embed.querySelector('.sketch-pause-btn') || embed.querySelector('.flex button:nth-child(2)');

    if (iframe) {
      iframe.addEventListener('load', () => {
        initSketchIframe(embed, iframe);
      });

      // Handle case where iframe already finished loading before listener attached
      try {
        const cw = iframe.contentWindow;
        if (
          cw &&
          cw.location &&
          cw.location.href !== 'about:blank' &&
          iframe.contentDocument &&
          iframe.contentDocument.readyState === 'complete'
        ) {
          initSketchIframe(embed, iframe);
        }
      } catch (e) {
        // Ignore
      }
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        const cw = iframe ? iframe.contentWindow : null;
        let isCurrentlyPaused = embed.dataset.paused === 'true';
        try {
          if (cw && typeof cw.isLooping === 'function') {
            isCurrentlyPaused = !cw.isLooping();
          }
        } catch (e) {
          // Ignore
        }

        if (isCurrentlyPaused) {
          embed.dataset.userPaused = 'false';
          resumeSketch(embed, true);
        } else {
          embed.dataset.userPaused = 'true';
          pauseSketch(embed, true);
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (!iframe || !iframe.contentWindow) return;
        embed.dataset.userPaused = 'false';
        embed.dataset.paused = 'false';
        updatePauseButtonUI(embed, false);
        try {
          iframe.contentWindow.location.reload();
        } catch (e) {
          iframe.src = iframe.src;
        }
      });
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const embed = entry.target;
          embed.dataset.inViewport = entry.isIntersecting ? 'true' : 'false';

          const iframe = embed.querySelector('iframe');
          const cw = iframe ? iframe.contentWindow : null;
          if (cw && cw.__isStaticSketch) return;

          if (entry.isIntersecting) {
            if (embed.dataset.userPaused !== 'true') {
              resumeSketch(embed);
            }
          } else {
            pauseSketch(embed);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      }
    );

    allEmbeds.forEach((embed) => observer.observe(embed));
  }
}

// ==========================================
// 2. Scroll Spy for Sidebar Table of Contents
// ==========================================
function setupScrollSpy() {
  const headings = Array.from(document.querySelectorAll('main.prose h2[id]'));
  const sidebarLinks = Array.from(document.querySelectorAll('aside nav a[href^="#"]'));

  if (headings.length === 0 || sidebarLinks.length === 0) return;

  const linkMap = new Map();
  sidebarLinks.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    linkMap.set(id, link);
  });

  let currentActiveId = null;

  function updateActiveHeading() {
    const scrollPos = window.scrollY + 140;

    let activeId = headings[0].id;
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].offsetTop <= scrollPos) {
        activeId = headings[i].id;
      } else {
        break;
      }
    }

    if (activeId !== currentActiveId) {
      currentActiveId = activeId;
      sidebarLinks.forEach((link) => {
        link.classList.remove('text-noc-400', 'font-bold', 'translate-x-1');
        link.classList.add('text-gray-500');
      });

      const activeLink = linkMap.get(activeId);
      if (activeLink) {
        activeLink.classList.remove('text-gray-500');
        activeLink.classList.add('text-noc-400', 'font-bold', 'translate-x-1');
      }
    }
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveHeading();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  updateActiveHeading();
}

// ==========================================
// 3. Mobile Menu
// ==========================================
function handleMobileMenu() {
  const mobMenu = document.querySelector('.mb-menu');
  const mobBurger = document.querySelector('[aria-label="Toggle menu"]');
  const subMenuBtn = document.querySelector('.sub-menu-btn');
  const subMenu = document.querySelector('.sub-menu');
  const subMenuSvg = subMenuBtn ? subMenuBtn.querySelector('svg') : null;

  if (!mobBurger || !mobMenu) return;

  const line1 = mobBurger.querySelector('.block:nth-child(1)');
  const line2 = mobBurger.querySelector('.block:nth-child(2)');
  const line3 = mobBurger.querySelector('.block:nth-child(3)');
  const html = document.querySelector('html');

  mobBurger.addEventListener('click', () => {
    if (mobMenu.classList.contains('hidden')) {
      html.setAttribute('style', 'overflow: hidden;');
      document.body.setAttribute('style', 'overflow: hidden;');
      if (line1) line1.setAttribute('style', 'transform: rotate(45deg) translateY(6.5px) translateX(6.5px);');
      if (line2) line2.setAttribute('style', 'opacity: 0;');
      if (line3) line3.setAttribute('style', 'transform: rotate(-45deg) translateY(-6.5px) translateX(6.5px);');
    } else {
      html.setAttribute('style', '');
      document.body.setAttribute('style', '');
      if (line1) line1.setAttribute('style', '');
      if (line2) line2.setAttribute('style', 'opacity: 1;');
      if (line3) line3.setAttribute('style', '');
    }

    mobMenu.classList.toggle('hidden');
  });

  if (subMenu && subMenuBtn) {
    subMenuBtn.addEventListener('click', () => {
      const isHidden = subMenu.classList.toggle('hidden');
      if (subMenuSvg) {
        subMenuSvg.setAttribute('style', isHidden ? 'transform: scaleY(1);' : 'transform: scaleY(-1);');
      }
    });
  }
}

// ==========================================
// 4. Reveal Answer & Copy Code (.codesplit)
// ==========================================
function setupRevealAndCopyButtons() {
  // Reveal Answer buttons (both in exercises and in .codesplit with blanks)
  document.querySelectorAll('.reveal-btn').forEach((button) => {
    button.addEventListener('click', function () {
      const callout = this.closest('.callout');
      if (!callout) return;

      const isVisible = callout.classList.toggle('is-answer-visible');

      const title = this.querySelector('.reveal-btn-title');
      if (title) {
        title.textContent = isVisible ? 'Приховати відповідь' : 'Показати відповідь';
      }

      const eyeOpen = this.querySelector('.eye-open');
      const eyeOff = this.querySelector('.eye-off');
      if (eyeOpen && eyeOff) {
        eyeOpen.classList.toggle('hidden', isVisible);
        eyeOff.classList.toggle('hidden', !isVisible);
      }

      // If this is a codesplit with blanks, enable/disable the Copy button accordingly
      if (callout.classList.contains('codesplit')) {
        const copyBtn = callout.querySelector('.copy-btn');
        if (copyBtn) {
          copyBtn.classList.toggle('cursor-not-allowed', !isVisible);
          copyBtn.classList.toggle('text-gray-400', !isVisible);
          copyBtn.classList.toggle('text-gray-700', isVisible);
          copyBtn.classList.toggle('hover:bg-gray-300', isVisible);
        }
      }
    });
  });

  // Copy Code buttons (one per .codesplit block, copies ONLY code without comments)
  document.querySelectorAll('.codesplit .copy-btn').forEach((button) => {
    button.addEventListener('click', async function () {
      const codesplit = this.closest('.codesplit');
      if (!codesplit) return;

      const hasBlank = codesplit.querySelector('span.blank') !== null;
      const isAnswerVisible = codesplit.classList.contains('is-answer-visible');
      if (hasBlank && !isAnswerVisible) return;

      const badge = this.querySelector('.copied-badge');
      if (badge && badge.classList.contains('opacity-100')) return;

      const codeEls = codesplit.querySelectorAll('.pair pre code');
      const codeLines = Array.from(codeEls).map((el) =>
        el.textContent.replace(/\n$/, '')
      );
      const rawCode = codeLines.join('\n');

      try {
        await navigator.clipboard.writeText(rawCode);
        if (badge) {
          badge.classList.remove('opacity-0');
          badge.classList.add('opacity-100');
          setTimeout(() => {
            badge.classList.remove('opacity-100');
            badge.classList.add('opacity-0');
          }, 1000);
        }
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    });
  });
}

function start() {
  setupSketches();
  handleMobileMenu();
  setupScrollSpy();
  setupRevealAndCopyButtons();
}

start();
