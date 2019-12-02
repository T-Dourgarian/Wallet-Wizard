import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../LoginPage/LoginPage';
import axios from 'axios';

class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
    phoneNumber: ''
  };

  registerUser = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password && this.state.phoneNumber) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          username: this.state.username,
          password: this.state.password,
          phoneNumber: this.state.phoneNumber
        },
      });

      axios.post('/sms/initial',{phoneNumber:this.state.phoneNumber})
            .then(response => {

            }).catch(error => {
              console.log(error)
            });
    } else {
      this.props.dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
    }
  } // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <div>
        {this.props.errors.registrationMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.registrationMessage}
          </h2>
        )}
        <form onSubmit={this.registerUser} id="loginForm">
          <button
            type="button"
            className="link-button-to-login"
            onClick={() => { this.props.dispatch({ type: 'SET_TO_LOGIN_MODE' }) }}
          >
            <i class="fas fa-arrow-left"></i>
          </button>
          <h1>Register User</h1>
          <div className="userNameDiv">
            <label htmlFor="username">
              Username:<br />
              <input
                type="text"
                name="username"
                className="userNameInput input"
                value={this.state.username}
                onChange={this.handleInputChangeFor('username')}
              />
            </label>
          </div>
          <div className="userNameDiv">
            <label htmlFor="password">
              Password:<br />
              <input
                className="userNameInput input"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChangeFor('password')}
              />
            </label>
          </div>
          <div className="userNameDiv">
            <label htmlFor="phoneNumber">
              Phone Number: 1+<br />
              <input
                className="userNameInput input"
                type="number"
                name="phoneNumber"
                value={this.state.phoneNumber}
                onChange={this.handleInputChangeFor('phoneNumber')}
              />
            </label>
          </div>
          <div>
            <input
              className="log-in"
              type="submit"
              name="submit"
              value="Register"
            />
          </div>

        </form>
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(RegisterPage);

