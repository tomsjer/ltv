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
        const slide = JSON.parse(ev.dataTransfer.getData('text'));
        slide.srcThumbnail = slide.src;
        this.props.addSlide(slide);
    }
    render() {
        return (
            <div className="dropzone-container">
                <div className="dropzone" onDrop={ this.dropHandler } onDragOver={ this.dragoverHandler} onClick={this.props.addNewSlide}>
                    Arrastre una imagen o haga click para agregar un nuevo slide
                </div>
            </div>
        );
    }
}

Dropzone.propTypes =  {
    addNewSlide: PropTypes.func,
    addSlide: PropTypes.func,
};
export { Dropzone };
