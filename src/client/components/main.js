import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import {VisitorMain} from './visitormain.js';
import UserNoTrovMain from './trov/usernotrovmain.js';
import Troves from './trov/troves.js';
import {Map} from './map.js'
import testTrov from './exampleTrovData.js';


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isOnTrovNow: '',
      username: '',
      allTrovs: [],
      userTrovs: [],
      currentTrov: null,
      currentChallengeNum: 0
    };
    this.getAllTrovs();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      isLoggedIn: newProps.loggedIn,
      username: newProps.username
    });
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(function(ps) {
      window.loc = ps;
      console.log('loc: ', ps);
    });
    this.getUserData();
    if (this.state.userTrovs != []) {
      this.setState({
        isOnTrovNow: true
      });
    }
  }

  handleSelectTrov () { //how to insert trov as parameter???
    console.log('Trov selected!');
    if (this.state.isLoggedIn) {
      this.setState({
        isOnTrovNow: true,
      });
    }
  }

  handleCompleteChallenge () {
    var completed = this.state.currentChallengeNum + 1;
    this.setState({
      currentChallengeNum: completed
    });
    if (completed === this.state.userTrovs.currTrov[0].totalChallengesNo) {
      //Adjust state to prevent Trov component from rendering button
    }
  }

  handleCompleteTrov () {
    console.log('handleCompleteTrov');
    this.setState({
      isOnTrovNow: false,
      currentTrov: null,
      currentChallengeNum: 0
    })
  }


  render() {
    // conditional renders here . . . ie if statements, will check isLoggedIn and isOnTrovNow
    if (!this.state.isLoggedIn) {
      return <VisitorMain
        handleLogIn={this.props.handleLogIn}
      />
    } else if (!this.state.isOnTrovNow && this.state.isLoggedIn) {
      return <UserNoTrovMain allTrovs={this.state.allTrovs} selectTrov={this.handleSelectTrov.bind(this)} username={this.state.username} />
    } else if (this.state.isOnTrovNow && this.state.isLoggedIn) {
      return <Troves userTrovs={this.state.userTrovs}
                     getUserData={this.getUserData.bind(this)}
                     completeChallenge={this.handleCompleteChallenge.bind(this)}
                     username={this.state.username}
                     progress={this.state.currentChallengeNum} />
    }
  }


  addNewUserToDB (username, email, location) {
    var newUser = {
      username: username,
      email: email,
      location: location
    }
    axios.post('http://trov.herokuapp.com/addnewusertodb', newUser)
      .then(function() {
        console.log('user added');
      })
  }

  getAllTrovs () {
    var context = this;
    axios.get('http://trov.herokuapp.com/getalltrovs')
      .then(function(trovArray) {
        context.setState({
          allTrovs: trovArray.data
        });
    })
    .catch(function(error) {
        console.log('Unable to communicate with server', error);
    });
  }

  getUserData () {
    var context = this;
    var processedUsername = this.state.username.split(' ').join('+');
    axios.get(`http://trov.herokuapp.com/getuserdata?id=${processedUsername}`)
      .then(function(userTrovArray) {
        console.log(userTrovArray);
        if (userTrovArray.data !== "User not currently on a trove!") {
          context.setState({
            userTrovs: userTrovArray.data,
            currentChallengeNum: userTrovArray.data.currTrov[0].currentChallengeNo
          });
        } else {
          context.setState({
            isOnTrovNow: false,
            userTrovs: [],
            currentChallengeNum: 0
          });
        }
    })
    .catch(function(error) {
        console.log('Unable to communicate with server', error);
    });
  }

  updateUserTrov (trovName, currentChallengeNum) {
    var updatedTrovInfo = {
      trovName: trovName,
      currentChallengeNum: currentChallengeNum
    }
    axios.post('http://trov.herokuapp.com/updateusertrov', updatedTrovInfo)
      .then(function() {
        console.log('user trov data updated');
      })
  }

}

export default Main;
