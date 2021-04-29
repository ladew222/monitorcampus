import React, { Component } from 'react';
import { useState } from 'react';
import request from 'superagent';
import logo from './logo-red.svg';
import './App.css';
import SlideShow from './SlideShow';
import  Clock from './Clock'
import  IpcExample from './ipcExample'



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert:'',
      isAlert: false,
      isLoaded: false,
      photos: [],

    }
    //http://viterbouniveristyd8dev.prod.acquia-sites.com/
    this.server_name="https://www.viterbo.edu/";
    this.video_feed ="http://vuwebcam.viterbo.edu/mjpg/video.mjpg"
    var urlParams = new URLSearchParams(window.location.search);
    this.monitor = urlParams.get('monitor');
    this.monitor='comm';
    this.fetchPhotos = this.fetchPhotos.bind(this)  //needed for reference below
    this.checkAlert = this.checkAlert.bind(this)  //needed for reference below
      // this.reportStatus = this.reportStatus.bind(this)  //needed for reference below
    //this.slide_num = 0;
  }

    componentWillMount() {

    }

  componentDidMount() {
   this.fetchPhotos();
    this.reportStatus();
    setInterval((this.fetchPhotos), 180000); // 3 minutes in milliseconds
    setInterval((this.checkAlert),  8000); // 8 seconds\
    setInterval((this.reportStatus),  95000); // 95 seconds
  }

  fetchPhotos() {  //call api from drupal to get slides, stores in photos
    var randomstring = require("randomstring");
    randomstring.generate(7);
    request
        .get(this.server_name + this.monitor +'?'+ randomstring.generate(4))
        .then((res) => {
              this.setState({
              isLoaded: true,
              photos: res.body
            })
        })
        .catch(err => {
            // err.message, err.response
        });
  }
  reportStatus() {  //call api from drupal to get slides, stores in photos
      var url = new URL(window.location.href);
      var monitor = url.searchParams.get("monitor");
      var report = url.searchParams.get("report");
      if ("1" === "1") {
          ///  var curr = $('.slick-track').children('.slick-slide').css('opacity','1');
          request
              .get('https://monitors.viterbo.edu/alerts/reportstatus.php?monitor=' + monitor + "&status=" + 0 + "&slide=" + 1)
              .then((res) => {

              })
              .catch(err => {
                  // err.message, err.response
              });
          }
  }
  checkAlert() {  //checks libservices for alert json string to see if active
    request
          .get('https://monitors.viterbo.edu/alerts/site.php')
          .then((res) => {
              var rslts = JSON.parse(res.text);
              if (rslts.status === true) { ///las
                  this.setState({
                      isAlert: true,
                      alert: rslts.message
                  })
              }
              if ((rslts.status === false) && this.state.isAlert){
                  this.setState({
                      isAlert: false,
                      alert: ''
                  })
              }
          })
          .catch(err => {
            // err.message, err.response
         });
  }

  render() {
    const tpad = this.padtop;
    const isAlert = this.state.isAlert;
    const { isLoaded, photos } = this.state;

      if (this.state.isAlert) {
          return (
              <div className="slide-container">
                  <div className="inner-slide event">
                      <h1 className="evt-head" >Viterbo Alert</h1>
                      <img className="scroll-img evt-img" src='attention-clipart.jpg' ma/>
                      <h2 className="evt-body">{this.state.alert}</h2>
                  </div>
              </div>
          );
      }

      return(

        <div className="App">
        <header className="App-header"  style={{ padding: tpad+"px"}}>
        <img src={logo} className="App-logo" alt="logo" />
        <Clock />
        </header>
            <IpcExample />
        <div className="outer">

            {isLoaded
                ? <SlideShow slides={this.state.photos} monitor={this.monitor} speed={12000} />
                : <div>Waiting</div>
            }


        </div>
        </div>
      );
  }
}

export default App;