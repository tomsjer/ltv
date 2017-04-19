import React from 'react';

class Encabezado extends React.Component {
  render() {
    return (
      <div> Biblioteca
        <span className="glyphicon glyphicon-th-large active" />
        <span className="glyphicon glyphicon-th-list" />
      </div>
    );
  }
}

export { Encabezado };
