import React from 'react';
import ReactDOM from 'react-dom';
import Header from './header.js'
import VisitorMain from './visitormain';
import TrovMain from './trov/trovmain.js';
import Sidebar from './sidebar';
import Main from './main.js';
import Footer from './footer.js';
var axios = require('axios');

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      username: "",
    }
  }

  componentWillMount () {
    var context = this;
    axios.get('http://trov.herokuapp.com/getcurrentuser')
    .then(function(user) {
      console.log('Searching for logged-in user...');
      var userName = user.data;
      console.log(`Current user: ${userName}`);
      context.setState({
        isLoggedIn: true,
        username: userName
      });
    })
    .catch(function(error) {
      console.log('Unable to communicate with server', error);
    });
  }

  handleLogIn () {
    // handled by componentWillMount and DB query
  }

  handleLogOut () {
    // handled by componentWillMount
  }

  render () {
    return (
      <div id="main">
        <Header username={this.state.username} login={this.handleLogIn} logout={this.handleLogOut} />
        <Main
          username={this.state.username}
          handleLogIn={this.handleLogIn.bind(this)}
          loggedIn={this.state.isLoggedIn}/>
        <Sidebar loggedIn={this.state.isLoggedIn} login={this.handleLogIn.bind(this)} logout={this.handleLogOut.bind(this)} />
        <Footer />
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
