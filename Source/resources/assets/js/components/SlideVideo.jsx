/* globals YT */
import React from 'react';
import PropTypes from 'prop-types';

class SlideVideo extends React.Component {
  constructor(props) {
    super(props);
    this.loops = this.props.slide.video_loop;
    this.playerReady = false;
    this.checkPlay = this.checkPlay.bind(this);
    this.playVideo = this.playVideo.bind(this);
  }
  componentDidMount() {
    this.player = new YT.Player(this.slideElement, {
      videoId: this.props.slide.media.options.id_youtube,
      events: {
        'onReady': ()=>{
          this.playerReady = true;
          if (this.props.playback && (this.props.activeSlide === this.props.index)) {
            this.player.playVideo();
          }
        },
        'onStateChange': (e)=>{
          if (this.props.playback) {
            if (e.data === YT.PlayerState.ENDED) {
              this.loops--;
              if (this.loops) {
                this.player.playVideo();
              } else {
                this.loops = this.props.slide.video_loop;
                this.props.nextSlide();
              }
            }
          }
        }
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.playerReady && this.props.playback !== nextProps.playback && nextProps.playback && (this.props.activeSlide === this.props.index)) {
      this.player.playVideo();
    }
    if (this.playerReady && this.props.playback !== nextProps.playback && !nextProps.playback && (this.props.activeSlide === this.props.index)) {
      this.player.stopVideo();
    }
  }
  componentWillUnmount() {
    this.player = null;
  }
  playVideo() {
    if (this.playerReady &&  this.props.playback) {
      this.player.playVideo();
    }
  }
  checkPlay() {
    if (this.playerReady && this.player.getPlayerState() === YT.PlayerState.PLAYING) {
      this.player.stopVideo();
    }
  }
  render() {
    return ( <div ref={(el)=>{ this.slideElement = el;}} /> );
  }
}

SlideVideo.propTypes = {
  slide: PropTypes.object,
  nextSlide: PropTypes.func,
  playback: PropTypes.bool,
  activeSlide: PropTypes.number,
  index: PropTypes.number
};

export { SlideVideo };
