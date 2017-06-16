/* global gapi, Promise */

import React from 'react';
import PropTypes from 'prop-types';
import { Encabezado } from './Encabezado.jsx';
import { Contenedor } from './Contenedor.jsx';
import { Buscador } from './Buscador.jsx';
import { submit } from '../utils.js';
import { initYoutubeAPI } from '../initYoutube.js';

class Biblioteca extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: 'grid',
      media: [],
      filterText: ''
    };

    // this.errorHandler = this.errorHandler.bind(this);
    this.mediaDownload = this.mediaDownload.bind(this);
    this.toggleLayout = this.toggleLayout.bind(this);
    this.handleFilterText = this.handleFilterText.bind(this);

    this.getMedia();
  }
  getMedia() {
    const promise = new Promise((resolve, reject)=> {

      const request = submit('GET', `${this.props.fullUrl}/api/media/get`, {

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

    const videosIds = media.reduce((ac, el)=>{
      return (el.media_types_id === 2) ? `${ac},${el.options.id_youtube}` : ac;
    }, '');

    if(videosIds.length){
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
          const el = media.find((el)=>{ return el.options.id_youtube === video.id});
          el.options.srcThumbnail = video.snippet.thumbnails.default.url;
          el.options.src = (video.snippet.thumbnails.standard) ? video.snippet.thumbnails.standard.url : video.snippet.thumbnails.high.url;
        });

        this.setState({
          media: media
        });
      });
    }
    else {
      this.setState({
        media: media
      });
    }
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


  // handleFilterText(e) {
  //   this.setState({
  //     filterText: e.target.value
  //   });
  // }

  render() {
    return (
      <aside id="biblioteca">
          <Encabezado layout={ this.state.layout } handler={ this.toggleLayout }/>
          <Buscador filter={ this.handleFilterText } />
          <Contenedor layout={ this.state.layout } media = { this.state.media } filterText={ this.state.filterText }/>
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
