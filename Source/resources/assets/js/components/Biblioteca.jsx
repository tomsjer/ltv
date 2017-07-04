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
      loading: true,
      mediaToDelete: null,
      showDeletionSuccess: false,
      showDeletionMsg: false,
    };

    this.addNewMedia = this.addNewMedia.bind(this);
    this.removeMedia = this.removeMedia.bind(this);
    this.deleteMedia = this.deleteMedia.bind(this);
    this.showDeletionError = this.showDeletionError.bind(this);
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
          media: media.concat(newMedia),
          loading: false,
        });
      });
    }
    else {
      this.setState({
        media: media.concat(newMedia),
        loading: false,
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
  removeMedia() {
    const media = this.state.media.slice(0);
    media.splice(this.mediaToDeleteIndex, 1);
    this.setState({
      media: media,
      showDeletionSuccess: true
    });
    this.mediaToDeleteIndex = null;
    setTimeout(()=>{
      this.setState({
        showDeletionSuccess: false
      })
    }, 5000);
  }
  showDeletionError() {
    this.setState({
      showDeletionMsg: true
    });
    setTimeout(()=>{
      this.setState({
        showDeletionMsg: false
      });
    }, 5000)
  }
  deleteMedia(element) {
    const id = element.currentTarget.getAttribute('href').replace('#', '');
    this.mediaToDeleteIndex = element.currentTarget.dataset.index;
    this.setState({
      modalVisible: true,
      mediaToDelete: id
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
      uploadPercentage: -1,
      mediaToDelete: null
    });
  }
  render() {
    return (
      <aside id="biblioteca">
          <Encabezado layout={ this.state.layout } handler={ this.toggleLayout }/>
          <Buscador filter={ this.handleFilterText } />
          <Contenedor layout={ this.state.layout } media = { this.state.media } filterText={ this.state.filterText } getMedia={this.getMedia} loading={ this.state.loading } deleteMedia={ this.deleteMedia }/>
          <a id="agregarMedia" href="#" onClick={ this.openModal }> + Agregar media </a>
          <MediaModal submitSuccess={ this.addNewMedia } closeModal ={ this.closeModal} isVisible={ this.state.modalVisible} fullUrl={ this.props.fullUrl } mediaToDelete={ this.state.mediaToDelete } removeMedia={ this.removeMedia } showDeletionError={ this.showDeletionError }/>
          { this.state.showDeletionSuccess && (
              <div>
                <div className="backdrop" />
                <div className="alert alert-success" role="alert"><p>Se elimino el elemento correctamente.</p></div>
              </div>
            )}
          { this.state.showDeletionMsg && (
              <div>
                <div className="backdrop" />
                <div className="alert alert-danger" role="alert"><p>No se pude eliminar el elemento. Verifique que el elemento no esté en uso.</p></div>
              </div>
            )}
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
