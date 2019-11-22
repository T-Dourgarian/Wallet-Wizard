import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from 'react-google-maps';
import MapMarker from '../MapMarker/MapMarker'
// import axios from 'axios';

class Google_Map extends Component {



    componentDidMount = () => {
        this.props.dispatch({ type: "GET_CARDS" });
    }


    map = () => {
        return (
            <GoogleMap
                defaultZoom={10}
                defaultCenter={{ lat: 44.977753, lng: -93.265015 }}
            >
                {this.props.coordinatesReducer[0] && this.props.coordinatesReducer.map((coordinate,i) => <MapMarker key={i} position={coordinate}/>)}
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
