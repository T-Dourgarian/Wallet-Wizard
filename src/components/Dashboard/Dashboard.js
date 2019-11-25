import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardView from '../CardView/CardView';
import CreateCard from '../CreateCard/CreateCard';
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyA9E46P330M7-A6C5DyXqNsqE7zA3JTWcg");


class Dashboard extends Component {

  state = {
    userPosition:""
  }

  showPosition = (position) => {
    console.log(position)

    Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
      response => {
        const address = response.results[0];
        console.log('ADDRESS',address);
      },
      error => {
        console.error(error);
      }
    );


  } 

  componentDidMount() {
    this.props.dispatch({ type: "GET_CARDS" });
    console.log(process.env.MAPS_API_KEY)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    }

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
