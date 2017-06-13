import BootstrapSass from 'bootstrap-sass';
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
      media: []
    };

    let host = window.location.origin;
    let path = window.location.pathname;

    path = path.split('/');
    path = path.slice(0,-1);
    path = path.join('/');
    this.fullUrl = host + path;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitMedia = this.submitMedia.bind(this);
    this.uploadPercentage = this.uploadPercentage.bind(this);
    this.uploadCompleted = this.uploadCompleted.bind(this);
    this.errorHandler = this.errorHandler.bind(this);
    this.mediaDownload = this.mediaDownload.bind(this);
    this.handleFilterText = this.handleFilterText.bind(this);

    window.addEventListener('load', function onLoad() {
      self.getMedia();
    });
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
  getMedia() {
    const promise = new Promise((resolve, reject)=> {

      const request = submit('GET', `${this.fullUrl}/api/media/get`, {

        progressHandler: (e) => {
          console.log(e);
        },
        onreadyStateChange: (e)=> {
          if (e.target.readyState === 4 && e.target.status === 200) {
            this.mediaDownload(e);
            resolve(e);
          } else {
            console.log(`Error: ${e}`);
          }
        },
        errorHandler: this.errorHandler
      });
      request.send();
    });

    return promise;
  }
  mediaDownload(e) {
    const media = JSON.parse(e.target.response);
    media.map((element)=>{
      element.options = JSON.parse(element.options);
    });
    this.setState({
      media: media,
      filterText: ''
    });
  }
  handleFilterText(e) {
    this.setState({
      filterText: e.target.value
    });
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
    this.getMedia();
  }
  uploadPercentage(e) {
    if (e.lengthComputable) {
      const percentage = Math.round((e.loaded * 100) / e.total);
      this.setState({
        uploadPercentage: percentage
      });
    }
  }
  errorHandler(e) {
    // TODO: Handle error in AJAX requests
    console.log(e);
  }
  render() {
    return (
      <div>
        <Biblioteca media={this.state.media} openModal ={ this.openModal} filter={this.handleFilterText} filterText={ this.state.filterText }/>
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
