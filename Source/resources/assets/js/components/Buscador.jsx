import React from 'react';

class Buscador extends React.Component {
  render() {
    return (
      <div id="buscador">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="filtrar..."/>
          <span className="input-group-btn">
            <button type="btn" className="btn btn-sm">
              <span className="glyphicon glyphicon-search"/>
            </button>
          </span>
        </div>
      </div>
    );
  }
}

export { Buscador };
