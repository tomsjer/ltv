import React from 'react';
import PropTypes from 'prop-types';

class SlideForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.submitSlideshow = this.submitSlideshow.bind(this);
  }
  handleChange(e) {
    this.props.handleChange(this.props.index, e.target.name, e.target.value);
  }
  submitSlideshow(e) {
    e.preventDefault();
    this.props.saveSlider(e);
    return false;
  }
  render() {
    return !this.props.slide ? null : (
      <form action="return false;" method="POST" onSubmit={  this.submitSlideshow  }>
        <label htmlFor="title"> Título </label>
        <input onChange={ this.handleChange } className="form-control" placeholder="Titulo" type="text" value={ (this.props.slide.title) ? this.props.slide.title : '' } name="title" />
        <label htmlFor="subtitle"> Subtítulo </label>
        <input  onChange={ this.handleChange } className="form-control" placeholder="Subtitulo" type="text" value={ (this.props.slide.subtitle) ? this.props.slide.subtitle : '' } name="subtitle"/>
        <label htmlFor="description"> Intervalo </label>
        <textarea  onChange={ this.handleChange } className="form-control" placeholder="Descripcion" type="textarea" value={ (this.props.slide.description) ? this.props.slide.description : '' } rows="10" cols="20" name="description"/>
        { (this.props.slide.media_types_id === 1 || this.props.slide.media_types_id === 3) &&
          <label htmlFor="time_interval"> Intervalo
            <input required onChange={ this.handleChange } value={ this.props.slide.time_interval } name="time_interval" className="form-control" type="number" placeholder="Segundos" min="1"/>
          </label>
        }
        { this.props.slide.media_types_id === 2 &&
          <label htmlFor="video_loop"> Loops
            <input required onChange={ this.handleChange } value={ this.props.slide.video_loop } name="video_loop" className="form-control" type="number" placeholder="Loops" min="1"/>
          </label>
        }
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="desde"> Desde </label>
              <input required onChange={ this.handleChange } value={ this.props.slide.date_from } name="date_from" className="form-control" type="date" />
          </div>
          <div className="col-md-6">
            <label htmlFor="hasta"> Hasta </label>
              <input required onChange={ this.handleChange } value={ this.props.slide.date_until } name="date_until" className="form-control" type="date" />
          </div>
        </div>
        <br/>
        {/* <button className="form-control" type="submit"> GUARDAR </button> */ }
      </form>
    );
  }
}

SlideForm.propTypes =  {
  slide: PropTypes.object,
  handleChange: PropTypes.func,
  index: PropTypes.number,
  saveSlider: PropTypes.func
};

export { SlideForm };
