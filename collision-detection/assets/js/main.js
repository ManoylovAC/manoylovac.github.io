document.addEventListener('DOMContentLoaded', () => {
  const navTitle = document.getElementById('navigation-title');
  if (!navTitle) return;

  const prevArrow = document.querySelector('#prev a');
  const nextArrow = document.querySelector('#next a');

  const currTitle = navTitle.getAttribute('data-curr-title') || navTitle.textContent;
  const prevTitle = navTitle.getAttribute('data-prev-title');
  const nextTitle = navTitle.getAttribute('data-next-title');

  const isDesktopWidth = () => window.innerWidth > 600;
  const resetTitle = () => {
    navTitle.textContent = currTitle;
  };

  navTitle.addEventListener('mouseleave', resetTitle);

  if (prevArrow && prevTitle) {
    prevArrow.addEventListener('mouseenter', () => {
      if (isDesktopWidth()) {
        navTitle.textContent = `Назад: ${prevTitle}`;
      }
    });
    prevArrow.addEventListener('mouseleave', resetTitle);
  }

  if (nextArrow && nextTitle) {
    nextArrow.addEventListener('mouseenter', () => {
      if (isDesktopWidth()) {
        navTitle.textContent = `Далі: ${nextTitle}`;
      }
    });
    nextArrow.addEventListener('mouseleave', resetTitle);
  }

  window.addEventListener('resize', () => {
    if (!isDesktopWidth()) {
      resetTitle();
    }
  });
});
