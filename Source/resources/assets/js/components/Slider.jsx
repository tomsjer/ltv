import React from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';

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
        return <a><img src={this.props.slides[i].srcThumbnail}/><span>{ i + 1 }</span></a>;
      },
      beforeChange: (currentSlide, nextSlide)=>{
        props.afterChangeHook(nextSlide);
      }
    };
  }

  render() {
    const slides = this.props.slides.map((slide, i)=>{
      return slide.willDelete ? null : (
        <div key={i}>
          <div className="slick-slide-container">
            <img className="img-responsive" src={slide.src} />
            { slide.title && <h3> {slide.title} </h3> }
            { slide.subtitle && <h4> {slide.subtitle} </h4> }
            { slide.description && <p> {slide.description} </p> }
            <i className="glyphicon glyphicon-remove-circle remove-slide" onClick={() => { this.props.removeSlide(i); }} />
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
  removeSlide: PropTypes.func
};

export { Slider };
