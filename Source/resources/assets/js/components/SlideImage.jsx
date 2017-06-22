import React from 'react';
import PropTypes from 'prop-types';

class SlideImage extends React.Component {
  constructor(props) {
    super(props);

    this.afterChange = this.afterChange.bind(this);
  }
  componentDidMount() {
    if (this.props.playback) {
      this.timeout = setTimeout(this.props.nextSlide, this.props.slide.time_interval * 1000 );
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.playback !== nextProps.playback && nextProps.playback && (this.props.activeSlide === this.props.index)) {
      this.timeout = setTimeout(this.props.nextSlide, this.props.slide.time_interval * 1000);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  afterChange() {
    if (this.props.playback && (this.props.activeSlide === this.props.index)) {
      this.timeout = setTimeout(this.props.nextSlide, this.props.slide.time_interval * 1000);
    }
  }
  render() {
    return ( <img className="img-responsive" src={this.props.slide.media.options.src} /> );
  }
}

SlideImage.propTypes = {
  slide: PropTypes.object,
  nextSlide: PropTypes.func,
  playback: PropTypes.bool
};

export { SlideImage };
