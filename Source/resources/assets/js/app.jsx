import 'bootstrap-sass';
import React from 'react';
import ReactDom from 'react-dom';
import { Biblioteca } from './components/Biblioteca.jsx';
import { MediaModal } from './components/MediaModal.jsx';
import { Slideshow } from './components/Slideshow.jsx';
import { submit } from './utils.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    const self = this;

    this.state = {
      modalVisible: false,
      uploadPercentage: -1,
    };

    let host = window.location.origin;
    let path = window.location.pathname;

    path = path.split('/');
    path = path.slice(0,-1);
    path = path.join('/');
    this.fullUrl = host + path;
    
    this.submitMedia = this.submitMedia.bind(this);
    this.uploadPercentage = this.uploadPercentage.bind(this);
    this.uploadCompleted = this.uploadCompleted.bind(this);

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
      modalVisible: false,
      uploadPercentage: -1
    });
  }
  submitMedia(data) {
    const promise = new Promise((resolve, reject)=> {

      const request = submit('POST', `${this.fullUrl}/api/media/store`, {
        overrideMimeType: 'text/plain; charset=x-user-defined-binary',
        progressHandler: this.uploadPercentage,
        uploadHandler: (e)=> {
          this.uploadCompleted(e);
          resolve();
        },
        onreadyStateChange: this.onreadyStateChange,
        errorHandler: this.errorHandler
      });

      const fd = new FormData();
      for (const i in data) {
        fd.append(i, data[i]);
      }
      request.send(fd);
    });

    return promise;
  }
  errorHandler(e) {
    // TODO: Handle error in AJAX requests
    console.log(e);
  }
  onreadyStateChange(e) {
    if (e.target.readyState === 4 && e.target.status === 200) {
      console.log('completed');
    } else {
      console.log(`Error: ${e}`);
    }
  }
  uploadCompleted() {
    this.setState({
      uploadCompleted: true
    });
  }
  uploadPercentage(e) {
    if (e.lengthComputable) {
      const percentage = Math.round((e.loaded * 100) / e.total);
      this.setState({
        uploadPercentage: percentage
      });
    }
  }
  render() {
    return (
      <div>
        <Biblioteca fullUrl={ this.fullUrl } openModal ={ this.openModal }/>
        <Slideshow />
        <MediaModal submitMedia= { this.submitMedia } closeModal ={ this.closeModal} isVisible={ this.state.modalVisible} uploadPercentage={ this.state.uploadPercentage}/>
      </div>
    );
  }
}

ReactDom.render(
  <App />,
  document.querySelector('#appContainer')
);
