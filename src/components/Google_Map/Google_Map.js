import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from 'react-google-maps';
import PlacesAutoComplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import searchCardsReducer from '../../redux/reducers/searchCardsReducer';
import { Map, GoogleApiWrapper } from 'google-maps-react';

// import axios from 'axios';

class Google_Map extends Component {

    state = {
        coordinates: {
            lat: '',
            lng: ''
        },
        address: '',
        allCoordinates: []
    }

    componentDidMount = () => {
        console.log('mojnter');
        for (const card of this.props.cardsReducer) {
            this.handleSelect(card.location)
                .then(response => {
                    this.setState({
                        ...this.state,
                        allCoordinates: [...this.state.allCoordinates, response]
                    })
                })
        }
    }


    map = () => {
        return (
            <GoogleMap
                defaultZoom={10}
                defaultCenter={{ lat: 44.977753, lng: -93.265015 }}
            >
                {this.state.allCoordinates[0] && this.state.allCoordinates.map(coordinate => <Marker position={coordinate} />)}
                <Marker position={{ lat: 44.978105, lng: -93.263191 }} />
            </GoogleMap>);
    }


    WrappedMap = withScriptjs(withGoogleMap(this.map));

    handleSelect = async (value) => {

        const results = await geocodeByAddress(value)

        const latlng = await getLatLng(results[0]);
        this.setAddress(value);
        return latlng;
    }

    setAddress = (e) => {
        this.setState({
            ...this.state,
            address: e
        })
    }




    render() {
        return (
            <div style={{ width: '100vw', height: '100vh' }}>
                <PlacesAutoComplete value={this.state.address} onChange={(e) => this.setAddress(e)} onSelect={this.handleSelect}>
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <input {...getInputProps({ placeholder: "Type Address" })} />
                            <div>
                                <p>latitude: {this.state.coordinates.lat}</p>
                                <p>longitude: {this.state.coordinates.lng}</p>
                                {loading ? <div>...loading</div> : null}
                                {suggestions.map((suggestion) => {
                                    const style = {
                                        backgroundColor: suggestion.active ? 'red' : '#fff'
                                    }
                                    return <div {...getSuggestionItemProps(suggestion, { style })}>{suggestion.description}</div>
                                })}
                            </div>
                        </div>
                    )}
                </PlacesAutoComplete>
                <this.WrappedMap
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyD542u5wGZOZa6PoXUEfM5WVPvjgs_yphY`}
                    loadingElement={<div style={{ height: '100%', }} />}
                    containerElement={<div style={{ height: '100%', }} />}
                    mapElement={<div style={{ height: '100%', }} />}
                />
                {/* <Map
                    google={this.props.google}
                    zoom={8}

                    initialCenter={{ lat: 47.444, lng: -122.176 }}
                /> */}
                <pre>{JSON.stringify(this.state, null, 2)}</pre>
                <pre>{JSON.stringify(this.props.cardsReducer, null, 2)}</pre>
            </div>
        )
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Google_Map);
