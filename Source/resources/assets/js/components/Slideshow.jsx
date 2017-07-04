/* globals Promise */
import React from 'react';
import PropTypes from 'prop-types';
import { SlideForm } from './SlideForm.jsx';
import { Slider } from './Slider.jsx';
import { Dropzone } from  './Dropzone';
import { ajax } from '../utils';
import { initYoutubeIframeAPI } from '../initYoutube';

class Slideshow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
      slides: [],
      loading: true,
      playback: false,
      saving: false,
      showSuccess: false,
      showError: false
    };

    this.saveSlider = this.saveSlider.bind(this);
    this.addSlide = this.addSlide.bind(this);
    this.removeSlide = this.removeSlide.bind(this);
    this.reenableSlide = this.reenableSlide.bind(this);
    this.setActiveSlide = this.setActiveSlide.bind(this);
    this.handleSlideFormChange = this.handleSlideFormChange.bind(this);
    this.getSlides = this.getSlides.bind(this);
    this.playSlideshow = this.playSlideshow.bind(this);
    this.pauseSlideshow = this.pauseSlideshow.bind(this);
    this.allSlidesValid = this.allSlidesValid.bind(this);
    this.hasExpired = this.hasExpired.bind(this);

    this.getSlides()
    .then((_response)=>{
      const slides = (_response && _response !== '' && _response.indexOf('[{') !== -1) ? JSON.parse(_response) : [];
      slides.map((slide)=>{
        slide.media.options = JSON.parse(slide.media.options);
        slide.media_types_id = slide.media.media_types_id;
        slide.media.options.srcThumbnail = (slide.media_types_id === 2) ? `https://i.ytimg.com/vi/${slide.media.options.id_youtube}/default.jpg` : slide.media.options.srcThumbnail;
      });
      this.setState({
        slides: slides
      });
      initYoutubeIframeAPI()
      .then(()=>{
        this.setState({
          loading: false
        });
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
  saveSlider() {
    let slides = this.state.slides.slice(0);
    slides.map((slide)=>{
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
        if (e.target.readyState === 4) {
          if (e.target.status === 200) {
            this.setState({
              saving: false,
              showSuccess: true
            });
            setTimeout(()=>{
              window.location.reload(true);
            }, 5000);
          } else {
            this.setState({
              showError: true
            });
          }
        }
      },
      errorHandler: (e)=>{ console.log(e); },
    });
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(slides));
    this.setState({
      saving: true
    });
    return true;
  }
  removeSlide(index) {
    const slides = this.state.slides.slice(0);
    if (typeof slides[index].id === 'undefined') {
      slides.splice(index, 1);
    } else {
      slides[index].willDelete = true;
    }

    this.setState({
      slides: slides
    });
  }
  reenableSlide(index) {
    const slides = this.state.slides.slice(0);
    delete slides[index].willDelete;
    this.setState({
      slides: slides
    });
  }
  playSlideshow() {
    this.setState({
      playback: true
    });
  }
  pauseSlideshow() {
    this.setState({
      playback: false
    });
  }
  allSlidesValid() {
    const isValid = this.state.slides.some(slide => typeof slide.willDelete === 'undefined');
    return isValid;
  }
  hasExpired(slide) {
    // const df = Date.parse(slide.date_from + 'T00:00:00');
    const du = Date.parse(slide.date_until + 'T24:00:00');
    const now = Date.now();
    // return !(df <= now && du >= now);
    return now > du;
  }
  render() {
    let sliderContainer;

    if (this.state.loading) {
      sliderContainer = (<div><h4 className="loading">Cargando <span /></h4></div>);
    } else if (this.state.slides.length) {
      sliderContainer = (
        <div>
          <div className="col-md-8 col-lg-9">
            <Slider slides={ this.state.slides } afterChangeHook={ this.setActiveSlide } removeSlide={this.removeSlide} reenableSlide={ this.reenableSlide } playback={ this.state.playback } activeSlide={ this.state.activeSlide } hasExpired={ this.hasExpired }/>
          </div>
          <div className="col-md-4 col-lg-3 slide-form">
            <SlideForm saveSlider={this.saveSlider} index={this.state.activeSlide} slide={ this.state.slides[this.state.activeSlide] } handleChange={ this.handleSlideFormChange } maxOrder={this.state.slides.length}  hasExpired={ this.hasExpired }/>
          </div>
        </div>
      );
    } else {
      sliderContainer = ( <div className="slider-empty-placeholder">
          <h1>Ups...</h1>
          <h3> Parece que no ha creado ninguna diapositiva aun.</h3>
          <p>Desplaze algun contendio de la biblioteca hasta esta zona para agrgar una diapositiva.</p>
        </div>
      );
    }

    return (
      <div className="slideShow-container col-xs-12">
        <div>
          <div className="tab-content">
            <div role="tabpanel" className="tab-pane active" id="slide">
              <div id="slideContainer">
                <div id="activeSlide" className="row">
                  { sliderContainer }
                  <div className="btn-group" role="group" aria-label="...">
                    { this.state.slides.length === 0 ? null : ( <button type="button" className={ !this.state.playback ? 'btn btn-default' : 'btn btn-default disabled btn-danger'} onClick={ this.playSlideshow }><span className="glyphicon glyphicon-play"/></button>)}
                    { this.state.slides.length === 0 ? null : ( <button type="button" className={ this.state.playback ? 'btn btn-default' : 'btn btn-default disabled'} onClick={ this.pauseSlideshow }><span className="glyphicon glyphicon-pause"/></button>)}
                    <button className="btn btn-success" type="button" onClick={ this.saveSlider }> GUARDAR </button>
                  </div>
                  { (this.state.saving || this.state.showSuccess || this.state.showError)  && <div className="backdrop" /> }
                  { this.state.saving && <div className="alert alert-warning" role="alert"><p><strong>Guardando...</strong></p></div> }
                  { this.state.showSuccess && <div className="alert alert-success" role="alert"><p><b>¡Se guardo correctamente!</b> La página se recargará para mantenerse actualizada.</p></div>}
                  { this.state.showError && <div className="alert alert-danger" role="alert"><p><b>¡Ocurrió un error!</b> Recargue la página e intente nuevamente.</p></div>}
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

Slideshow.propTypes = {
  slides: PropTypes.array,
  handleChange: PropTypes.func,
  fullUrl: PropTypes.string
};

export { Slideshow };
