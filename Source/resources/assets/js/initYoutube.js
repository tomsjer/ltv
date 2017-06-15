/* global gapi, Promise */
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
