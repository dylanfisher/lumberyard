import jQuery from 'jquery';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

//////////////////////////////////////////////////////////////
// Global variables
//////////////////////////////////////////////////////////////

window.$ = jQuery;
window.jQuery = jQuery;

//////////////////////////////////////////////////////////////
// App namespace
//////////////////////////////////////////////////////////////

window.App = window.App || {};

App.$window = $(window);
App.$document = $(document);

App.pageLoad = [];
App.pageResize = [];
App.pageScroll = [];
App.pageThrottledScroll = [];
App.pageDebouncedResize = [];
App.breakpointChange = [];
App.orientationChange = [];
App.teardown = [];
App.runFunctions = function(array) {
  for (var i = array.length - 1; i >= 0; i--) {
    array[i]();
  }
};
App.reflow = function() {
  App.$document.trigger('app:reflow');
};
App.currentBreakpoint = undefined;
App.currentOrientation = undefined;

//////////////////////////////////////////////////////////////
// On page load
//////////////////////////////////////////////////////////////

$(function() {
  App.scrollTop = App.$window.scrollTop();

  App.windowWidth  = App.$window.width();
  App.windowHeight = App.$window.height();

  App.$html = $('html');
  App.$body = $('body');
  App.$header = $('#header');

  App.$html.removeClass('no-js');

  App.currentBreakpoint = App.breakpoint();
  App.currentOrientation = App.orientation();

  App.runFunctions(App.pageLoad);
  App.runFunctions(App.pageResize);
  App.runFunctions(App.pageDebouncedResize);
  App.runFunctions(App.pageScroll);
  App.runFunctions(App.pageThrottledScroll);

  // In some situations you may wish to add or remove functionality after a brief delay
  // on initial page load to avoid situations where CSS transitions flash into an opacity: 0 state.
  // window.setTimeout(function() {
  //   App.$html.removeClass('js-preload');
  //   App.$document.trigger('app:delayed-page-load');
  // }, 200);
});

//////////////////////////////////////////////////////////////
// On scroll
//////////////////////////////////////////////////////////////

App.$window.on('scroll', function() {
  App.scrollTop = App.$window.scrollTop();

  App.runFunctions(App.pageScroll);
});

App.$window.on('scroll', throttle(function() {
  App.runFunctions(App.pageThrottledScroll);
}, 200));

//////////////////////////////////////////////////////////////
// On resize
//////////////////////////////////////////////////////////////

App.$window.on('resize', function() {
  App.windowWidth  = App.$window.width();
  App.windowHeight = App.$window.height();

  var newBreakpoint = App.breakpoint();
  var newOrientation = App.orientation();

  if ( App.currentBreakpoint != newBreakpoint ) App.$document.trigger('app:breakpoint-change', [App.currentBreakpoint, newBreakpoint]);
  App.currentBreakpoint = newBreakpoint;

  if ( App.currentOrientation != newOrientation ) App.$document.trigger('app:orientation-change', [App.currentOrientation, newOrientation]);
  App.currentOrientation = newOrientation;

  App.runFunctions(App.pageResize);
});

App.$window.on('resize', debounce(function() {
  App.runFunctions(App.pageDebouncedResize);
}, 500));

//////////////////////////////////////////////////////////////
// On page teardown
//////////////////////////////////////////////////////////////

// Teardown is only needed for single page apps using e.g. Turbo
// App.$document.on('turbo:before-cache', function() {
//   App.runFunctions(App.teardown);
// });

//////////////////////////////////////////////////////////////
// Breakpoints
//////////////////////////////////////////////////////////////

App.breakpoint = function(checkIfSize) {
  // Make sure these match the breakpoint variables set in variables.scss
  var sm = 576;
  var md = 768;
  var lg = 1100;
  var xl = 1400;
  var breakpoint;

  if ( App.windowWidth < sm) {
    breakpoint = 'xs';
  } else if ( App.windowWidth >= xl ) {
    breakpoint = 'xl';
  } else if ( App.windowWidth >= lg ) {
    breakpoint = 'lg'
  } else if ( App.windowWidth >= md ) {
    breakpoint = 'md';
  } else {
    breakpoint = 'sm';
  }

  if ( checkIfSize !== undefined ) {
    if ( checkIfSize == 'xs' ) {
      return App.windowWidth < sm;
    } else if ( checkIfSize == 'sm' ) {
      return (App.windowWidth >= sm && App.windowWidth < md);
    } else if ( checkIfSize == 'md' ) {
      return (App.windowWidth >= md && App.windowWidth < lg);
    } else if ( checkIfSize == 'lg' ) {
      return (App.windowWidth >= lg && App.windowWidth < xl);
    } else if ( checkIfSize == 'xl' ) {
      return App.windowWidth >= xl;
    }
  } else {
    return breakpoint;
  }
};

App.breakpoint.isMobile = function() {
  return ( App.breakpoint('xs') || App.breakpoint('sm') );
};

//////////////////////////////////////////////////////////////
// Orientation
//////////////////////////////////////////////////////////////

App.orientation = function(checkIfSize) {
  var orientation = 'landscape';

  if ( App.windowWidth <= App.windowHeight ) {
    orientation = 'portrait';
  }

  if ( checkIfSize !== undefined ) {
    if ( checkIfSize == 'portrait' ) {
      return orientation == 'portrait';
    } else if ( checkIfSize == 'landscape' ) {
      return orientation == 'landscape';
    }
  }

  return orientation;
};

//////////////////////////////////////////////////////////////
// On breakpoint change
//////////////////////////////////////////////////////////////

App.$document.on('app:breakpoint-change', function() {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');

  App.runFunctions(App.breakpointChange);
});

//////////////////////////////////////////////////////////////
// On orientation change
//////////////////////////////////////////////////////////////

App.$document.on('app:orientation-change', function() {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');

  App.runFunctions(App.orientationChange);
});
