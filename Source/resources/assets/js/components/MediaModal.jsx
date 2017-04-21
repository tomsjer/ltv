import React from 'react';
import PropTypes from 'prop-types';

class MediaModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'select',
      imgPreviewSrc: false
    };
    this.onMediaChange = this.onMediaChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleVideoUrl = this.handleVideoUrl.bind(this);
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
  handleVideoSubmit(e) {
    e.preventDefault();
    console.log(e);
    return false;
  }
  submitImage(file) {

  }
  handleImageSubmit(e) {
    e.preventDefault();
    const file = e.target.querySelector('input[name="imageFile"]').files[0];
    const name = 'test'; // e.target.querySelectir('input[name="name"]').value;
    this.props.submitMedia({
      media_types_id: '1',
      image: file,
      options: JSON.stringify({
        name: name,
        src: file.name,
      })
    });
  }
  handleFiles(e) {
    const file = e.target.files[0];
    const imageType = /^image\//;

    if (!imageType.test(file.type)) {
      return;
    }

    const self = this;
    const reader = new FileReader();
    reader.onload = function readerOnload(evt) {
      self.setState({ imgPreviewSrc: evt.target.result });
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
  handleVideoUrl(e) {
    console.log(e.target);
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

            <div id="mediaImagen" className={ (this.state.show === 'imagen') ? '' : 'hidden' }>
              <form onSubmit={ this.handleImageSubmit }>

                <div id="modalDropZone" className={ (!this.state.imgPreviewSrc) ? '' : 'active'}
                  onDrop={ this.handleDrop }
                  onDragEnter={ (e)=>{ e.stopPropagation(); e.preventDefault(); }}
                  onDragOver={ (e)=>{ e.stopPropagation(); e.preventDefault(); }}
                >
                  <p className={ (!this.state.imgPreviewSrc) ? '' : 'hidden'}> Arrastra las fotos aqui...</p>
                  <div className={ (this.state.imgPreviewSrc) ? '' : 'hidden'}>
                    <img src={this.state.imgPreviewSrc} className="img-responsive"/>
                  </div>
                </div>
                <p> O buscar en carpeta...</p>
                <p>{this.props.uploadPercentage} %</p>
                <input required className="form-control" name="imageFile" type="file" style={{display: 'none'}} onChange={ this.handleFiles } />
                <button id="fileMentira" type="button" className="btn"> Buscar... </button>
                <br />
                <button type="submit" className="btn pull-right"> Listo </button>
              </form>
            </div>

            <div id="mediaVideo"  className={ (this.state.show === 'video') ? '' : 'hidden' }>
              <form onSubmit={ this.handleVideoSubmit }>
                <p><br/><small> Copia el enlace de YouTube aqui abajo.</small></p>
                <input required className="form-control" name="videoUrl" type="text" placeholder="Ej: https://www.youtube.com/watch?v=6vpOHq8bkzA"
                  onChange={ this.handleVideoUrl }/>
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
