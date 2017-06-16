import React from 'react';
import PropTypes from 'prop-types';
import { youtubeUrlParser } from '../utils.js';

class MediaVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVideoURLError: false,
      disableSubmit: true,
      videoName: '',
      videoUrl: ''
    };
    this.handleVideoSubmit = this.handleVideoSubmit.bind(this);
    this.videoNameChange = this.videoNameChange.bind(this);
    this.videoUrlChange = this.videoUrlChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible !== this.props.isVisible && !nextProps.isVisible) {
      this.setState({
        videoName: '',
        videoUrl: ''
      });
    }
  }
  videoNameChange(e) {
    this.setState({
      videoName: e.target.value
    });
  }
  videoUrlChange(e) {
    this.setState({
      videoUrl: e.target.value,
      disableSubmit: false
    });
  }
  handleVideoSubmit(e) {
    e.preventDefault();
    const self = this;
    const videoId = youtubeUrlParser(e.currentTarget.querySelector('[name="videoUrl"]').value);
    const name = e.currentTarget.querySelector('[name="name"]').value;
    if (videoId) {
      this.setState({
        showVideoURLError: false,
        disableSubmit: true,
      });
      this.props.submitMedia({
        media_types_id: '2',
        options: JSON.stringify({
          name: name,
          id_youtube: videoId,
        })
      });
    } else {
      this.setState({
        showVideoURLError: true,
        disableSubmit: false,
      });
    }
    return false;
  }
  render() {
    return (
      <div id="mediaVideo">
        <form onSubmit={ this.handleVideoSubmit }>
        <label htmlFor="name"> Nombre: <input type="text" placeholder="" name="name" className="form-control" value={this.state.videoName} onChange={ this.videoNameChange } /></label>
          <p><br/><small> Copia el enlace de YouTube aqui abajo.</small></p>
          <input required className="form-control" name="videoUrl" type="text"  onChange={ this.videoUrlChange } placeholder="Ej: https://www.youtube.com/watch?v=6vpOHq8bkzA"/>
          { this.state.showVideoURLError && <p className="error">Introduzca el enlace completo, ej.: https://www.youtube.com/watch?v=6vpOHq8bkzA</p> }
          <br />
          <button type="submit" className="btn pull-right" disabled={this.state.disableSubmit}> Listo </button>
        </form>
      </div>
    );
  }
}

MediaVideo.propTypes = {
  handleVideoSubmit: PropTypes.func,
  isVisible: PropTypes.bool,
  disableSubmit: PropTypes.func,
  disabled: PropTypes.bool
};

export { MediaVideo };

