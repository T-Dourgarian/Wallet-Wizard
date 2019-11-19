import React, { Component } from 'react';
import { connect } from 'react-redux';

import './CardView.css';


class CardView extends Component {



    state = {
        editMode: false
    }


    switchEditMode = () => {
        if (!this.state.editMode) {
            this.setState({
                editMode:true
            })
        } else {
            this.setState({
                editMode:false
            })
        }
    }

    render() {
        return (
            <>
                {!this.state.editMode ?
                    <div className="card">
                        <div className="cardLocation">{this.props.card.location}</div>
                        <i className="fas fa-pencil-alt fa-lg editIcon" onClick={this.switchEditMode}></i>
                        <div className="cardCredit">Credit: {this.props.card.credit}</div>
                        <div className="cardExpiration">Expiration: {this.props.card.expiration}</div>
                    </div> :
                    <div className="card">
                        <input placeholder=" Location" className="locationInput"/>
                        <i className="fas fa-pencil-alt fa-lg editIcon" onClick={this.switchEditMode}></i>
                        <div className="cardCredit">Credit: <input placeholder="e.g. BOGO" className="creditInput"/></div>
                        <div className="cardExpiration">Expiration: {this.props.card.expiration}</div>
                    </div>
                }
            </>
        )
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(CardView);
