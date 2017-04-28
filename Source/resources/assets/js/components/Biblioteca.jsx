import React from 'react';
import PropTypes from 'prop-types';
import { Encabezado } from './Encabezado.jsx';
import { Contenedor } from './Contenedor.jsx';
import { Buscador } from './Buscador.jsx';

class Biblioteca extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: 'grid'
    };

    this.toggleLayout = this.toggleLayout.bind(this);
  }
  toggleLayout(e) {
    this.setState({
      layout: e.currentTarget.dataset.layout
    });
  }
  render() {
    return (
      <aside id="biblioteca">
          <Encabezado layout={ this.state.layout } handler={ this.toggleLayout }/>
          <Buscador filter={ this.props.filter } />
          <Contenedor layout={ this.state.layout } media = { this.props.media } filterText={ this.props.filterText }/>
          <a id="agregarMedia" href="#" onClick={ this.props.openModal }> + Agregar media </a>
      </aside>
    );
  }
}

Biblioteca.propTypes = {
  modalVisible: PropTypes.bool,
  openModal: PropTypes.func,
  media: PropTypes.array,
  filter: PropTypes.func,
  filterText: PropTypes.string
};

export { Biblioteca };
