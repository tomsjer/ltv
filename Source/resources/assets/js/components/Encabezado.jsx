import React from 'react';
import PropTypes from 'prop-types';

class Encabezado extends React.Component {
  constructor(props) {
    super(props);
    this.handleLayout = this.handleLayout.bind(this);
  }
  handleLayout(e) {
    this.props.handler(e);
  }
  render() {
    const classes = 'btn  btn-xs btn-dark';
    return (
      <div id="encabezado"> Biblioteca
        <button type="button" className={(this.props.layout === 'list') ? 'active ' + classes : classes }  onClick={ this.handleLayout } data-layout="list">
          <span className="glyphicon glyphicon-th-list" />
        </button>
        <button type="button" className={(this.props.layout === 'grid') ? 'active ' + classes  : classes } onClick={ this.handleLayout } data-layout="grid">
          <span className="glyphicon glyphicon-th-large" />
        </button>
      </div>
    );
  }
}

Encabezado.propTypes = {
  handler: PropTypes.func,
  layout: PropTypes.string
};

export { Encabezado };
