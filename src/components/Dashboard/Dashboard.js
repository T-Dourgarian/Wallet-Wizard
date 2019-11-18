import React, {Component} from 'react';
import {connect} from 'react-redux';


class Dashboard extends Component {
  componentDidMount () {

  }

  render() {
    return (
      <div>
        HELLO
      </div>
  )}
}

const mapStateToProps = state => state;

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(Dashboard);
