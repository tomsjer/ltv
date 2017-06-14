import React from 'react';
import PropTypes from 'prop-types';
import { SlideForm } from './SlideForm.jsx';
import { Slider } from './Slider.jsx';

class Slideshow extends React.Component {
  constructor(props) {
    super(props);
    this.blankSlide = {
        titulo: '',
        subtitulo: '',
        descripcion: '',
        src: 'http://placehold.it/600x400',
        srcThumbnail: 'http://placehold.it/100x80'
    };
    this.state = {
      activeSlide: 0,
      slides: [
        Object.assign({}, this.blankSlide)
      ]
    };

    this.addSlide = this.addSlide.bind(this);
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
    console.log(slides);
    slides.push(slide);
    this.setState({
      slides: slides
    });
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
                    <Slider slides={ this.state.slides } afterChangeHook={ this.setActiveSlide } addSlide={ this.addSlide }/>
                    <button type="button" onClick={ this.addBlankSlide } >Agregar slide</button>
                  </div>
                  <SlideForm index={this.state.activeSlide} slide={ this.state.slides[this.state.activeSlide] } handleChange={ this.handleSlideFormChange }/>
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
<div className="row">
  <Slide slide={ this.state.slides[this.state.activeSlide] } />
</div>
<div id="slideScroller"  className="row">
  <div className="arrow left"><p>&lt;</p></div>
  <ul className="slidesThumbnails">
      { slidesThumbnails }
      <li className="dorpzone" />
  </ul>
  <div className="arrow right"><p>&gt;</p></div>
</div>
 */

Slideshow.propTypes = {
  slides: PropTypes.array,
  handleChange: PropTypes.func
};

export { Slideshow };
