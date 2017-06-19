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
      intervalo: '',
      loop: 0,
      desde: '',
      hasta: '',
      media_id: element.id,
      media_types_id: element.media_types_id
    };

    this.props.addSlide(slide);
  }
  render() {
    return ( < div className = "dropzone-container" >
      < div className = "dropzone"
      onDrop = { this.dropHandler }
      onDragOver = { this.dragoverHandler } >
        <h3> Arrastre contenido aquí... </h3>
      < /div> < /div >
    );
  }
}

Dropzone.propTypes = {
  addSlide: PropTypes.func,
};
export { Dropzone };
