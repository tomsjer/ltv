import React from 'react';

class Buscador extends React.Component {
  render() {
    return (
      <div className="input-group">
        <input type="text" placeholder="filtrar..."/>
        <button type="btn" className="btn btn-xs">
          <span className="glyphicon glyphicon-search"/>
        </button>
      </div>
    );
  }
}

export { Buscador };
