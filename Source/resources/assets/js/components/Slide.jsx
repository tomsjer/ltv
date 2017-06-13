import React from 'react';
import PropTypes from 'prop-types';

class Slide extends React.Component {
  render() {
    return (
      <div className="slide col-xs-12">
        <p>{this.props.slide.titulo}</p>
      </div>
    );
  }
}

Slide.propTypes =  {
  titulo: PropTypes.string
};

export { Slide };
