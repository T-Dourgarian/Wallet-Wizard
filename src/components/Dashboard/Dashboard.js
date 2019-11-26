import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardView from '../CardView/CardView';
import CreateCard from '../CreateCard/CreateCard';
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyA9E46P330M7-A6C5DyXqNsqE7zA3JTWcg");


class Dashboard extends Component {


  showPosition = (position) => {
    Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
      response => {
        const address = response.results[0];
        this.props.dispatch({type:'SET_USER_LOCATION',payload:[address.geometry.location,address.address_components[3].long_name +" " + address.address_components[5].long_name]});
        console.log('USER LOCATION',this.props.userLocation);
      },
      error => {
        console.error(error);
      }
    );
  } 

  componentDidMount = () => {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    }
    this.props.dispatch({ type: "GET_CARDS" });
  }

  setColor = (currentDate, expirationDate) => {
    let newColor;
    if (currentDate > expirationDate.setDate(expirationDate.getDate() - 3)) {
        // red
        newColor = 'rgb(136, 0, 0)';
    } else if (currentDate > expirationDate.setDate(expirationDate.getDate() - 7)) {
        // yellow
        newColor = '#FFB600';
    } else {
        // green
        newColor = '#008800'
    }
    return newColor
  }

  render() {
    return (
      <div>
        <CreateCard />
        {this.props.searchCardsReducer && this.props.searchCardsReducer.map((card, i) => <CardView key={i} card={card}  color={this.setColor(new Date(),new Date(card.expiration))} />)}
      </div>
    )
  }
}

const mapStateToProps = state => state;

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(Dashboard);
