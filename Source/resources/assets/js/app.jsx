
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

// require('./bootstrap');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// Vue.component('example', require('./components/Example.vue'));

// const app = new Vue({
//     el: '#app'
// });

import React from 'react';
import ReactDom from 'react-dom';
import { Biblioteca } from './components/Biblioteca.jsx';
import { MediaModal } from './components/MediaModal.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }
  toggleModal() {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  }
  render() {
    return (
      <div>
        <Biblioteca toggleModal ={ this.toggleModal} />
        <MediaModal toggleModal ={ this.toggleModal} isVisible={ this.state.modalVisible}/>
      </div>
    );
  }
}

ReactDom.render(
  <App />,
  document.querySelector('#appContainer')
);
