import React, { Component } from 'react';
import { connect } from 'react-redux';

import './CardView.css';


class CardView extends Component {



    state = {
        editMode: false,
        editDetails: {
            location:"",
            credit:"",
            expiration:""
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


    switchEditMode = () => {
        if (!this.state.editMode) {
            this.setState({
                editMode:true
            })
        } else {
            this.setState({
                editMode:false
            })

            this.props.dispatch({type:"EDIT_CARD",payload:this.state.editDetails})
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
                        <div className="cardExpiration">Expiration: {this.props.card.expiration.split('T')[0]}</div>
                    </div> :
                    <div className="card">
                        <input value={this.props.card.location} className="locationInput" onChange={event => this.handleChangeFor('location',event)}/>
                        <i className="far fa-save fa-lg saveIcon" onClick={this.switchEditMode}></i> <br/>
                        <label className="creditLabel" HTMLFor="creditInput">
                            Credit: <input name="creditInput" value={this.props.card.credit} className="cardCredit cardCredit-input" onChange={event => this.handleChangeFor('credit',event)}/>
                        </label>
                        <br/>
                        <label className="creditLabel" HTMLFor="expirationlabel">
                            Expiration: <input value={this.props.card.expiration.split('T')[0]} name="expirationlabel" type="date" onChange={event => this.handleChangeFor('expiration',event)} className="cardExpiration cardExpiration-input"/>
                        </label>
                    </div>
                }
            </>
        )
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(CardView);
