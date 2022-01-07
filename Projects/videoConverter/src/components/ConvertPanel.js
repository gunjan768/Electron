import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../actions';

class ConvertPanel extends Component {

  onCancelPressed = () => {
    this.props.removeAllVideos();
    // this.props.history.push('/')
  }

  render() {
    return (
      <div className="convert-panel">
        <button className="btn red" onClick={this.onCancelPressed}>
          Cancel
        </button>
        <button className="btn" onClick={this.props.convertVideos.bind(null, this.props.videos)}>
          Convert!
        </button>
      </div>
    );
  };
}

function mapStateToProps(state) {
  const videos = _.map(state.videos);
  return { videos };
}

// withRouter() is not longer exists in v6
// https://stackoverflow.com/questions/69934351/withrouter-is-not-exported-from-react-router-dom/69934614
export default connect(mapStateToProps, actions)(ConvertPanel);
