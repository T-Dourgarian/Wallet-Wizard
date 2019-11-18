import React, {Component} from 'react';
import {connect} from 'react-redux';
import CardView from '../CardView/CardView';


class Dashboard extends Component {
  componentDidMount () {

  }

  render() {
    return (
      <div>
        <CardView />
      </div>
  )}
}

const mapStateToProps = state => state;

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(Dashboard);
