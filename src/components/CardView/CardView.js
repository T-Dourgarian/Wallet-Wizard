import React, { Component } from 'react';
import { connect } from 'react-redux';

import './CardView.css';


class CardView extends Component {



    state = {
        editMode: false,
        editDetails: {
            location:this.props.card.location,
            credit:this.props.card.credit,
            expiration:this.props.card.expiration
        }
    }

    handleChangeFor = (property,event) => {
        this.setState({
            ...this.state,
            editDetails: {
                ...this.state.editDetails,
                [property]:event.target.value
            }
        })
    }


    switchEditMode = (id) => {
        if (!this.state.editMode) {
            this.setState({
                editMode:true
            })
        } else {
            this.setState({
                editMode:false
            })
            this.props.dispatch({type:"EDIT_CARD",payload:{details:this.state.editDetails,id:id}})
        }
    }


    turnEditModeOff = () => {
        this.setState({
            ...this.state,
            editMode:false,
        })
    }

    render() {
        return (
            <>
                {!this.state.editMode ?
                    <div className="card">
                        <div className="cardLocation">{this.props.card.location}</div>
                        <i className="fas fa-pencil-alt fa-lg editIcon" onClick={this.switchEditMode}></i>
                        <div className="cardCredit">Credit: {this.props.card.credit}</div>
                        <div className="cardExpiration">Expiration: {this.props.card.expiration.split('T')[0]}</div>
                    </div> :
                    <div className="card">
                        <input value={this.state.editDetails.location} className="locationInput" onChange={event => this.handleChangeFor('location',event)}/>
                        <i class="fas fa-ban fa-lg cancelIcon" onClick={() => this.turnEditModeOff()}></i>
                        <i className="far fa-save fa-lg saveIcon" onClick={() => this.switchEditMode(this.props.card.id)}></i> <br/>
                        <label className="creditLabel" htmlFor="creditInput">
                            Credit: <input name="creditInput" value={this.state.editDetails.credit} className="cardCredit cardCredit-input" onChange={event => this.handleChangeFor('credit',event)}/>
                        </label>
                        <br/>
                        <label className="creditLabel" htmlFor="expirationlabel">
                            Expiration: <input value={this.state.editDetails.expiration.split('T')[0]} name="expirationlabel" type="date" onChange={event => this.handleChangeFor('expiration',event)} className="cardExpiration cardExpiration-input"/>
                        </label>
                    </div>
                }
            </>
        )
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(CardView);
