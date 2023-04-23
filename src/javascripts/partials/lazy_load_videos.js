import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import * as viewport from "../utilities/viewport";

export class Video {
  constructor() {
    this.$placeholders = $('.lazy-video-placeholder');

    if ( !this.$placeholders.length ) return;

    this.initialize();

    this.removePersistedVideos();

    document.addEventListener('turbo:before-cache', () => {
      this.turnOffEventListeners();
    }, { once: true });
  }

  removePersistedVideos() {
    document.querySelectorAll('.turbo-persist-video').forEach((video) => {
      video.pause();
      video.src = '';
      video.remove();
      video = null;
    });
  }

  turnOffEventListeners() {
    this.$videos.each((index, video) => {
      if ( video.classList.contains('turbo-persist-video') ) return;

      video.pause();
      video.src = '';
      video.remove();
      video = null;
    });
    this.$videos = null;
    this.$placeholders.removeClass('lazy-video-initialized');
    App.$window.off('resize.lazyLoadVideo scroll.lazyLoadVideo');
  }

  initialize() {
    if ( !this.$placeholders.length ) return;

    this.$placeholders.each(function() {
      var $placeholder = $(this);

      if ( $placeholder.hasClass('lazy-video-initialized') ) return;

      var videoHTML = $placeholder.attr('data-video-tag-html');
      var $video = $(videoHTML);

      if ( $placeholder.hasClass('desktop-video') && App.breakpoint.isMobile() ) return;
      if ( $placeholder.hasClass('mobile-video') && !App.breakpoint.isMobile() ) return;

      var video = $video[0];
      var srcFull = $video.attr('data-src');
      var srcMobile = $video.attr('data-src-mobile');
      var src;

      if ( App.breakpoint.isMobile() && srcMobile ) {
        src = srcMobile;
      } else {
        src = srcFull;
      }

      $video.addClass('lazy-video').attr('src', src);
      $placeholder.addClass('lazy-video-initialized').hide().after($video);

      $video.one('loadedmetadata', function() {
        $video.closest('.video-jumpfix').addClass('has-loadedmetadata');
      });
    });

    this.$videos = $('.lazy-video');

    var checkForVisibility = () => {
      if ( !this.$videos || !this.$videos.length ) return;

      this.$videos.each((index, element) => {
        var $video = $(element);
        var video = $video[0];
        var autoplay = $video.attr('autoplay');
        var isInHero = $video.closest('#hero-viewport-container').length;
        var isVisible = false;

        if ( !autoplay || autoplay == 'false' ) {
          $video.data('lazy-load-video-autoplay-disabled', true);
          return;
        }

        if ( isInHero ) {
          if ( App.scrollTop < App.windowHeight / 2 ) {
            isVisible = true;
          }
        } else if ( viewport.isVisible(video) ) {
          if ( $video.data('has-been-paused-by-user') ) return;
          if ( $video.data('hasFinishedPlaying') == true && ( !loop || loop == 'false' ) ) return;

          isVisible = true;
        }

        if ( isVisible && !$video.is(':visible') ) {
          isVisible = false;
        }

        if ( isVisible ) {
          var playPromise = video.play();

          if ( playPromise !== undefined ) {
            playPromise.then(function() {
              // Automatic playback started
            }).catch(function(error) {
              // Auto-play was prevented
              console.warn('Error playing video', error);
            });
          }
        } else {
          video.pause();
        }
      });
    };

    App.$window.on('resize.lazyLoadVideo', debounce(checkForVisibility, 500));
    App.$window.on('scroll.lazyLoadVideo', throttle(checkForVisibility, 500));
    checkForVisibility();

    var $disabledVideos = this.$placeholders.filter(function() {
      return $(this).data('lazy-load-video-autoplay-disabled') == true;
    });

    if ( this.$placeholders.length == $disabledVideos.length ) {
      this.turnOffEventListeners();
    }
  }
}

// Export an init function that looks for and instantiates the module on pageload
export default (() => {
  App.pageLoad.push(() => {
    new Video();
  });

  $(function() {
    App.$document.on('click.lazyLoadVideo', '.lazy-video', function() {
      var $video = $(this);

      if ( $video[0].paused ) {
        $video.data('has-been-paused-by-user', false);
        $video[0].play();
      } else {
        $video.data('has-been-paused-by-user', true);
        $video[0].pause();
      }
    });
  });
})();
