import React from 'react';
import PropTypes from 'prop-types';
import { Slide } from './Slide.jsx';
import { SlideForm } from './SlideForm.jsx';

class Slideshow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0
    };
  }
  render() {
    const slidesThumbnails = this.props.slides.map((slide, i)=>{
      return ( <li key={i} className={ (i === this.state.activeSlide) ? 'active' : '' }><img src={slide.srcThumbnail}/></li> );
    });

    return (
      <div className="slideShow-container col-xs-12">
        <div id="slideContainer">
          <div id="activeSlide" className="row">
            <div className="col-md-8">
              <div className="row">
                <Slide slide={ this.props.slides[this.state.activeSlide] } />
              </div>
              <div id="slideScroller"  className="row">
                <div className="arrow left"><p>&lt;</p></div>
                  <ul className="slidesThumbnails">
                    { slidesThumbnails }
                  </ul>
                <div className="arrow right"><p>&gt;</p></div>
              </div>
            </div>
            <SlideForm slide={ this.props.slides[this.state.activeSlide] } />
          </div>
        </div>
      </div>
    );
  }
}

Slideshow.propTypes = {
  slides: PropTypes.array
};

export { Slideshow };
