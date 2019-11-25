import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Marker, InfoWindow } from 'react-google-maps';

class Google_Map extends Component {
    state = {
        clicked: false
    }

    handleMarkerClick = () => {

        this.setState({
            clicked: !this.state.clicked
        })
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
                                {this.props.locationName + ', ' + this.props.addressDetails[0].formatted_address}
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
