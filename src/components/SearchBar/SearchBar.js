import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SearchBar.css';


class SearchBar extends Component {

    handleSearchChange = (event) => {
        this.props.dispatch({type:"SEARCH_CARDS",payload:{data:this.props.cardsReducer,searchString:event.target.value}})
    }


    render() {
        return (
            <>
                <i className="fas fa-search fa-lg searchIcon"></i>
                <input placeholder="Taco Bell, Nike, Kohls" name="searchBar" className="searchBar" onChange={event => this.handleSearchChange(event)}/>
            </>
        )
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(SearchBar);
