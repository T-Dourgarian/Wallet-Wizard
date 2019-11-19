import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import SearchBar from '../SearchBar/SearchBar';
import './Nav.css';


class Nav extends Component {

  routeToHome = () => {
    this.props.history.push('/home')
  }

  render() {
    return (
      <div className="nav">
        <SearchBar />


        <Link to="/home" className="nav-title">
          The Wallet Wizard
        </Link>
        <div className="nav-right">

          <Link className="nav-link" to="/home" >
            {/* Show this link if they are logged in or not,
        but call this link 'Home' if they are logged in,
        and call this link 'Login / Register' if they are not */}
            {this.props.user.id ? 'Home' : 'Login / Register'}
          </Link>

          {/* Show the link to the info page and the logout button if the user is logged in */}

          {this.props.user.id && (
            <>
              <LogOutButton className="nav-link padding-right" />
            </>
          )}


          {/* Always show this link since the about page is not protected */}
        </div>
      </div>
    )
  }
}

// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links 
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Nav);
