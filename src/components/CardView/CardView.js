import React, {Component} from 'react';
import { connect } from 'react-redux';

import './CardView.css';


class CardView extends Component {

  routeToHome = () => {
    this.props.history.push('/home')
  }

  render() {
    return (
      <div className="card">
        <div className="cardLocation">Chipotle</div>
      </div>
    )
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(CardView);
