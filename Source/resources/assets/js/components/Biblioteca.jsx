/* global gapi, Promise */

import React from 'react';
import PropTypes from 'prop-types';
import { Encabezado } from './Encabezado.jsx';
import { Contenedor } from './Contenedor.jsx';
import { Buscador } from './Buscador.jsx';
import { MediaModal } from './MediaModal.jsx';
import { ajax } from '../utils.js';
import { initYoutubeAPI } from '../initYoutube.js';

class Biblioteca extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: 'grid',
      media: [],
      filterText: '',
      modalVisible: false,
    };

    this.addNewMedia = this.addNewMedia.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.mediaDownload = this.mediaDownload.bind(this);
    this.toggleLayout = this.toggleLayout.bind(this);
    this.handleFilterText = this.handleFilterText.bind(this);
    this.getMedia = this.getMedia.bind(this);
    this.getMedia();
  }
  getMedia(start, count) {
    const promise = new Promise((resolve, reject)=> {

      const request = ajax('GET', `${this.props.fullUrl}/api/media/get${start ? '/'+start : ''}`, {

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
    const newMedia = JSON.parse(e.target.response);
    if (!newMedia.length) {
      return;
    }
    newMedia.map((element)=>{
      element.options = JSON.parse(element.options);
    });
    const media = this.state.media.slice(0);

    const videosIds = newMedia.reduce((ac, el)=>{
      return (el.media_types_id === 2) ? `${ac},${el.options.id_youtube}` : ac;
    }, '');

    if (videosIds.length) {
      initYoutubeAPI()
      .then(()=>{
        const promise = new Promise((resolve, reject)=> {
          gapi.client.youtube.videos.list({
            part: 'snippet',
            id: videosIds
          }).execute(resolve);
        });
        return promise;
      })
      .then((response)=>{
        if (!response.items.length) return;

        response.items.forEach((video)=>{
          const el = newMedia.find((el)=>{ return el.options.id_youtube === video.id});
          el.options.srcThumbnail = video.snippet.thumbnails.default.url;
          el.options.src = (video.snippet.thumbnails.standard) ? video.snippet.thumbnails.standard.url : video.snippet.thumbnails.high.url;
        });

        this.setState({
          media: media.concat(newMedia)
        });
      });
    }
    else {
      this.setState({
        media: media.concat(newMedia)
      });
    }
  }
  addNewMedia(mediaElement) {
    const media =  this.state.media.slice(0);
    media.push(mediaElement);
    this.setState({
      media: media
    });
  }
  toggleLayout(e) {
    this.setState({
      layout: e.currentTarget.dataset.layout
    });
  }
  handleFilterText(e) {
    this.setState({
      filterText: e.target.value
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
  render() {
    return (
      <aside id="biblioteca">
          <Encabezado layout={ this.state.layout } handler={ this.toggleLayout }/>
          <Buscador filter={ this.handleFilterText } />
          <Contenedor layout={ this.state.layout } media = { this.state.media } filterText={ this.state.filterText } getMedia={this.getMedia}/>
          <a id="agregarMedia" href="#" onClick={ this.openModal }> + Agregar media </a>
          <MediaModal submitSuccess={ this.addNewMedia } closeModal ={ this.closeModal} isVisible={ this.state.modalVisible} fullUrl={ this.props.fullUrl }/>
      </aside>
    );
  }
}

Biblioteca.propTypes = {
  modalVisible: PropTypes.bool,
  openModal: PropTypes.func,
  media: PropTypes.array,
  filter: PropTypes.func,
  filterText: PropTypes.string,
  fullUrl: PropTypes.string
};

export { Biblioteca };
