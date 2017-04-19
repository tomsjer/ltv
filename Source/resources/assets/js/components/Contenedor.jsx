import React from 'react';
import PropTypes from 'prop-types';

class Contenedor extends React.Component {
  render() {
    const media = [];
    this.props.media.forEach((element, i)=> {
      media.push(<img key={i} src= { element.src } />);
    });
    return (
      <div>
        <ul>
          { media }
        </ul>
      </div>
    );
  }
}

Contenedor.propTypes = {
  media: PropTypes.array
};

export { Contenedor };
