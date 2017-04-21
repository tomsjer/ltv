
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
import { submit } from './utils.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal() {
    this.setState({
      modalVisible: true
    });
  }
  closeModal() {
    this.setState({
      modalVisible: false
    });
  }
  submitMedia(data) {
    const request = submit('POST', 'http://localhost:3000/api/media/store', {
      overrideMimeType: 'text/plain; charset=x-user-defined-binary',
      progressHandler: this.uploadPercentage,
      loadHandler: this.uploadCompleted,
      onreadyStateChange: this.onreadyStateChange
    });

    const fd = new FormData();
    for (const i in data) {
      fd.append(i, data[i]);
    }
    request.send(fd);
  }
  onreadyStateChange(e) {
    console.log(e, this.responseText);
  }
  uploadCompleted(e) {
    console.log(e);
  }
  uploadPercentage(e) {
    if (e.lengthComputable) {
      const percentage = Math.round((e.loaded * 100) / e.total);
      console.log(percentage);
      // this.setState({
      //   uploadPercentage: percentage
      // });
    }
  }
  render() {
    return (
      <div>
        <Biblioteca openModal ={ this.openModal} />
        <MediaModal submitMedia= { this.submitMedia } closeModal ={ this.closeModal} isVisible={ this.state.modalVisible}/>
      </div>
    );
  }
}

ReactDom.render(
  <App />,
  document.querySelector('#appContainer')
);
