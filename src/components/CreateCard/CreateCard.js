import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardView from '../CardView/CardView';
import './CreateCard.css';

class CreateCard extends Component {

    state = {
        onCreate: true
    }

    handleCardSelect = () => {
        this.setState({
            onCreate: true
        })
    }

    render() {
        return (
            <>
                {!this.state.onCreate ?
                    <div className="cardCreate">
                        <button className="cardButton giftcardButton" onClick={this.handleCardSelect}><i className="fas fa-plus-square fa-lg plusIcon"></i> New gift card</button> <br />
                        <button className="cardButton couponButton" onClick={this.handleCardSelect}><i className="fas fa-plus-square fa-lg plusIcon"></i> New coupon</button>
                    </div>:
                    <div className="cardCreateEdit">
                        <label className="locationLabel">
                            Location:<input className="locationInputCreate"/>
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
