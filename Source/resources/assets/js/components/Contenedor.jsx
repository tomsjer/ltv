import React from 'react';
import PropTypes from 'prop-types';

class Contenedor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
    this.lazyLoadRange = 100;
    this.start = 10;
    this.count = 10;
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }
  componentDidMount() {
    this.contenedor = document.querySelector('#contenedor');
    this.contenedorWrapper = document.querySelector('#contenedor-wrapper');
    // this.contenedorWrapper.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    // this.contenedorWrapper.removeEventListener('scroll', this.handleScroll);
    this.contenedorWrapper = null;
    this.contenedor = null;
  }
  dragStartHandler(e) {
    e.dataTransfer.setData("text/plain", e.currentTarget.dataset.draginfo);
  }
  handleScroll(e) {
    const rectWrapper  = e.target.getClientRects()[0];
    const rectContenedor = this.contenedor.getClientRects()[0];
    if ( rectContenedor.bottom - this.lazyLoadRange < rectWrapper.bottom && !this.state.isLoading) {
      this.setState({
        isLoading: true
      });
      this.props.getMedia(this.start)
      .then((e)=>{
        this.setState({
          isLoading: false
        });
      });
    }
  }
  loadMore() {
    if (!this.state.isLoading ) {
      this.setState({ isLoading: true });
      this.props.getMedia(this.start)
      .then((e)=>{
        this.setState({
          isLoading: false
        });
        if (JSON.parse(e.target.response).length) {
          this.start += this.count;
        }
      });
    }
  }
  renderMedia(element, i) {
    return (
      <div className="item" key={i} data-dragInfo={JSON.stringify(element)} draggable="true" onDragStart={ this.dragStartHandler }>
        <div className="img-container">
          <img src= { element.options.srcThumbnail } />
        </div>
        <ul>
          <li>{element.options.name}</li>
          <li>{element.created_at.slice(0, 10)}</li>
        </ul>
      </div>
    );
  }
  render() {
    const media = [];
    this.props.media.sort((a, b)=>{
      return (a.updated_at > b.updated_at) ? -1 : 1;
    })
    .forEach((element, i)=> {
      if (this.props.filterText !== '' && element.options.name && element.options.name.indexOf(this.props.filterText) === -1) {
        return;
      }
      media.push(this.renderMedia(element, i));
    });
    return (
      <div id="contenedor-wrapper">
        <div id="contenedor" className={ this.props.layout}>
          { media }
          <div className="row">
            <div className="col-xs-12">
              <button className="btn btn-default" type="button" onClick={this.loadMore} disabled={this.state.isLoading}>Cargar más...</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Contenedor.propTypes = {
  media: PropTypes.array,
  layout: PropTypes.string,
  filterText: PropTypes.string
};

export { Contenedor };
