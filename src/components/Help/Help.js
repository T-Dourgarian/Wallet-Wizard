import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Help.css';


class Help extends Component {

    state = {
        helpActive:false

    }


    handleHelpClick = () => {
        this.setState({
            helpActive:!this.state.helpActive
        })
    }

    render() {
        return (
            <>
                
                {this.state.helpActive &&
                <div className="helpDiv">
                    <h2>SMS - how to</h2>
                    <h3>Add</h3>
                   
                        <div>Add $[gift card amount] [Gift Card Location] gift card [yyyy/mm/dd]</div>
                        <div>'Add $25 Starbucks gift card that expires 2019/12/31'</div>
                        <br/>
                        <div>Add [coupon details] [Coupon Location] coupon [yyyy/mm/dd]</div>
                        <div>'Add 25% off Nike coupon that expires 2019/12/31'</div>

                    <h3>View</h3>
                        <div>'Show me the money'</div>
                </div>
                }
                <i onClick={this.handleHelpClick} className="fas fa-question-circle fa-2x helpIcon"></i>
            </>
        )
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Help);
