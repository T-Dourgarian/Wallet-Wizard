import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, MarkerWithLabel } from 'react-google-maps';

class Google_Map extends Component {
    state = {
        isHovering: false
    }

    changeHovering = () => {
        this.setState({
            isHovering: !this.state.isHover
        })
    }
    render() {
        return (
            <>
            {
                this.state.isHovering ? <div className="popUp">Hello There</div> :
                    <Marker
                        position={this.props.position}
                    >
                    </Marker>
            }
            </>

        )
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Google_Map);
