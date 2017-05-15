import React from 'react';
import render from 'react-dom';
import TrovMain from './trovmain.js';
const challenges = require('./missionmeltdown.js');
const tahoe = require('./tahoe.js');

class Troves extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userTrovs: '',
      challenges: [],
      trovNames: 'Trov Name',
      currentChallengeNum: this.props.progress
    }
    this.props.getUserData();
  }
  componentWillReceiveProps (newProps){
    this.setState({
      userTrovs: newProps.userTrovs,
      challenges: newProps.userTrovs.challenges,
      trovNames: newProps.userTrovs.currTrov[0].trovId,
      currentChallengeNum: newProps.progress
    });
  }
  render () {
    return (
    <div className="troves">
      <h1>Your Troves</h1>
      <TrovMain challenges={this.state.challenges} trovName={this.state.trovNames} completeChallenge={this.props.completeChallenge} progress={this.props.progress} username={this.props.username}/>
    </div>
    )
  }
}

export default Troves;
