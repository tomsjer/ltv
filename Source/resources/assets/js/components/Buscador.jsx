import React from 'react';
import PropTypes from 'prop-types';

class Buscador extends React.Component {
  render() {
    return (
      <div id="buscador">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="filtrar..." onChange={ this.props.filter }/>
          <span className="input-group-btn">
            <span className="btn glyphicon glyphicon-search"/>
          </span>
        </div>
      </div>
    );
  }
}

Buscador.propTypes = {
  filter: PropTypes.func
};

export { Buscador };
