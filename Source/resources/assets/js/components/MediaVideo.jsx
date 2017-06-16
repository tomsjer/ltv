import React from 'react';
import PropTypes from 'prop-types';

class MediaVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVideoURLError: false,
    };
  }
  render() {
    return (
      <div id="mediaVideo">
        <form onSubmit={ this.props.handleVideoSubmit }>
          <p><br/><small> Copia el enlace de YouTube aqui abajo.</small></p>
          <input required className="form-control" name="videoUrl" type="text" placeholder="Ej: https://www.youtube.com/watch?v=6vpOHq8bkzA"/>
          { this.state.showVideoURLError && <p className="error">Introduzca el enlace completo, ej.: https://www.youtube.com/watch?v=6vpOHq8bkzA</p> }
          <br />
          <button type="submit" className="btn pull-right"> Listo </button>
        </form>
      </div>
    );
  }
}

MediaVideo.propTypes = {
  handleVideoSubmit: PropTypes.func
};

export { MediaVideo };

