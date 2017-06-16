import React from 'react';
import PropTypes from 'prop-types';

class MediaImagen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imgPreviewSrc: false,
      imgName: '',
    };

    this.imgNameChange = this.imgNameChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }
  componentDidMount() {
    document.querySelector('#fileMentira').addEventListener('click', this.clickImageFile);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible !== this.props.isVisible && !nextProps.isVisible) {
      this.setState({
        imgPreviewSrc: false,
        imgName: '',
      });
    }
  }
  componentWillUnmount() {
    document.querySelector('#fileMentira').removeEventListener('click', this.clickImageFile);
  }
  clickImageFile() {
    document.querySelector('input[name="imageFile"]').click();
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
        imgPreviewSrc: evt.target.result
      });
      self.props.disableSubmit(false);
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
  imgNameChange(e) {
    this.setState({
      imgName: e.target.value
    });
  }
  render() {
    return (
      <div id="mediaImagen">
        <form onSubmit={ this.props.handleImageSubmit }>

          <label htmlFor="name"> Nombre: <input type="text" placeholder="" name="name" className="form-control" value={this.state.imgName} onChange={ this.imgNameChange } /></label>
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
    );
  }
}

MediaImagen.propTypes = {
  isVisible: PropTypes.bool,
  handleImageSubmit: PropTypes.func,
  uploadPercentage: PropTypes.number
};

export { MediaImagen };

