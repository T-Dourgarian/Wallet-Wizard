import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SearchBar.css';


class SearchBar extends Component {

    state = {
        searchString:"",
        type:""
    }

    handleSearchChange = (property,event) => {
        this.setState({
            ...this.state,
            [property]:event.target.value
        },() => this.dispatchSearch())
        
    } 

    dispatchSearch = () => {
        this.props.dispatch({ type: "SEARCH_CARDS", payload: { data: this.props.cardsReducer, searchString: this.state.searchString, type:this.state.type}});
    }

    render() {
        return (
            <>
                <label>
                    <i className="fas fa-search fa-lg searchIcon"></i>
                    <input placeholder="Taco Bell, Nike, Kohls" name="searchBar" className="searchBar" onChange={event => this.handleSearchChange('searchString',event)} />
                </label>

                <select onChange={(event) => this.handleSearchChange('type',event)}>
                    <option value="gift card">gift card</option>
                    <option value="coupon">coupon</option>
                </select>
            </>
        )
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(SearchBar);
