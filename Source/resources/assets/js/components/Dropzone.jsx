import React from 'react';
import PropTypes from 'prop-types';

class Dropzone extends React.Component {
  constructor(props) {
    super(props);
    this.dropHandler = this.dropHandler.bind(this);
    this.dragoverHandler = this.dragoverHandler.bind(this);
  }
  dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
  }
  dropHandler(ev) {
    ev.preventDefault();
    const element = JSON.parse(ev.dataTransfer.getData('text'));
    const slide = {
      titulo: element.options.name || '',
      subtitulo: '',
      descripcion: '',
      src: element.options.src,
      srcThumbnail: element.options.srcThumbnail,
      tipo: element.media_types_id,
      intervalo: '',
      loop: 0,
      desde: '',
      hasta: '',
      media_id: 0
    };

    this.props.addSlide(slide);
  }
  render() {
    return ( < div className = "dropzone-container" >
      < div className = "dropzone"
      onDrop = { this.dropHandler }
      onDragOver = { this.dragoverHandler }
      onClick = { this.props.addNewSlide } >
      Arrastre una imagen o haga click para agregar un nuevo slide < /div> < /div >
    );
  }
}

Dropzone.propTypes = {
  addNewSlide: PropTypes.func,
  addSlide: PropTypes.func,
};
export { Dropzone };
