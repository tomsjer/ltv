import 'bootstrap-sass';
import React from 'react';
import ReactDom from 'react-dom';
import { Biblioteca } from './components/Biblioteca.jsx';
import { Slideshow } from './components/Slideshow.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    const host = window.location.origin;
    let path = window.location.pathname;

    path = path.split('/');
    path = path.slice(0, -1);
    path = path.join('/');
    this.fullUrl = host + path;
  }
  render() {
    return (
      <div>
        <Biblioteca fullUrl={ this.fullUrl } openModal ={ this.openModal }/>
        <Slideshow />
      </div>
    );
  }
}

ReactDom.render(
  <App />,
  document.querySelector('#appContainer')
);
