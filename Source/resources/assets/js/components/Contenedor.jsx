import React from 'react';
import PropTypes from 'prop-types';

class Contenedor extends React.Component {
  gridLayout(element, i) {
    return <img key={i} src= { element.src } />;
  }
  listLayout(element, i) {
    return <li key={i}><img src={element.src} /></li>;
  }
  render() {
    const media = [];
    this.props.media.forEach((element, i)=> {
      media.push(this[this.props.layout + 'Layout'](element, i));
    });
    return (
      <div id="contenedor">
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
