import React from 'react';
import render from 'react-dom';
import Trov from './trov.js';


export default class Troves extends React.Component {
  constructor () {
    super();
  }
  render () {
    return (
    <div id="troves">
      <h1> Your Troves</h1>
      <Trov />
    </div>
    )
  }
}
