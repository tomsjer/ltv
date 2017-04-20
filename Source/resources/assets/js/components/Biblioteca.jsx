import React from 'react';
import { Encabezado } from './Encabezado.jsx';
import { Contenedor } from './Contenedor.jsx';
import { Buscador } from './Buscador.jsx';

class Biblioteca extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: 'grid',
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
      videos: [],
    };

    this.toggleLayout = this.toggleLayout.bind(this);
    this.triggerMediaModal = this.triggerMediaModal.bind(this);
  }
  toggleLayout(e) {
    this.setState({
      layout: e.currentTarget.dataset.layout
    });
  }
  triggerMediaModal() {
    this.props.modal.open();
  }
  render() {
    return (
      <div>
          <Encabezado layout={ this.state.layout } handler={ this.toggleLayout }/>
          <Buscador />
          <Contenedor layout={ this.state.layout } media = { this.state.images } />
          <a id="agregarMedia" href="#" onClick={ this.triggerMediaModal }> + Agregar media </a>
      </div>
    );
  }
}

export { Biblioteca };
