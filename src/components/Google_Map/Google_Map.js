import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from 'react-google-maps';
import MapMarker from '../MapMarker/MapMarker'
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyA9E46P330M7-A6C5DyXqNsqE7zA3JTWcg");

class Google_Map extends Component {

    showPosition = (position) => {
        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
            response => {
                const address = response.results[0];
                console.log('ADDRESS',address);
                this.props.dispatch({ type: 'SET_USER_LOCATION', payload: [address.geometry.location, address.address_components[3].long_name + " " + address.address_components[5].long_name] });
                this.props.dispatch({ type: "GET_CARDS" });
            },
            error => {
                console.error(error);
            }
        );
    }

    state = {
        clicked: true
    }

    handleMarkerClick = () => {

        this.setState({
            clicked: !this.state.clicked
        })
    }

    componentDidMount = () => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        }
    }


    map = () => {
        return (
            <GoogleMap
                defaultZoom={10}
                defaultCenter={{ lat: 44.977753, lng: -93.265015 }}
            >
                {this.props.coordinatesReducer[0] && this.props.coordinatesReducer.map((coordinate, i) =>
                    <MapMarker
                        key={i}
                        position={coordinate[0]}
                        addressDetails={coordinate[1]}
                        locationName={coordinate[2]}
                    />
                )}
                {this.props.userLocation[0] &&
                    <Marker
                        onClick={this.handleMarkerClick}
                        className="mapsMarker"
                        position={this.props.userLocation[0]}
                    >
                        {this.state.clicked &&
                            <InfoWindow>
                                <div className="markerDetailsDiv">
                                    You are here
                                </div>
                            </InfoWindow>
                        }
                    </Marker>
                }
            </GoogleMap>);
    }


    WrappedMap = withScriptjs(withGoogleMap(this.map));


    render() {
        return (
            <div style={{ width: '100vw', height: '100vh' }}>
                <this.WrappedMap
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA9E46P330M7-A6C5DyXqNsqE7zA3JTWcg`}
                    loadingElement={<div style={{ height: '100%', }} />}
                    containerElement={<div style={{ height: '100%', }} />}
                    mapElement={<div style={{ height: '100%', }} />}
                />

            </div>
        )
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Google_Map);
