export function fetch(url, options) {
  const promise = new Promise(( resolve, reject)=>{
    fetch(url, options)
    .then((response)=>{
      resolve(response);
    })
    .catch((error)=>{
      reject(error);
    });
  });
  return promise;
}
export function ajax(method, url, options) {
  const xhr = new XMLHttpRequest();
  if (options.progressHandler) {
    xhr.upload.addEventListener('progress', options.progressHandler, false);
  }
  if (options.uploadHandler) {
    xhr.upload.addEventListener('load', options.uploadHandler, false);
  }
  if (options.overriveMimeTpye) {
    xhr.overriveMimeTpye(options.overriveMimeTpye);
  }
  if (options.onreadyStateChange) {
    xhr.onreadystatechange = options.onreadyStateChange;
  }
  xhr.open(method, url);
  return xhr;
}

export function youtubeUrlParser( url ) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  let match = url.match(regExp);
  if (match && match[2].length === 11) {
    match = match[2];
  } else {
    match = null;
  }
  return match;
}

export function setDefaultDate() {
  const d = new Date();
  const iso = d.toISOString();
  return iso.replace(/(T.*)/, '');
}
