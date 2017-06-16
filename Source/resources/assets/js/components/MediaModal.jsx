/* globals Promise */
import React from 'react';
import PropTypes from 'prop-types';
import { MediaImagen } from './MediaImage.jsx';
import { MediaVideo } from './MediaVideo.jsx';
import { submit } from '../utils.js';
import { youtubeUrlParser } from '../utils.js';

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
    this.handleVideoSubmit = this.handleVideoSubmit.bind(this);
    this.handleImageSubmit = this.handleImageSubmit.bind(this);
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
  handleImageSubmit(e) {
    e.preventDefault();
    const file = e.target.querySelector('input[name="imageFile"]').files[0];
    const name = e.target.querySelector('input[name="name"]').value;
    const self = this;

    this.setState({
      disableSubmit: true,
      disableUpload: true
    });

    const submit = this.submitMedia({
      media_types_id: '1',
      image: file,
      options: JSON.stringify({
        name: name,
        src: file.name,
      })
    });

    submit.then((response)=>{
      console.log(response);
      self.closeModal();
    });

    return submit;
  }
  disableSubmit(state) {
    this.setState({
      disableSubmit: state
    });
  }
  handleVideoSubmit(e) {
    e.preventDefault();
    const self = this;
    const videoId = youtubeUrlParser(e.currentTarget.querySelector('[name="videoUrl"]').value);
    if (videoId) {
      this.setState({
        showVideoURLError: false,
        disableSubmit: true,
      });
      this.submitMedia({
        media_types_id: '2',
        options: JSON.stringify({
          id_youtube: videoId,
        })
      })
      .then(()=>{
        self.closeModal();
      });
    } else {
      this.setState({
        showVideoURLError: true,
        disableSubmit: false,
      });
    }
    return false;
  }
  onMediaChange(e) {
    this.setState({
      show: e.target.value
    });
  }
  closeModal() {
    this.props.closeModal();

    this.setState({
      show:'select',
      disableSubmit: true,
      disableUpload: false,
    });
  }
  submitMedia(data) {
    const promise = new Promise((resolve, reject)=> {

      const request = submit('POST', `${this.props.fullUrl}/api/media/store`, {
        overrideMimeType: 'text/plain; charset=x-user-defined-binary',
        progressHandler: this.uploadPercentage,
        uploadHandler: (e)=> {
          this.uploadCompleted(e);
          // resolve(e);
        },
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
  uploadCompleted() {
    this.setState({
      uploadCompleted: true,
      uploadPercentage: -1
    });
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

            <select className="form-control"  onChange={ this.onMediaChange }>
              <option value="select">Seleccionar tipo</option>
              <option value="imagen"> Imagen </option>
              <option value="video"> Video </option>
            </select>

            { this.state.show === 'imagen' && <MediaImagen isVisible={this.props.isVisible} handleImageSubmit={this.handleImageSubmit} disableSubmit={ this.disableSubmit } uploadPercentage={ this.state.uploadPercentage}/> }
            { this.state.show === 'video' && <MediaVideo handleVideoSubmit={this.handleVideoSubmit}/> }

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
