import React from 'react';
import {render} from 'react-dom';
import {VisitorMain} from './visitormain';

var ajax = require('./ajax.js');

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isOnTrovNow: false,
      currentTrov: {},
      currentChallengeNum: 0
    }
  }

  componentWillMount() {
    //will need to access db and set state with current Trov and progress here
    navigator.geolocation.getCurrentPosition(function(ps) {
      window.loc = ps;
      console.log('loc: ', ps);
    });
  }

  handleCheckLocButtonClick () {
    //checks if window.loc is acceptably close to this.state.currentTrov coordinates
    //gets passed down to trovmain
  }

  render () {
    //conditional renders here . . . ie if statements, will check isLoggedIn and isOnTrovNow
    return (
      <VisitorMain/>
      )
  }
}
