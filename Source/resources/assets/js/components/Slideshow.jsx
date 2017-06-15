import React from 'react';
import PropTypes from 'prop-types';
import { SlideForm } from './SlideForm.jsx';
import { Slider } from './Slider.jsx';
import { Dropzone } from  './Dropzone';

class Slideshow extends React.Component {
  constructor(props) {
    super(props);
    this.blankSlide = {
        order: 1,
        titulo: '',
        subtitulo: '',
        descripcion: '',
        src: 'http://placehold.it/1200x400',
        srcThumbnail: 'http://placehold.it/100x80'
    };
    this.state = {
      activeSlide: 0,
      slides: [
        Object.assign({}, this.blankSlide)
      ]
    };

    this.addSlide = this.addSlide.bind(this);
    this.removeSlide = this.removeSlide.bind(this);
    this.addBlankSlide = this.addBlankSlide.bind(this);
    this.setActiveSlide = this.setActiveSlide.bind(this);
    this.handleSlideFormChange = this.handleSlideFormChange.bind(this);
  }
  handleSlideFormChange(slide, prop, value) {
    const slides = this.state.slides.slice(0);
    slides[slide][prop] = value;
    this.setState({
      slides: slides
    });
  }
  setActiveSlide(index) {
    this.setState({
      activeSlide: index
    });
  }
  addSlide(slide) {
    const slides = this.state.slides.slice(0);
    slide.order = slides.length + 1;
    slides.push(slide);
    this.setState({
      slides: slides
    });
  }

  removeSlide(index){
    let slides = this.state.slides;
    if(slides.length === 1){
        this.setState({
            slides: [
                Object.assign({}, this.blankSlide)
            ]
        });
    }else{
      let newSlides = [];
      slides.map(function(slide,slideIndex){
        if(slideIndex !== index){
          newSlides.push(slide);
        }
      });
        this.setState({
            slides: newSlides
        });
    }
  }
  addBlankSlide() {
    this.addSlide(Object.assign({}, this.blankSlide));
  }
  render() {
    // const slidesThumbnails = this.state.slides.map((slide, i)=>{
    //   return ( <li key={i} onClick={ this.setActiveSlide } data-index={i} className={ (i === this.state.activeSlide) ? 'active' : '' }><img src={slide.srcThumbnail}/></li> );
    // });

    return (
      <div className="slideShow-container col-xs-12">
        <div>
          <div className="tab-content">
            <div role="tabpanel" className="tab-pane active" id="slide">
              <div id="slideContainer">
                <div id="activeSlide" className="row">
                  <div className="col-md-8">
                    <Slider slides={ this.state.slides } afterChangeHook={ this.setActiveSlide } removeSlide={this.removeSlide} />
                    <Dropzone addNewSlide={this.addBlankSlide} addSlide={ this.addSlide }/>
                  </div>
                  <SlideForm index={this.state.activeSlide} slide={ this.state.slides[this.state.activeSlide] } handleChange={ this.handleSlideFormChange } maxOrder={this.state.slides.length}/>
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

/*
Porahor no vamos a utilizar los cumpleaños...

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
 */

Slideshow.propTypes = {
  slides: PropTypes.array,
  handleChange: PropTypes.func
};

export { Slideshow };
