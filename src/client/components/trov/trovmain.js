import React from 'react';
import render from 'react-dom';
import Troves from './troves.js';
import Footer from '../footer.js';

class TrovMain extends React.Component {
  constructor () {
    super();
  }
  render () {
    return (
    <div id="trovmain">
      <Troves />
      <Footer />
    </div>
    )
  }
}

export default TrovMain;
