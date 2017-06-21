/* globals Promise */
import React from 'react';
import PropTypes from 'prop-types';
import { SlideForm } from './SlideForm.jsx';
import { Slider } from './Slider.jsx';
import { Dropzone } from  './Dropzone';
import { ajax } from '../utils';

class Slideshow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
      slides: []
    };

    this.saveSlider = this.saveSlider.bind(this);
    this.addSlide = this.addSlide.bind(this);
    this.removeSlide = this.removeSlide.bind(this);
    this.setActiveSlide = this.setActiveSlide.bind(this);
    this.handleSlideFormChange = this.handleSlideFormChange.bind(this);
    this.getSlides = this.getSlides.bind(this);

    this.getSlides()
    .then((_response)=>{
      const slides = (_response && _response !== '' && _response.indexOf('[{') !== -1) ? JSON.parse(_response) : [];
      slides.map((slide)=>{
        slide.media.options = JSON.parse(slide.media.options);
        slide.media_types_id = slide.media.media_types_id;
        slide.src = (slide.media_types_id === 2) ? `https://i.ytimg.com/vi/${slide.media.options.id_youtube}/sddefault.jpg`  : slide.media.options.src;
        slide.srcThumbnail = (slide.media_types_id === 2) ? `https://i.ytimg.com/vi/${slide.media.options.id_youtube}/default.jpg` : slide.media.options.srcThumbnail;
      });
      this.setState({
        slides: slides
      });
    });
  }
  getSlides() {
    const promise = new Promise((resolve, reject)=> {

      const request = ajax('GET', `${this.props.fullUrl}/api/sliders/all`, {

        progressHandler: (e) => {
          console.log(e);
        },
        onreadyStateChange: (e)=> {
          if (e.target.readyState === 4 && e.target.status === 200) {
            resolve(e.target.response);
          } else {
            console.log(`Error: ${e}`);
          }
        },
        errorHandler: (err)=>{
          console.log(err);
        }
      });
      request.send();
    });

    return promise;
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
    slides.push(slide);
    this.setState({
      slides: slides
    });
  }
  saveSlider(ev) {
    ev.preventDefault();

    const slides = this.state.slides;
    slides.map((slide)=>{
      delete slide.src;
      delete slide.srcThumbnail;
      delete slide.media_types_id;
      if (slide.willDelete) {
        if (typeof slide.id === 'undefined') {
          return null;
        }
      }
      return slide;
    });

    const request = ajax('POST', `${this.props.fullUrl}/api/sliders`, {
      progressHandler: (e)=>{ console.log(e); },
      onreadyStateChange: (e)=>{
        if (e.target.readyState === 4 && e.target.status === 200) {
        } else {
          console.log(`Error: ${e}`);
        }
      },
      errorHandler: (e)=>{ console.log(e); },
    });
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(slides));

    return false;
  }
  removeSlide(index) {
    const slides = this.state.slides.slice(0);
    slides[index].willDelete = true;
    this.setState({
      slides: slides
    });
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
                  { this.state.slides.length ?
                    (
                      <div>
                        <div className="col-md-8">
                          <Slider slides={ this.state.slides } afterChangeHook={ this.setActiveSlide } removeSlide={this.removeSlide} />
                        </div>
                        <SlideForm saveSlider={this.saveSlider} index={this.state.activeSlide} slide={ this.state.slides[this.state.activeSlide] } handleChange={ this.handleSlideFormChange } maxOrder={this.state.slides.length}/>
                      </div>
                    ) :
                    ( <div className="slider-empty-placeholder">
                        <h1>Ups...</h1>
                        <h3> Parece que no ha creado ninguna diapositiva aun.</h3>
                        <p>Desplaze algun contendio de la biblioteca hasta esta zona para agrgar una diapositiva.</p>
                      </div>
                    )
                  }
                  <Dropzone addSlide={ this.addSlide }/>
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
  handleChange: PropTypes.func,
  fullUrl: PropTypes.string
};

export { Slideshow };
