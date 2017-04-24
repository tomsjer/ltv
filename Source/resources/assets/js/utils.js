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
export function submit(method, url, options) {
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
