$(document).on('ready', function () {
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    var $jsMsHome = $('.js-ms-home');
    var $jsMatrix = $('.js-matrix');
    var $jsCallBack = $('.js-call-back');
    var $jsPops = $('.js-pops');
    var $jsPopsClose = $('.js-pops-close');
    $jsMsHome.addClass('prep');

    matrixStyleRounding($jsMatrix);

    function preloader() {
        var preload = {
            $selfNode: $('.js-preloader'),
            isAnimDone: false,
            findChild: function(selector){
                return preload.$selfNode.find(selector);
            },
            animationPlay : function(){ },
        };

        if(preload.$selfNode.length) {
            preload.$logo  = preload.findChild('.js-pre-logo');
            preload.$progress  = preload.findChild('.js-pre-progress');
            preload.$center  = preload.findChild('.js-pre-center');
            preload.tlAnim = new TimelineLite({paused: true, onComplete: afterPreloader});

            preload.tlAnim
              .staggerFrom(preload.$logo, 1.2, {y: 40, ease: Power2.easeOut}, 0.15, 0.7)
              .staggerTo(preload.$logo, 1.0, {autoAlpha: 1, ease: Sine.easeIn}, 0.15, 0.8)
              .to(preload.$progress, 4.5, {width: '100%', ease: Power1.easeInOut}, "+=0.2")
              .to(preload.$selfNode, 0.7, {autoAlpha: 0, ease: Sine.easeIn}, "+=0.2")
              .to(preload.$center, 1.3, {y: 40, ease: Power2.easeIn}, "+=.3")
            ;
            preload.animationPlay = function () {
                preload.tlAnim.play();
            };
            preload.animationPlay();
        }
    }
    
    function afterPreloader() {
        var msHome = {
            $selfNode: $jsMsHome,
            isAnimDone: false,
            findChild: function(selector){
                return msHome.$selfNode.find(selector);
            },
            animationPlay : function(){ },
        };

        if(msHome.$selfNode.length) {
            msHome.$hline  = msHome.findChild('.js-hline');
            msHome.$cline  = msHome.findChild('.js-cline');
            msHome.$fline  = msHome.findChild('.js-fline');
            msHome.$flinevignette  = msHome.findChild('.js-vignette');

            var stackHolderDesk = [
              [
                msHome.$hline,
              ],
              [
                msHome.$cline.get(0),
                msHome.$cline.get(1),
                [
                  msHome.$cline.get(2),
                  msHome.$cline.get(3)
                ],
              ],
              [
                msHome.$fline
              ]

            ];
            var stackHolderTab = [
              [
                msHome.$hline
              ],
              [
                msHome.$cline.get(0),
                msHome.$cline.get(1),
                msHome.$cline.get(2),
                msHome.$cline.get(3)
              ],
              [
                msHome.$fline
              ]
            ];
            var stackHolderMob = msHome.$hline.add(msHome.$cline).add(msHome.$fline);

            var stackHolder = (window.innerWidth) >= 1200 ? stackHolderDesk : (window.innerWidth >= 768) ? stackHolderTab : stackHolderMob;
            msHome.tlAnim = new TimelineLite({paused: true, onComplete: function(){stackHolderMob.css('transform', '').removeClass('no-transition') }});

              if(window.innerWidth >= 768){
                msHome.tlAnim
                  .to(msHome.$flinevignette, 1.95, {autoAlpha: 1, ease: Power1.easeInOut}, .7)
                  .staggerFrom( stackHolder[0], 1.0, {y: 70, ease: Power3.easeOut}, 0.35, 2.2)
                  .staggerTo( stackHolder[0], 0.8, {autoAlpha: 1, ease: Sine.easeIn}, 0.35, 2.3)

                  .staggerFrom( stackHolder[1], 1.0, {y: 90, ease: Power3.easeOut}, 0.25, 2.7)
                  .staggerTo( stackHolder[1], 0.68, {autoAlpha: 1, ease: Sine.easeIn}, 0.25, 2.8)

                  .staggerFrom( stackHolder[2], 1.2, {y: 60, ease: Power3.easeOut}, 0.35, 3.8)
                  .staggerTo( stackHolder[2], 1.0, {autoAlpha: 1, ease: Sine.easeIn}, 0.35, 3.9)
                ;
              } else {
                msHome.tlAnim
                  .to(msHome.$flinevignette, 1.95, {autoAlpha: 1, ease: Power1.easeInOut}, .7)
                  .staggerFrom( stackHolder, 1.1, {y: 60, ease: Power3.easeOut}, 0.25, 2.2)
                  .staggerTo( stackHolder, 0.68, {autoAlpha: 1, ease: Sine.easeIn}, 0.25, 2.3)
                ;
              }
              msHome.animationPlay = function () {
                  msHome.tlAnim.play();
              };

              msHome.animationPlay();
        }
    }

    preloader();
   

  (function cloudsAnim(){
    var isFirstInit = true;

    TweenLite.defaultEase = Power1.easeInOut;
    var cloudIntro = function() {
        var MR = Math.random;
        var funcs =        {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null};
        var xPreStartPos = {1: WIDTH * .5, 2: WIDTH * .1, 3: WIDTH * .2,  4: -400, 5: -800, 6: -200, 7: 0};

      console.log('xPreStartPos ', xPreStartPos);
        function cloudGen(inCloudClass, objKey){
            return funcs[objKey] = function(){
                var tempWidth = MR()*45 + 30;
                var hStart = MR() * -HEIGHT/4 + HEIGHT/5;
                var hEnd = MR() * -HEIGHT/3 - hStart;
                var xSrart = isFirstInit ? xPreStartPos[objKey] : -WIDTH *.7;
                new TimelineMax()
                    .fromTo($(inCloudClass), MR() * 80 + 41,
                    {x: xSrart,  y: hStart, width: tempWidth + '%', opacity: MR() * .3 + .75},
                    {x: WIDTH * 1.7, y: hEnd, opacity: MR() * .7 +.1, width: tempWidth + MR() * 20 + '%', ease: Linear.easeNone, force3D: true,
                        onComplete: function(){funcs[objKey]();}}
                  );
            }
        }

        for (var key in funcs) {
            cloudGen('.cloud'+key, key)();
          if(key >= 7){
            isFirstInit = false;
          }
        }
    };

    var init = function() {
        cloudIntro();
    };
    if (document.readyState == 'complete') {
        init();
    } else {
        $(window).load(init);
    }
  })();




  $jsCallBack.click(function () {
    $jsPops.addClass('open');
  });

  $jsPopsClose.click(function () {
    $jsPops.removeClass('open');
  });




    //// helpers
    $(window).resize(throttle(function(){
        matrixStyleRounding($jsMatrix);
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
    }));

    function matrixStyleRounding(inObj) {
        if (inObj.length) {
            for (var i = 0; i < inObj.length; ++i) {
                var $tmpObj = $(inObj[i]);
                var matrix = $tmpObj.css('transform', '').css('transform');
                matrix = matrix.slice(7, -1).split(' ').map(function(item) {
                    return parseInt(item);
                });
                $tmpObj.css('transform', 'matrix(' + matrix.join(',') + ')');
            }
        }
    }

    /**
     * Throttle function.
     *
     * @param {Function} fn
     * @param {Number} [threshold]
     * @param {Object} [scope]
     * @return {Function}
     */
    function throttle(fn, threshold, scope) {
        var last, deferTimer;
        threshold = threshold || 250;

        return function () {
            var context = scope || this;
            var now = +new Date,
              args = arguments;
            if (last && now < last + threshold) {
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        }
    }

});
