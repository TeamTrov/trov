import React from 'react';
import render from 'react-dom';
var axios = require('axios');

class Auth extends React.Component {

  handleLogInButtonClick() {
    // axios.({
    //   url: 'trov.herokuapp.com/auth/facebook',
    //   headers: {"Access-Control-Allow-Origin": "*"}
    // });
  }

  render () {
    return (
    <div id="auth">
    <h1>Log in to Trov</h1>

  <a
    className="btn btn-block btn-social btn-facebook"
    id="fb-button"
    onClick={this.handleLogInButtonClick} >
      <span className="fa fa-facebook"></span> Log in with Facebook
    </a>
    </div>
    )
  }
}

export default Auth;
