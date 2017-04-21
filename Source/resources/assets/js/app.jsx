import BootstrapSass from 'bootstrap-sass';
import React from 'react';
import ReactDom from 'react-dom';
import { Biblioteca } from './components/Biblioteca.jsx';
import { MediaModal } from './components/MediaModal.jsx';
import { submit } from './utils.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      uploadPercentage: -1
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitMedia = this.submitMedia.bind(this);
    this.uploadPercentage = this.uploadPercentage.bind(this);
    this.uploadCompleted = this.uploadCompleted.bind(this);
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
      
      const request = submit('POST', 'http://localhost:3000/api/media/store', {
        overrideMimeType: 'text/plain; charset=x-user-defined-binary',
        progressHandler: this.uploadPercentage,
        loadHandler: (e)=> {
          this.uploadCompleted(e);
          resolve();
        },
        onreadyStateChange: this.onreadyStateChange
      });

      const fd = new FormData();
      for (const i in data) {
        fd.append(i, data[i]);
      }
      request.send(fd);
    });

    return promise;
  }
  onreadyStateChange(e) {
    if (e.readyState === 4 && e.status === 200) {
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
        <Biblioteca openModal ={ this.openModal} />
        <MediaModal submitMedia= { this.submitMedia } closeModal ={ this.closeModal} isVisible={ this.state.modalVisible} uploadPercentage={ this.state.uploadPercentage}/>
      </div>
    );
  }
}

ReactDom.render(
  <App />,
  document.querySelector('#appContainer')
);
