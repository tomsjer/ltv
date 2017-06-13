import React from 'react';
import PropTypes from 'prop-types';

class SlideForm extends React.Component {
  render() {
    return (
      <div className="col-md-4 slide-form">
        <form action="return false;" method="POST">
          <input className="form-control" placeholder="Titulo" type="text" value={ this.props.slide.titulo } />
          <input className="form-control" placeholder="Subtitulo" type="text" value={ this.props.subtitulo } />
          <textarea className="form-control" placeholder="Descripcion" type="textarea" value={ this.props.descripcion } rows="10" cols="20"/>
          <label htmlFor="intervalo"> Intervalo
            <input name="intervalo" className="form-control" type="number" placeholder="Segundos" min="0"/>
          </label>
          <div className="row">
            <label htmlFor="desde"> Desde
              <input name="desde" className="form-control" type="date" />
            </label>
            <label htmlFor="hasta"> Hasta
              <input name="hasta" className="form-control" type="date" />
            </label>
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
  titulo: PropTypes.string,
  subtitulo: PropTypes.string,
  descripcion: PropTypes.string
};

export { SlideForm };
