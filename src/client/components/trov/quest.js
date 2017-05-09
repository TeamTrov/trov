import React from 'react';
import render from 'react-dom';


class Quest extends React.Component {
  constructor () {
    super();
  }
  render () {
    return (
    <div className="quest">
    <ol>
      <li>Dolores Park</li>
      <li>Tartine Bakery</li>
      <li>Project Juice</li>
      <li>Humphrey Slocombe</li>
    </ol>
    </div>
    )
  }
}

export default Quest;
