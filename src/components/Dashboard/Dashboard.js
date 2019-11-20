import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardView from '../CardView/CardView';
import CreateCard from '../CreateCard/CreateCard';

class Dashboard extends Component {
  componentDidMount() {
    this.props.dispatch({ type: "GET_CARDS" });
  }

  render() {
    return (
      <div>
        <CreateCard />
        {this.props.searchCardsReducer && this.props.searchCardsReducer.map((card, i) => <CardView key={i} card={card} />)}
      </div>
    )
  }
}

const mapStateToProps = state => state;

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(Dashboard);
