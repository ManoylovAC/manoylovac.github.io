function getAllExamples () {
    return document.querySelectorAll('[data-type="example"]');
}

function getContentWindowFromExampleButton(btn) {
    if (!btn) { return; }

    const parentExample = btn.closest('[data-type="example"]');
    const iframe = parentExample.querySelector('iframe');
    return iframe.contentWindow;
}

function pauseHandler({ currentTarget }) {
    const contentWindow = getContentWindowFromExampleButton(currentTarget);
    const textPart = currentTarget.querySelector('span');

    if (contentWindow.frameRate() > 0) {
        contentWindow.frameRate(0);
        textPart.innerHTML = 'Play';
    } else {
        contentWindow.frameRate(60);
        textPart.innerHTML = 'Pause';
    }
}

function resetHandler({ currentTarget }) {
    const contentWindow = getContentWindowFromExampleButton(currentTarget);
    const textPart = currentTarget.nextSibling.querySelector('span');

    if (contentWindow) {
        contentWindow.setup();
        contentWindow.redraw();
        contentWindow.frameRate(60);
        textPart.innerHTML = 'Pause';
    }
}

function addSketchesEventsListeners() {
    let allExamples = getAllExamples();

    allExamples.forEach(example => {
        let resetBtn = example.querySelector('.flex button:nth-child(1)');
        let pauseBtn = example.querySelector('.flex button:nth-child(2)');
        const contentWindow = getContentWindowFromExampleButton(pauseBtn);

        if (contentWindow) {
            contentWindow.onload = function ({currentTarget}) {
                setTimeout(() => {
                    if (currentTarget.noLoop) {
                        const textPart = pauseBtn.querySelector('span');
                        currentTarget.frameRate(0);
                        textPart.innerHTML = 'Play';
                    }
                }, 1000);

                pauseBtn.addEventListener('click', pauseHandler);
                resetBtn.addEventListener('click', resetHandler);
            }
        }

    });
}

function handleMobileMenu() {
    const mobMenu = document.querySelector('.mb-menu');
    const mobBurger = document.querySelector('[aria-label="Toggle menu"]');
    const subMenuBtn = document.querySelector('.sub-menu-btn');
    const subMenu = document.querySelector('.sub-menu');
    const subMenuSvg = document.querySelector('svg');

    const line1 = mobBurger.querySelector('.block:nth-child(1)');
    const line2 = mobBurger.querySelector('.block:nth-child(2)');
    const line3 = mobBurger.querySelector('.block:nth-child(3)');

    const html = document.querySelector('html');

    if (mobBurger && mobMenu) {
        mobBurger.addEventListener('click', () => {
            if (mobMenu.classList.contains('hidden')) {
                html.setAttribute('style', 'overflow: hidden;');
                document.body.setAttribute('style', 'overflow: hidden;');
                line1.setAttribute('style', 'transform: rotate(45deg) translateY(6.5px) translateX(6.5px);');
                line2.setAttribute('style', 'opacity: 0;');
                line3.setAttribute('style', 'transform: rotate(-45deg) translateY(-6.5px) translateX(6.5px);');
            } else {
                html.setAttribute('style', '');
                document.body.setAttribute('style', '');
                line1.setAttribute('style', '');
                line2.setAttribute('style', 'opacity: 1;');
                line3.setAttribute('style', '');
            }

            mobMenu.classList.toggle('hidden');
        });
    }

    if (subMenu) {
        subMenuBtn.addEventListener('click', () => {
            if (subMenu.classList.contains('hidden')) {
                subMenuSvg.setAttribute('style', 'transform: scaleY(-1);');
            } else {
                subMenuSvg.setAttribute('style', 'transform: scaleY(-1);');
            }

            subMenu.classList.toggle('hidden');
        });
    }
}

function start() {
    addSketchesEventsListeners();
    handleMobileMenu();
}

start();


