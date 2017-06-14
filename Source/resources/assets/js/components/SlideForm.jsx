import React from 'react';
import PropTypes from 'prop-types';

class SlideForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.handleChange(this.props.index, e.target.name, e.target.value);
  }
  render() {
    return (
      <div className="col-md-4 slide-form">
        <form action="return false;" method="POST">
          <input onChange={ this.handleChange } className="form-control" placeholder="Titulo" type="text" value={this.props.slide.titulo} name="titulo" />
          <input  onChange={ this.handleChange } className="form-control" placeholder="Subtitulo" type="text" value={ this.props.slide.subtitulo} name="subtitulo"/>
          <textarea  onChange={ this.handleChange } className="form-control" placeholder="Descripcion" type="textarea" value={ this.props.slide.descripcion} rows="10" cols="20" name="descripcion"/>
          <label htmlFor="intervalo"> Intervalo</label>
            <input onChange={ this.handleChange } name="intervalo" className="form-control" type="number" placeholder="Segundos" min="0"/>
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="desde"> Desde </label>
                <input onChange={ this.handleChange } name="desde" className="form-control" type="date" />
            </div>
            <div className="col-md-6">
              <label htmlFor="hasta"> Hasta </label>
                <input onChange={ this.handleChange } name="hasta" className="form-control" type="date" />
            </div>
          </div>
        </form>
        <p>Metadata</p>
        <p>Fecha de creacion ........ 17/04/2017<br/>
          Peso ..................... 2.5MB<br/>
          Ubicacion .............../opt/images/lorealtv/01.jpg</p>
      </div>
    );
  }
}

SlideForm.propTypes =  {
  slide: PropTypes.object,
  handleChange: PropTypes.func,
  index: PropTypes.number
};

export { SlideForm };
