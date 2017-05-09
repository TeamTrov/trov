import React from 'react';
import render from 'react-dom';
import Quest from './quest.js';


export default class Trov extends React.Component {
  constructor () {
    super();
  }
  render () {
    return (
    <div id="trov">
      <h2>Mission Meltdown</h2>
      <Quest />
    </div>
    )
  }
}
