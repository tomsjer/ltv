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
  }
  componentDidMount() {
    document.querySelector('#mediaModal').addEventListener('click', this.props.toggleModal);
    document.querySelector('#fileMentira').addEventListener('click', ()=>{
      document.querySelector('input[name="videoUrl"]').click();
    });
  }
  componentWillUnmount() {
    document.querySelector('#mediaModal').removeEventListener('click', this.props.toggleModal);
  }
  handleVideoSubmit(e) {
    e.preventDefault();
    console.log(e);
    return false;
  }
  handleImageSubmit(e) {
    e.preventDefault();
    console.log(e);
    return false;
  }
  handleFiles(e) {
    const file = e.target.files[0];
    const imageType = /^image\//;

    if (!imageType.test(file.type)) {
      return;
    }

    const self = this;
    const reader = new FileReader();
    reader.onload = function (e) {
      self.setState({ imgPreviewSrc: e.target.result });
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
  onMediaChange(e) {
    this.setState({
      show: e.target.value
    });
  }
  render() {
    return (
      <div className={ (this.props.isVisible) ? '' : 'hidden'}>
        <div id="mediaModal"/>
        <div id="modalDialog">
          <div id="modalHeader"> Subir Media <a href="#" onClick={ this.props.toggleModal }>&times;</a></div>
          <div id="modalBody">

            <select className="form-control"  onChange={ this.onMediaChange }>
              <option value="select">Seleccionar tipo</option>
              <option value="imagen"> Imagen </option>
              <option value="video"> Video </option>
            </select>

            <div id="mediaImagen" className={ (this.state.show === 'imagen') ? '' : 'hidden' }>
              <form onSubmit={ this.handleImageSubmit }>

                <div className={ (!this.state.imgPreviewSrc) ? '' : 'hidden'}>
                  <div id="modalDropZone" onDrop={ this.handleDrop }
                  onDragEnter={ (e)=>{ e.stopPropagation(); e.preventDefault(); }}
                  onDragOver={ (e)=>{ e.stopPropagation(); e.preventDefault(); }}>
                    <p> Arrastra las fotos aqui...</p>
                  </div>
                  <p> O buscar en carpeta...</p>
                </div>
                <div className={ (this.state.imgPreviewSrc) ? '' : 'hidden'}>
                  <img src={this.state.imgPreviewSrc} className="img-responsive"/>
                </div>
                <input required className="form-control" name="videoUrl" type="file" style={{display: 'none'}} onChange={ this.handleFiles } />
                <button id="fileMentira" type="button" className="btn"> Buscar... </button>
                <br />
                <button type="submit" className="btn pull-right"> Listo </button>
              </form>
            </div>

            <div id="mediaVideo"  className={ (this.state.show === 'video') ? '' : 'hidden' }>
              <form onSubmit={ this.handleVideoSubmit }>
                <p><br/><small> Copia el enlace de YouTube aqui abajo.</small></p>
                <input required className="form-control" name="videoUrl" type="text" placeholder="Ej: https://www.youtube.com/watch?v=6vpOHq8bkzA"/>
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
  toggleModal: PropTypes.func,
  isVisible: PropTypes.bool
};

export { MediaModal };
