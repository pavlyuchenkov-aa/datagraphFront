import React, { Component } from 'react'
import './zoom-style.css';
export default class ZoomControlButtons extends Component {
  constructor() {
      super();
      this.state = {};
  }
  
  render() {
    
      const {
          onZoomIn,
          onZoomOut
      } = this.props;

      return (
          <div id="zoom-controls">
              <div id="in" className="c-button" onClick={onZoomIn}>
                  <div className="c-ripple js-ripple">
                      <span className="c-ripple__circle"></span>
                      <svg id="plus-svg" width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><title>Zoom In</title><path d="M13.5 11.5v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z" fill="rgba(0, 0, 0, 0.4)" fillRule="evenodd"/></svg>
                  </div>
              </div>
              <div id="out" className="c-button" onClick={onZoomOut}>
                  <div className="c-ripple js-ripple">
                      <span className="c-ripple__circle"></span>  
                      <svg id="minus-svg" width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><title>Zoom Out</title><path d="M11.5 7.5h2v10h-2z" fill="rgba(0, 0, 0, 0.4)" fillRule="evenodd"/></svg>
                  </div>
              </div>
          </div> 
      )
  }
}