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
        <div>
          <ul className="nav nav-tabs" role="tablist">
            <li role="presentation" className="active">
              <a href="#slide" aria-controls="slide" role="tab" data-toggle="tab">
                Slideshow
              </a>
            </li>
            <li role="presentation">
              <a href="#birthday" aria-controls="birthday" role="tab" data-toggle="tab">Cumpleaños</a>
            </li>
          </ul>
          <div className="tab-content">
            <div role="tabpanel" className="tab-pane active" id="slide">
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
            <div role="tabpanel" className="tab-pane" id="birthday">
              <h1>Cumpleaños</h1>
            </div>
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
