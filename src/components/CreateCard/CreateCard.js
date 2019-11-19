import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardView from '../CardView/CardView';
import './CreateCard.css';

class CreateCard extends Component {

    state = {
        onCreate: false,
        newCard : {
            type:"",
            location:"",
            credit:"",
            exipiration:""
        }
    }

    handleTypeSelect = (value) => {
        this.setState({
            onCreate: true,
            newCard:{
                ...this.state.newCard,
                type:value
            }
        })
    }

    cancelCreate = () => {
        this.setState({
            onCreate:false
        })
    }

    addCard = () => {
        this.props.dispatch({type:"ADD_CARD",payload:this.state.newCard})
        this.setState({
            onCreate:false
        })
    }


    handleChangeFor = (property,event) => {
        this.setState({
            ...this.state,
            newCard : {
                ...this.state.newCard,
                [property]:event.target.value
            }
        })
    }

    render() {
        return (
            <>
                {!this.state.onCreate ?
                    <div className="cardCreate">
                        <button className="cardButton giftcardButton" onClick={() => this.handleTypeSelect('gift card')}><i className="fas fa-plus-square fa-lg plusIcon"></i> New gift card</button> <br />
                        <button className="cardButton couponButton" onClick={() => this.handleTypeSelect('coupon')}><i className="fas fa-plus-square fa-lg plusIcon"></i> New coupon</button>
                    </div>:
                    <div className="cardCreateEdit">

                        <label className="locationLabelCreate">
                            Location:<input onChange={(event) => this.handleChangeFor('location',event)} className="locationInputCreate"/>
                        </label>
                        <i className="fas fa-ban fa-2x cancelIcon" onClick={this.cancelCreate}></i>
                        <i className="far fa-save fa-2x saveIcon" onClick={this.addCard}></i> <br/>

                        <label className="creditLabelCreate">
                            Credit:<input onChange={(event) => this.handleChangeFor('credit',event)} className="creditInputCreate"/>
                        </label>

                        <br/>

                        <label className="expirationlabelCreate">
                            Expiration:<input onChange={(event) => this.handleChangeFor('expiration',event)} type='date' className="expirationInputCreate"/>
                        </label>
                    </div>
                }
            </>

        )
    }
}

const mapStateToProps = state => state;

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(CreateCard);
