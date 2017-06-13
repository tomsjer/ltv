/* global gapi, Promise */
export function initYoutubeAPI() {
  // Initializes the client with the API key and the Translate API.
  gapi.client.init({
    apiKey: 'AIzaSyBAvI0AnzipsHBXGON56n9ezxixXRtZFwo',
    clientId: '361309102800-pql1rhalb76idkitbt0fqehl58o55mok.apps.googleusercontent.com',
    scope: 'profile'
  })
  .then(()=> {
    return gapi.auth2.getAuthInstance().signIn({
      prompt: 'consent'
    });
  })
  .then(()=>{
      return gapi.client.load('youtube','v3');
  })
  .then(()=>{
    const promise = new Promise((resolve, reject)=> {
      // gapi.client.youtube.videos.list({
      //   part: 'snippet',
      //   id: 'k4D7c5SzAjQ'
      // }).execute(resolve);
      gapi.client.youtube.videos.list({
        mine: true,
        part: 'contentDetails'
      }).execute(resolve);
    });
    return promise;
  })
  .then((response)=>{
    console.log(response);
  })
  .catch(()=>{
    console.log('error');
  });
}
