import React from 'react';
import PropTypes from 'prop-types';
import { setDefaultDate } from '../utils';

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
    document.querySelector('.dropzone-container').classList.remove('active');
    const element = JSON.parse(ev.dataTransfer.getData('text'));
    const slide = {
      title: '',
      subtitle: '',
      description: '',
      media: element,
      time_interval: 5,
      video_loop: 1,
      date_from: setDefaultDate(),
      date_until: setDefaultDate(),
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
