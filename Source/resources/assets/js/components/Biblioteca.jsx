import React from 'react';
import {Encabezado} from './Encabezado.jsx';
import {Contenedor} from './Contenedor.jsx';

class Biblioteca extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [
        {
          src: 'http://placehold.it/100/100',
        },
        {
          src: 'http://placehold.it/100/100',
        },
        {
          src: 'http://placehold.it/100/100',
        },
        {
          src: 'http://placehold.it/100/100',
        },
      ],
      videos: [

      ],
    };
  }
  render() {
    return (
      <div>
          <Encabezado />
          <Contenedor media = { this.state.images } />
          <a href="#"> + Agregar media </a>
      </div>
    );
  }
}

export { Biblioteca };
