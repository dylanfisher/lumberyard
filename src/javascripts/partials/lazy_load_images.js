// Lazy load images

import 'lazysizes';

window.lazySizesConfig = window.lazySizesConfig || {};

window.lazySizesConfig.expand = 1000;
window.lazySizesConfig.expFactor = 2.5;
window.lazySizesConfig.hFac = 0.4;

document.addEventListener('lazybeforeunveil', function(e) {
  var bg = e.target.getAttribute('data-bg');
  var isMobile = window.innerWidth < 768;

  if ( isMobile ) {
    var srcMobile = e.target.getAttribute('data-src-mobile');

    if ( srcMobile ) {
      e.target.setAttribute('data-src', srcMobile);
    }

    bg = e.target.getAttribute('data-bg-mobile');
  }

  if ( bg ) {
    e.target.style.backgroundImage = 'url(' + bg + ')';
  }
});
