import React from 'react';
import PropTypes from 'prop-types';

class Contenedor extends React.Component {
  renderMedia(element, i) {
    return (
      <div className="item" key={i}>
        <div className="img-container">
          <img src= { element.options.src } />
        </div>
        <ul>
          <li>{element.created_at.slice(0, 10)}</li>
        </ul>
      </div>
    );
  }
  render() {
    const media = [];
    this.props.media.forEach((element, i)=> {
      media.push(this.renderMedia(element, i));
    });
    return (
      <div id="contenedor" className={ this.props.layout}>
        { media }
      </div>
    );
  }
}

Contenedor.propTypes = {
  media: PropTypes.array,
  layout: PropTypes.string
};

export { Contenedor };
