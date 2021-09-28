import React, { Component } from 'react';
import { useState } from 'react';
import request from 'superagent';
import logo from './logo-red.svg';
import './App.css';
import SlideShow from './SlideShow';
import  Clock from './Clock'
import { Player } from 'video-react';
import HLSSource from './HLSSource';
import VideoPlayer from "./VideoPlayer";
import Menu from "./Menu";



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert:'',
      isAlert: false,
      isLoaded: false,
      static: '',
      photos: [],
      feed:0,

    }
    //http://viterbouniveristyd8dev.prod.acquia-sites.com/
    this.server_name="https://www.viterbo.edu/";
    this.video_feed ="http://vuwebcam.viterbo.edu/mjpg/video.mjpg"
    var urlParams = new URLSearchParams(window.location.search);
    this.monitor = urlParams.get('monitor');
    //this.monitor='comm';
    this.fetchPhotos = this.fetchPhotos.bind(this)  //needed for reference below
    this.checkAlert = this.checkAlert.bind(this)  //needed for reference below
      // this.reportStatus = this.reportStatus.bind(this)  //needed for reference below
    this.slide_num = 0;
  }


  componentDidMount() {
   this.fetchPhotos();
    this.reportStatus();
    setInterval((this.fetchPhotos), 180000); // 3 minutes in milliseconds
    setInterval((this.checkAlert),  8000); // 8 seconds\
    setInterval((this.reportStatus),  95000); // 95 seconds
  }

  componentDidUpdate() {


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
      const url = new URL(window.location.href);
      const monitor = url.searchParams.get("monitor");
      const report = url.searchParams.get("report");
      if ("1" === "1") {
          ///  var curr = $('.slick-track').children('.slick-slide').css('opacity','1');
          request
              .get('https://monitors.viterbo.edu/api/reportstatus.php?monitor=' + monitor + "&status=" + 0 + "&slide=" + this.slide_num)
              .then((res) => {
                  console.log(res.text);

              })
              .catch(err => {
                  // err.message, err.response
              });
          }
  }
  checkAlert() {  //checks libservices for alert json string to see if active
      const url = new URL(window.location.href);
      const monitor = url.searchParams.get("monitor");
      var randomstring = require("randomstring");
    request
          .get('https://monitors.viterbo.edu/api/feeds.php?monitor='+ monitor +'&'+ randomstring.generate(4) )
          .then((res) => {
              let rslts = JSON.parse(res.text);
              let was = this.state.alert;
              this.setState({
                  isAlert: rslts.alert,
                  message: rslts.msg,
                  feed: rslts.feed,
                  static: rslts.static
              })
              //video off
              if (was == 5 && this.state.alert !=5){
                  window.require('electron').ipcRenderer.send('no_mon', 'reboot');
              }
              //video on
              if (was != 6 && this.state.alert == 6){
                  window.require('electron').ipcRenderer.send('mon', 'reboot');
              }

              if (this.state.feed == 4){
                  window.require('electron').ipcRenderer.send('am', 'reboot');
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

    let widget;

      switch(this.state.isAlert) {
          case "0":
              widget =
                  <div className="App">
                  <header className="App-header"  style={{ padding: tpad+"px"}}>
                      <img src={logo} className="App-logo" alt="logo" />
                      <Clock />
                  </header>
                  <div className="outer">

                      {isLoaded
                          ? <SlideShow slides={this.state.photos} monitor={this.monitor} speed={12000} />
                          : <div>Waiting</div>
                      }
                  </div>
              </div>
              break;
          case "1":
              widget = <div className="slide-container">
                  <div className="inner-slide event">
                      <h1 className="evt-head" >Viterbo Alert</h1>
                      <img className="scroll-img evt-img" src='attention-clipart.jpg' ma/>
                      <h2 className="evt-body">{this.state.message}</h2>
                  </div>
              </div>
              break;
          case "2":
              widget =  <div className="photo-container">
                  <img className="ext-img" src={ 'https://monitors.viterbo.edu/imgs/' + this.state.message } />
              </div>
              break;
          case "3":
              widget =  <VideoPlayer/>
              break;
          case "4":
              widget = <div className="slide-container">
                  <div className="inner-slide event">
                      <h1>Rebooting...</h1>
                  </div>
              </div>
              break;
          case "5":
              widget =
              <div className="App">
                  <Menu data={this.state.static}  />
              </div>
              break;
          default:
              widget =
                  <div className="App">
                      <header className="App-header"  style={{ padding: tpad+"px"}}>
                          <img src={logo} className="App-logo" alt="logo" />
                          <Clock />
                      </header>
                      <div className="outer">

                          {isLoaded
                              ? <SlideShow slides={this.state.photos} monitor={this.monitor} speed={12000} onChangeSlide={this.handleChangeSlide} />
                              : <div>Waiting</div>
                          }

                      </div>
                  </div>
      }


      return(

          <div>{widget}</div>
      );
  }
}

export default App;