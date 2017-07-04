import React from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { SlideVideo } from './SlideVideo';
import { SlideImage } from './SlideImage';

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSlide: 1
    };
    const self = this;
    this.settings = {
      dots: true,
      infinite: true,
      speed: 100,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '0px',
      customPaging: (i)=>{

        return (
          <a className={ self.props.slides[i].willDelete || this.props.hasExpired(self.props.slides[i]) ? 'will-delete-overlay' : '' } >
            <img src={self.props.slides[i].media.options.srcThumbnail}/>
            <span>{ i + 1 }</span>
          </a>
        );
      },
      beforeChange: (currentSlide, nextSlide)=>{
        if (self.props.slides[currentSlide] && self.props.slides[currentSlide].media_types_id === 2 && self.videoSlides[currentSlide]) {
          self.videoSlides[currentSlide].checkPlay();
        }
        self.setState({
          currentSlide: nextSlide + 1
        });
        self.props.afterChangeHook(nextSlide);
      },
      afterChange: (currentSlide)=>{
        if (self.props.slides[currentSlide] && self.props.slides[currentSlide].media_types_id === 2 && self.videoSlides[currentSlide]) {
          self.videoSlides[currentSlide].playVideo();
        }
        if (self.props.slides[currentSlide] && self.props.slides[currentSlide].media_types_id === 1 && self.imageSlides[currentSlide]) {
          self.imageSlides[currentSlide].afterChange();
        }
      }
    };

    this.videoSlides = {};
    this.imageSlides = {};
    this.nextSlide = this.nextSlide.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }
  nextSlide() {
    this.refs.slider.slickNext();
  }
  handleKey(e) {
    if(e.keyCode === 39) {
      this.refs.slider.slickNext();
    }
    if(e.keyCode === 37) {
      this.refs.slider.slickPrev();
    }
  }
  componentDidMount(){
    window.addEventListener('keyup', this.handleKey);
  }
  componentWillUnmount(){
    window.removeEventListener('keyup', this.handleKey);
  }
  render() {
    const slides = this.props.slides.map((slide, i)=>{
      return (
        <div key={i}>
          <div className="slick-slide-container">
            { slide.willDelete ?
              <div className="will-delete-overlay">
                <h3>¡Atención!</h3><br /><p><b>Al guardar el slideshow esta diapositiva se borrará definitivamente.</b></p>
                <i title="Activar" className="glyphicon glyphicon-ok-circle reenable-slide" onClick={() => { this.props.reenableSlide(i); }} />
              </div>
              :
              <i title="Borrar" className="glyphicon glyphicon-remove-circle remove-slide" onClick={() => { this.props.removeSlide(i); }} />
            }
            { slide.media_types_id === 1 ?
                <SlideImage ref={(el)=>{ this.imageSlides[i] = el; }} slide={ slide } nextSlide={ this.nextSlide } playback={ this.props.playback } index={i} activeSlide={ this.props.activeSlide }/>
              :
                <SlideVideo ref={(el)=>{ this.videoSlides[i] = el; }} slide={ slide } nextSlide={ this.nextSlide } playback={ this.props.playback } index={i} activeSlide={ this.props.activeSlide }/>
            }
            { slide.title && <h3> {slide.title} </h3> }
            { slide.subtitle && <h4> {slide.subtitle} </h4> }
            { slide.description && <p> {slide.description} </p> }
            <div className="counter"> {this.state.currentSlide} / {this.props.slides.length} </div>
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
  activeSlide: PropTypes.number,
  hasExpired: PropTypes.func
};

export { Slider };
