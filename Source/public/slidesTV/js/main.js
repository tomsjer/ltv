var slides;
var activeSlide = 0;
var timeoutId = 0;
var slider;
var endpoint = "http://lorealtv.com/api/sliders/all";

var SlideImage = function(){};
SlideImage.prototype = {
  init: function() {
    timeoutId = setTimeout(function() {
      slider.slick("slickNext");
    }.bind(this), this.time_interval);
  },
  beforeChange: function(e, slick, c, n) {
    clearTimeout(timeoutId);
  },
  afterChange: function(e, slick, c) {
    timeoutId = setTimeout(function() {
      if (c < slick.$slides.length - 1) {
        slider.slick('slickNext');
      } else {
        slider.slick('goTo', 0, false);
      }
    }.bind(this), this.time_interval);
  },
  render: function() {
    this.$slideElement = $('<div class="slide" id="slide_' + this.i + '"/>');
    this.$slideElement.css('background-image', "url('" + this.media.src + "')");
    this.$title = this.title ? $('<h1>' + this.title + '</h1>') : '';
    this.$subtitle = this.subtitle ? $('<p>' + this.subtitle + '</p>') : '';
    this.$slideElement.append( this.$title, this.$subtitle );
    $(".slider").append( this.$slideElement );
  }
};
var SlideVideo = function(){};
SlideVideo.prototype = {
  beforeChange: function(e, slick, c, n) {
    this.player.stopVideo();
  },
  afterChange: function(e, slick, c) {
    if(this.player) {
      this.player.playVideo();
    }
  },
  render: function() {
    this.$slideElement = $('<div class="slide" id="slide_' + this.i + '"/>');
    this.$slideElement.css('background-image', "url('" + this.media.src + "')");
    this.$title = this.title ? $('<h1>' + this.title + '</h1>') : '';
    this.$subtitle = this.subtitle ? $('<p>' + this.subtitle + '</p>') : '';
    
    this.loops = this.video_loop;
    this.$slideElement.append( this.$title, this.$subtitle );
    $(".slider").append( this.$slideElement );
    this.player = new YT.Player(this.$slideElement.get(0), {
      videoId: this.media.options.id_youtube,
      events: {
        'onReady': () => {
          this.playerReady = true;
          if (this.i === activeSlide) {
            this.player.playVideo();
          }
        },
        'onStateChange': (e) => {
          if (e.data === YT.PlayerState.ENDED) {
            this.loops--;
            if (this.loops) {
              this.player.playVideo();
            } else {
              this.loops = this.video_loop ;
              if (this.i < slider.get(0).slick.$slides.length - 1) {
                slider.slick('slickNext');
              } else {
                slider.slick('goTo', 0, false);
              }
            }
          }

        }
      }
    });
  }
};

function setSlide(_slide, i) {
  _slide.i = i;
  _slide.media.options = JSON.parse(_slide.media.options);
  _slide.time_interval = (_slide.time_interval) ? _slide.time_interval * 1000 : null;
  const slide = (_slide.media.media_types_id === 1) ? Object.assign(new SlideImage(), _slide) : Object.assign(new SlideVideo(), _slide);
  slide.render();
  return slide;
}

$(document).ready(function() {

  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

});

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {

  $.ajax({
    dataType: 'json',
    url: endpoint,
    success: function(result) {
      slides = result.map((slide, i) => {
        return setSlide(slide, i);
      });

      slider = $('.slider').slick({
        arrows: false,
        draggable: false,
        pauseOnFocus: false,
        pauseOnHover: false,
        infinite: true,
      });

      slider.on('beforeChange', function(e, slick, c, n) {
        slides[activeSlide].beforeChange.apply(slides[activeSlide], [].slice.call(arguments));
        activeSlide = n;
      });
      slider.on('afterChange', function(e, slick, c) {
        slides[activeSlide].afterChange.apply(slides[activeSlide], [].slice.call(arguments));
      });

      // Manually triggering first slide timeout()
      slides[0].init();
    },
    done: function() {

    },
    error: function(xhr, status, error) {
      console.log(xhr, status, error);
    }
  });
}