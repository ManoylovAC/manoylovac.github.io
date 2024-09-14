document.addEventListener('DOMContentLoaded', function () {

  function resizeCommands() {
    if (window.innerWidth > 600) {
      const setNavigationEvents = () => {
        const navTitle = document.getElementById('navigation-title');
        const prevArrow = document.querySelector('#prev a');
        const nextArrow = document.querySelector('#next a');

        const currTitle = navTitle?.getAttribute('data-curr-title');
        const prevTitle = navTitle?.getAttribute('data-prev-title');
        const nextTitle = navTitle?.getAttribute('data-next-title');

        const setContestsTitle = () => navTitle.innerText = currTitle;

        if (navTitle) {
          navTitle.addEventListener("mouseout", setContestsTitle);
        }

        if (prevArrow) {
          prevArrow.addEventListener("mouseover", event => navTitle.innerText = `Назад: ${prevTitle}`);
          prevArrow.addEventListener("mouseout", setContestsTitle);
        }

        if (nextArrow) {
          nextArrow.addEventListener("mouseover", event => navTitle.innerText = `Далі: ${nextTitle}`);
          nextArrow.addEventListener("mouseout", setContestsTitle);
        }
      }

      setNavigationEvents();
    }
  }

  window.onresize = (function () {
    resizeCommands();
  });

  resizeCommands();
});
