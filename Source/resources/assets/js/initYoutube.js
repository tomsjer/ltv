/* global gapi, Promise, onYouTubeIframeAPIReady */
import gapi from 'gapi';

export function initYoutubeAPI() {
  const promise = new Promise((resolve, reject)=>{
    gapi.load('client', function init() {
      return gapi.client.init({
        apiKey: 'AIzaSyBAvI0AnzipsHBXGON56n9ezxixXRtZFwo' // TODO: grab this from ENV file
      })
      .then(()=> {
        return gapi.client.load('youtube', 'v3');
      })
      .then(resolve)
      // .cath(reject); // Its thowing error
    });
  });

  return promise;
}

export function initYoutubeIframeAPI() {
  const promise = new Promise((resolve, reject)=>{
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
      resolve();
    };
  });

  return promise;
}
