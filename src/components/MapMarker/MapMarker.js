import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Marker, InfoWindow } from 'react-google-maps';
import * as geolib from 'geolib';


class Google_Map extends Component {
    state = {
        clicked: false
    }

    handleMarkerClick = () => {
        this.setState({
            clicked: !this.state.clicked
        })
    }


    findDistance = (coord) => {

        let meters = geolib.getDistance(
            coord,
            this.props.userLocation[0]
        );
        return meters/1609.34 + " miles away"
    }

    render() {
        return (
            <>
                <Marker
                    onClick={this.handleMarkerClick}
                    className="mapsMarker"
                    position={this.props.position}
                >
                    {this.state.clicked &&
                        <InfoWindow>
                            <div className="markerDetailsDiv">
                                {this.props.locationName + ', ' + this.props.addressDetails[0].formatted_address + ': ' + this.findDistance(this.props.position)}
                            </div>
                        </InfoWindow>
                    }
                </Marker>
            </>

        )
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Google_Map);
