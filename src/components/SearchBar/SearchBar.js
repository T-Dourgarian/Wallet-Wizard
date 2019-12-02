import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SearchBar.css';


class SearchBar extends Component {

    state = {
        searchString: "",
        type: ""
    }

    handleSearchChange = (property, event) => {
        this.setState({
            ...this.state,
            [property]: event.target.value
        }, () => this.dispatchSearch())

    }

    dispatchSearch = () => {
        this.props.dispatch({ type: "SEARCH_CARDS", payload: { data: this.props.cardsReducer, searchString: this.state.searchString, type: this.state.type } });
    }

    render() {
        return (
            <>
                {window.location.href.includes('/home') &&
                    <>
                        <label>
                            <i className="fas fa-search fa-lg searchIcon"></i>
                            <input placeholder='search' name="searchBar" className="searchBar" onChange={event => this.handleSearchChange('searchString', event)} />
                        </label>

                        <select className="dropDownType" onChange={(event) => this.handleSearchChange('type', event)}>
                            <option value=''>All</option>
                            <option value="gift card">Gift card</option>
                            <option value="coupon">Coupon</option>
                        </select>
                    </>
                }

            </>
        )
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(SearchBar);
