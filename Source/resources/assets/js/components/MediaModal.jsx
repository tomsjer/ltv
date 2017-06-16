import React from 'react';
import PropTypes from 'prop-types';
import { youtubeUrlParser } from '../utils.js';

class MediaModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'select',
      imgPreviewSrc: false,
      imgName: '',
      disableSubmit: true,
      disableUpload: false,
      showVideoURLError: false,
    };
    this.onMediaChange = this.onMediaChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.closeModal = this.closeModal.bind(this);
    // this.handleVideoUrl = this.handleVideoUrl.bind(this);
    this.handleImageSubmit = this.handleImageSubmit.bind(this);
  }
  componentDidMount() {
    document.querySelector('#mediaModal').addEventListener('click', this.closeModal);
    document.querySelector('#fileMentira').addEventListener('click', ()=>{
      document.querySelector('input[name="imageFile"]').click();
    });
  }
  componentWillUnmount() {
    document.querySelector('#mediaModal').removeEventListener('click', this.closeModal);
  }
  submitImage(file) {

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
    this.props.submitMedia({
      media_types_id: '1',
      image: file,
      options: JSON.stringify({
        name: name,
        src: file.name,
      })
    })
    .then((response)=>{
      setTimeout(()=>{
        console.log(response);
        self.closeModal();
      }, 2000);
    })
    .catch(()=>{

    });
  }
  handleFiles(e) {
    const file = e.target.files[0];
    const imageType = /^image\//;

    if (!file || !imageType.test(file.type)) {
      return;
    }

    const self = this;
    const reader = new FileReader();
    reader.onload = function readerOnload(evt) {
      self.setState({
        imgPreviewSrc: evt.target.result,
        disableSubmit: false,
      });
    };
    reader.readAsDataURL(file);
  }
  handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;

    this.handleFiles({target: { files: files}});
  }
  handleVideoSubmit(e) {
    e.preventDefault();
    const videoId = youtubeUrlParser(e.target.value);
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
      })
      .then(()=>{
        setTimeout(()=>{
          self.closeModal();

        }, 2000);
      })
      .catch(()=>{

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
      imgPreviewSrc: false,
        disableSubmit: true,
        disableUpload: false,
        imgName: '',
      });
  }
  render() {
    return (
      <div className={ (this.props.isVisible) ? '' : 'hidden'}>
        <div id="mediaModal"/>
        <div id="modalDialog">
          <div id="modalHeader"> Subir Media <a href="#" onClick={ this.closeModal }>&times;</a></div>
          <div id="modalBody">

            <select className="form-control"  onChange={ this.onMediaChange }>
              <option value="select">Seleccionar tipo</option>
              <option value="imagen"> Imagen </option>
              <option value="video"> Video </option>
            </select>

            {/* TODO: Componentizar */}
            <div id="mediaImagen" className={ (this.state.show === 'imagen') ? '' : 'hidden' }>
              <form onSubmit={ this.handleImageSubmit }>

                <label htmlFor="name"> Nombre: <input type="text" placeholder="" name="name" className="form-control"/></label>
                <div id="modalDropZone" className={ (!this.state.imgPreviewSrc) ? '' : 'active'}
                  onDrop={ this.handleDrop }
                  onDragEnter={ (e)=>{ e.stopPropagation(); e.preventDefault(); }}
                  onDragOver={ (e)=>{ e.stopPropagation(); e.preventDefault(); }}
                >
                  <p className={ (!this.state.imgPreviewSrc) ? 'placeholder' : 'hidden'}> Arrastra las fotos aqui...</p>
                  <div className={ (this.props.uploadPercentage === -1) ? 'hidden percentage' : 'percentage'} >
                    <p>{this.props.uploadPercentage} %</p>
                  </div>
                  <div className={ (this.state.imgPreviewSrc) ? 'img-container' : 'img-container hidden'}>
                    <img src={this.state.imgPreviewSrc} className="img-responsive"/>
                  </div>
                </div>
                <p> O buscar en carpeta...</p>

                <input required className="form-control" name="imageFile" type="file" style={{display: 'none'}} onChange={ this.handleFiles } />
                <button id="fileMentira" type="button" className="btn" disabled={ this.state.disableUpload }> Buscar... </button>
                <br />
                <button type="submit" className="btn pull-right" disabled={this.state.disableSubmit}> Listo </button>
              </form>
            </div>

            {/* TODO: Componentizar */}
            <div id="mediaVideo"  className={ (this.state.show === 'video') ? '' : 'hidden' }>
              <form onSubmit={ this.handleVideoSubmit }>
                <p><br/><small> Copia el enlace de YouTube aqui abajo.</small></p>
                <input required className="form-control" name="videoUrl" type="text" placeholder="Ej: https://www.youtube.com/watch?v=6vpOHq8bkzA"/>
                { this.state.showVideoURLError && <p className="error">Introduzca el enlace completo, ej.: https://www.youtube.com/watch?v=6vpOHq8bkzA</p> }
                <br />
                <button type="submit" className="btn pull-right"> Listo </button>
              </form>
            </div>

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
