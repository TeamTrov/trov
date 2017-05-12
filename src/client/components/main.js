import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import {VisitorMain} from './visitormain.js';
import {UserNoTrovMain} from './usernotrov/usernotrovmain.js';
import {TrovMain} from './trov/trovmain.js';
import {Map} from './map.js'
import testTrov from './exampleTrovData.js';


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isOnTrovNow: false,
      allTrovs: [],
      currentTrov: null,
      currentChallengeNum: 0
    }
    console.log("Main Logged In? " + this.props.loggedIn);
  }

  componentWillReceiveProps(newProps) {
    this.setState({isLoggedIn: newProps.loggedIn});
  }

  componentWillMount() {

    navigator.geolocation.getCurrentPosition(function(ps) {
      window.loc = ps;
      console.log('loc: ', ps);
    });
  }

  handleSelectTrov () { //how to insert trov as parameter???
    console.log('handleSelectTrov');
    if (this.state.isLoggedIn) {
      this.setState({
        isOnTrovNow: true,
        currentTrov: testTrov //change me when we can select new trovs!!!!
      })
    }
  }

  handleCompleteChallenge () {
    console.log('handleCompleteChallenge');
    if (this.state.currentTrov && this.state.isLoggedIn) {
      if (this.state.currentChallengeNum >= this.state.currentTrov.challenges.length-1) {
        this.setState({
          isOnTrovNow: false,
          currentTrov: null,
          currentChallengeNum: 0
        })
      } else {
        var newCurrentChallengeNum = this.state.currentChallengeNum+1;
        this.setState({
          currentChallengeNum: newCurrentChallengeNum
        })
      }
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
      return <VisitorMain />
    } if (!this.state.isOnTrovNow && this.state.isLoggedIn) {
      return (<div>
          <UserNoTrovMain />
            allTrovs={this.state.allTrovs}
            handleSelectTrov={this.handleSelectTrov.bind(this)}
            <button onClick={this.getAllTrovs.bind(this)}>Test Yer Get</button>
            </div>)
    } else if (this.state.isOnTrovNow && this.state.isLoggedIn) {
      return <TrovMain
        currentTrov={this.state.currentTrov}
        currentChallengeNum={this.state.currentChallengeNum}
        handleCompleteChallenge={this.handleCompleteChallenge.bind(this)}
        handleCompleteTrov={this.handleCompleteTrov.bind(this)}
      />
    }
  }
    // TEST AREA: delete me if not needed

  //   return (
  //
  //     <div id="trovmain">
  //       <h1>test buttons</h1>
  //       <div>currentTrov: {this.state.currentTrov ? this.state.currentTrov.name : 'none'} </div>
  //       <div>currentChallengeNum: {this.state.currentChallengeNum}</div>
  //       <button onClick={this.handleSelectTrov.bind(this)}>Select Trov (testTrov)</button>
  //       <button onClick={this.handleCompleteChallenge.bind(this)}>Complete Challenge</button>
  //       <button onClick={this.handleCompleteTrov.bind(this)}>Complete Trov</button>
  //       <div><Map /></div>
  //       <div>[GoogleMap goes here]</div>
  //       <div id='visitor-main'>{this._renderVisitorMain()}</div>
  //       <div id='user'>{this._renderUser()}</div>
  //     </div>
  //   )
  // }
  //


  addNewUserToDB (username, email, location) {
    var newUser = {
      username: username,
      email: email,
      location: location
    }
    axios.post('http://localhost:3000/addnewusertodb', newUser)
      .then(function() {
        console.log('user added');
      })
  }

  getAllTrovs () {
    var newTrovArray;
    axios.get('http://localhost:3000/getalltrovs')
      .then(function(trovArray) {
        newTrovArray = JSON.parse(trovArray);
        console.log('getAllTrovs returns newTrovArray: ', newTrovArray);
    })
    this.setState({
      allTrovs: newTrovArray
    })
  }

  updateUserTrov (trovName, currentChallengeNum) {
    var updatedTrovInfo = {
      trovName: trovName,
      currentChallengeNum: currentChallengeNum
    }
    axios.post('http://localhost:3000/updateusertrov', updatedTrovInfo)
      .then(function() {
        console.log('user trov data updated');
      })
  }

}

export default Main;
