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
    this.dragEndHandler = this.dragEndHandler.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }
  componentDidMount() {
    this.contenedor = document.querySelector('#contenedor');
    this.contenedorWrapper = document.querySelector('#contenedor-wrapper');
  }
  componentWillUnmount() {
    this.contenedorWrapper = null;
    this.contenedor = null;
  }
  dragStartHandler(e) {
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.draginfo);
    document.querySelector('.dropzone-container').classList.add('active');
  }
  dragEndHandler() {
    document.querySelector('.dropzone-container').classList.remove('active');
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
      <div className="item" key={i} data-dragInfo={JSON.stringify(element)} draggable="true" onDragStart={ this.dragStartHandler } onDragEnd={this.dragEndHandler}>
        <a href={ '#' +  element.id } data-index={i} onClick={ this.props.deleteMedia } className="btn"><span className="glyphicon glyphicon-remove" /></a>
        <div className="img-container">
          <img src= { element.options.srcThumbnail } />
        </div>
        <ul>
          <li>{element.options.name}</li>
          <li>{element.created_at.slice(0, 10)}</li>
          <span className={ element.media_types_id === 1 ? 'glyphicon glyphicon-picture' : 'glyphicon glyphicon-facetime-video' }  />
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
          { this.props.loading && <div><h4 className="loading">Cargando <span /></h4></div> }
          <div className="row">
            <button className="btn btn-default  col-xs-10 col-xs-offset-1" type="button" onClick={this.loadMore} disabled={this.state.isLoading}>Cargar más...</button>
          </div>
        </div>
      </div>
    );
  }
}

Contenedor.propTypes = {
  media: PropTypes.array,
  layout: PropTypes.string,
  filterText: PropTypes.string,
  getMedia: PropTypes.func,
  loading: PropTypes.bool,
  deleteMedia: PropTypes.func
};

export { Contenedor };
