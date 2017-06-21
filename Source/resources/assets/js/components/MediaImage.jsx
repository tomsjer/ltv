import React from 'react';
import PropTypes from 'prop-types';

class MediaImagen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imgPreviewSrc: false,
      imgName: '',
      disableSubmit: true,
      disableUpload: false
    };

    this.imgNameChange = this.imgNameChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleImageSubmit = this.handleImageSubmit.bind(this);
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
    const imageSize = 12*1000000; //edit number for MB

    if (!file || (!imageType.test(file.type) || file.size > imageSize)) {
      return;
    }

    const self = this;
    const reader = new FileReader();
    reader.onload = function readerOnload(evt) {
      self.setState({
        imgPreviewSrc: evt.target.result,
        disableSubmit: false
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
  handleImageSubmit(e) {
    e.preventDefault();
    const file = e.target.querySelector('input[name="imageFile"]').files[0];
    const name = e.target.querySelector('input[name="name"]').value

    this.setState({
      disableSubmit: true,
      disableUpload: true
    });

    const submit = this.props.submitMedia({
      media_types_id: '1',
      image: file,
      options: JSON.stringify({
        name: name,
        src: file.name,
      })
    });

    return submit;
  }
  imgNameChange(e) {
    this.setState({
      imgName: e.target.value
    });
  }
  render() {
    return (
      <div id="mediaImagen">
        <form onSubmit={ this.handleImageSubmit }>

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

          <input required className="form-control" name="imageFile" type="file" style={{display: 'none'}} onChange={ this.handleFiles } disabled={this.state.disableUpload} accept="image/*" />
          <button id="fileMentira" type="button" className="btn"> Buscar... </button>
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
  uploadPercentage: PropTypes.number,
  disableSubmit: PropTypes.func,
  disabled: PropTypes.bool
};

export { MediaImagen };

