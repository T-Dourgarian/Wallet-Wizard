import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardView from '../CardView/CardView';
import CreateCard from '../CreateCard/CreateCard';
import Geocode from "react-geocode";
import Help from '../Help/Help';
Geocode.setApiKey("AIzaSyA9E46P330M7-A6C5DyXqNsqE7zA3JTWcg");


class Dashboard extends Component {


  componentDidMount = () => {
  
    this.props.dispatch({ type: "GET_CARDS" });
  }

  setColor = (currentDate, expirationDate) => {
    let newColor;
    if (currentDate > expirationDate.setDate(expirationDate.getDate() - 3)) {
        // red
        newColor = 'linear-gradient(135deg, rgba(136,0,0,1) 10%, #ff6600 100%)';
    } else if (currentDate > expirationDate.setDate(expirationDate.getDate() - 7)) {
        // yellow
        newColor = 'linear-gradient(135deg, rgba(242,177,0,1) 10%, rgba(255,136,136,1) 100%)';
    } else {
        // green
        newColor = 'linear-gradient(135deg, #008848 10%, #9ccc00 100%)'
    }
    return newColor
  }

  render() {
    return (
      <div>
        <CreateCard />
        {this.props.searchCardsReducer && this.props.searchCardsReducer.map((card, i) => <CardView key={i} card={card}  color={this.setColor(new Date(),new Date(card.expiration))} />)}
        <Help/>
      </div>
    )
  }
}

const mapStateToProps = state => state;

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(Dashboard);
