import React from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { SlideVideo } from './SlideVideo';
import { SlideImage } from './SlideImage';

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.settings = {
      dots: true,
      infinite: false,
      speed: 100,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '0px',
      customPaging: (i)=>{
        return <a><img src={this.props.slides[i].media.options.srcThumbnail}/><span>{ i + 1 }</span></a>;
      },
      beforeChange: (currentSlide, nextSlide)=>{
        props.afterChangeHook(nextSlide);
        if (this.props.slides[currentSlide].media_types_id === 2 && this.videoSlides[currentSlide]) {
          this.videoSlides[currentSlide].checkPlay();
        }
      },
      afterChange: (currentSlide)=>{
        if (this.props.slides[currentSlide].media_types_id === 2 && this.videoSlides[currentSlide]) {
          this.videoSlides[currentSlide].playVideo();
        }
        if (this.props.slides[currentSlide].media_types_id === 1 && this.imageSlides[currentSlide]) {
          this.imageSlides[currentSlide].afterChange();
        }
      }
    };

    this.videoSlides = {};
    this.imageSlides = {};
    this.nextSlide = this.nextSlide.bind(this);
  }
  nextSlide() {
    this.refs.slider.slickNext();
  }
  render() {
    const slides = this.props.slides.map((slide, i)=>{
      return (
        <div key={i}>
          <div className="slick-slide-container">
            { slide.willDelete ?
              <div className="will-delete-overlay">
                <h3>¡Atención!</h3><p><b>Al guardar el slideshow esta diapositiva se borrará definitivamente.</b></p>
                <i className="glyphicon glyphicon-ok-circle reenable-slide" onClick={() => { this.props.reenableSlide(i); }} />
              </div>
              :
              <i className="glyphicon glyphicon-remove-circle remove-slide" onClick={() => { this.props.removeSlide(i); }} />
            }
            { slide.media_types_id === 1 ?
                <SlideImage ref={(el)=>{ this.imageSlides[i] = el; }} slide={ slide } nextSlide={ this.nextSlide } playback={ this.props.playback } index={i} activeSlide={ this.props.activeSlide }/>
              :
                <SlideVideo ref={(el)=>{ this.videoSlides[i] = el; }} slide={ slide } nextSlide={ this.nextSlide } playback={ this.props.playback } index={i} activeSlide={ this.props.activeSlide }/>
            }
            { slide.title && <h3> {slide.title} </h3> }
            { slide.subtitle && <h4> {slide.subtitle} </h4> }
            { slide.description && <p> {slide.description} </p> }
          </div>
        </div>);
    });

    return (
      <div>
        <Slick ref="slider" {...this.settings}>
          { slides }
        </Slick>
      </div>
    );
  }
}

Slider.propTypes = {
  slides: PropTypes.array,
  afterChangeHook: PropTypes.func,
  removeSlide: PropTypes.func,
  reenableSlide: PropTypes.func,
  playback: PropTypes.bool,
  activeSlide: PropTypes.number
};

export { Slider };
