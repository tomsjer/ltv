/* globals Promise */
import React from 'react';
import PropTypes from 'prop-types';
import { MediaImagen } from './MediaImage.jsx';
import { MediaVideo } from './MediaVideo.jsx';
import { submit } from '../utils.js';

class MediaModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'select',
      disableSubmit: true,
      disableUpload: false,
      uploadPercentage: -1,
    };

    this.onMediaChange = this.onMediaChange.bind(this);
    this.disableSubmit = this.disableSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitMedia = this.submitMedia.bind(this);
    this.uploadPercentage = this.uploadPercentage.bind(this);
    this.uploadCompleted = this.uploadCompleted.bind(this);
  }
  componentDidMount() {
    document.querySelector('#mediaModal').addEventListener('click', this.closeModal);
  }
  componentWillUnmount() {
    document.querySelector('#mediaModal').removeEventListener('click', this.closeModal);
  }
  disableSubmit(state) {
    this.setState({
      disableSubmit: state
    });
  }
  onMediaChange(e) {
    this.setState({
      show: e.target.value
    });
  }
  closeModal() {
    this.props.closeModal();
    this.setState({
      show: 'select',
      disableSubmit: true,
      disableUpload: false,
    });
  }
  submitMedia(data) {
    const promise = new Promise((resolve, reject)=> {

      const request = submit('POST', `${this.props.fullUrl}/api/media/store`, {
        overrideMimeType: 'text/plain; charset=x-user-defined-binary',
        progressHandler: this.uploadPercentage,
        onreadyStateChange: (e)=>{
          if (e.target.readyState === 4 && e.target.status === 200) {
            this.uploadCompleted(e);
            resolve(e);
          } else {
            console.log(`Error: ${e}`);
          }
        },
        errorHandler: this.errorHandler
      });

      const fd = new FormData();
      for (const i in data) {
        fd.append(i, data[i]);
      }
      request.send(fd);
    });

    return promise;
  }
  errorHandler(e) {
    // TODO: Handle error in AJAX requests
    console.log(e);
  }
  uploadCompleted(e) {
    this.setState({
      uploadCompleted: true,
      uploadPercentage: -1
    });
    this.closeModal();
    const response = JSON.parse(e.target.response);
    const media = response.media;
    media.options = JSON.parse(media.options);
    if (media.media_types_id === '2') {
      media.options.srcThumbnail = `https://i.ytimg.com/vi/${media.options.id_youtube}/default.jpg`;
      media.options.src = `https://i.ytimg.com/vi/${media.options.id_youtube}/sddefault.jpg`;
    }
    this.props.submitSuccess(media);
  }
  uploadPercentage(e) {
    if (e.lengthComputable) {
      const percentage = Math.round((e.loaded * 100) / e.total);
      this.setState({
        uploadPercentage: percentage
      });
    }
  }
  render() {
    return (
      <div className={ (this.props.isVisible) ? 'mediaModal-container' : 'mediaModal-container hidden'}>
        <div id="mediaModal"/>
        <div id="modalDialog">
          <div id="modalHeader"> Subir Media <a href="#" onClick={ this.closeModal }>&times;</a></div>
          <div id="modalBody">

            <select className="form-control"  onChange={ this.onMediaChange } value={ this.state.show }>
              <option value="select">Seleccionar tipo</option>
              <option value="imagen"> Imagen </option>
              <option value="video"> Video </option>
            </select>

            { this.state.show === 'imagen' && <MediaImagen isVisible={this.props.isVisible} submitMedia={this.submitMedia } uploadPercentage={ this.state.uploadPercentage}/> }
            { this.state.show === 'video' && <MediaVideo isVisible={this.props.isVisible} submitMedia={this.submitMedia} /> }

          </div>
        </div>
      </div>
    );
  }
}

MediaModal.propTypes = {
  closeModal: PropTypes.func,
  isVisible: PropTypes.bool,
  submitMedia: PropTypes.func,
  uploadPercentage: PropTypes.number
};

export { MediaModal };
