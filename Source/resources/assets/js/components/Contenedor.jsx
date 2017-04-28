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
          <li>{element.options.name}</li>
          <li>{element.created_at.slice(0, 10)}</li>
        </ul>
      </div>
    );
  }
  render() {
    const media = [];
    this.props.media.sort((a, b)=>{
      return (a.updated_at > b.updated_at) ? -1 : 1;
    })
    .forEach((element, i)=> {
      if (this.props.filterText !== '' && element.options.name.indexOf(this.props.filterText) === -1) {
        return;
      }
      media.push(this.renderMedia(element, i));
    });
    return (
      <div id="contenedor-wrapper">
        <div id="contenedor" className={ this.props.layout}>
          { media }
        </div>
      </div>
    );
  }
}

Contenedor.propTypes = {
  media: PropTypes.array,
  layout: PropTypes.string,
  filterText: PropTypes.string
};

export { Contenedor };
