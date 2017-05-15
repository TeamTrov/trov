import React from 'react';
import render from 'react-dom';
import Trov from './trov.js';
const tahoe = require('./tahoe.js');

class UserNoTrovMain extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      allTrovs: this.props.allTrovs
    }
  }
  componentWillReceiveProps (newProps){
    this.setState({
      allTrovs: newProps.allTrovs
    });
  }
  render () {
    return (
    <div className="troves" id="usernotrovmain">
      <h1>All Trovs</h1>
      {this.state.allTrovs.map((trov, trovId) => <Trov selectTrov={this.props.selectTrov} username = {this.props.username} challenges={trov} trovName={trov.name} key={trovId} />)}
    </div>
    )
  }
}

export default UserNoTrovMain;
