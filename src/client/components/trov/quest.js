import React from 'react';
import render from 'react-dom';


class Quest extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    return (
    <li className={this.props.displayType}>{this.props.challenge}</li>
    )
  }
}

export default Quest;
