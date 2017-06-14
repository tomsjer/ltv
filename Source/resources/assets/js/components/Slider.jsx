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
        return <a><img src={this.props.slides[i].srcThumbnail}/><span>{i}</span></a>;
      },
      beforeChange: (currentSlide, nextSlide)=>{
        props.afterChangeHook(nextSlide);
      }
    };

    this.dropHandler = this.dropHandler.bind(this);
    this.dragoverHandler = this.dragoverHandler.bind(this);
  }
  dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
  }
  dropHandler(ev) {
    ev.preventDefault();
    const slide = JSON.parse(ev.dataTransfer.getData('text'));
    slide.srcThumbnail = 'http://placehold.it/100x80';
    this.props.addSlide(slide);
  }
  render() {
    const slides = this.props.slides.map((slide, i)=>{
      return (
        <div key={i}>
          <img className="img-responsive" src={slide.src} />
          { slide.titulo && <h3> {slide.titulo} </h3> }
          { slide.subtitulo && <h4> {slide.subtitulo} </h4> }
          { slide.descripcion && <p> {slide.descripcion} </p> }
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

export { Slider };
