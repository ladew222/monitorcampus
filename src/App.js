import React, { Component } from 'react';
import { useState } from 'react';
import request from 'superagent';
import logo from './logo-red.svg';
import './App.css';
import SlideShow from './SlideShow';


//centering inline css for slide
let fillimg = {
  width:'90vw',
  height:'80vh'
}

const options = {
    timeZone:"Canada/Central",
    hour12 : true,
    hour:  "numeric",
    minute: "numeric",seconds:"numeric"
}




class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div id="clk">
                <h2>{this.state.date.toLocaleTimeString("en-US",options)}</h2>
            </div>
        );
    }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      photos: []
    }
    //http://viterbouniveristyd8dev.prod.acquia-sites.com/
    this.server_name="https://www.viterbo.edu/";
    this.video_feed ="http://vuwebcam.viterbo.edu/mjpg/video.mjpg"
    var urlParams = new URLSearchParams(window.location.search);
    this.monitor = urlParams.get('monitor');
    this.monitor='comm';
    this.vid = urlParams.get('video');
    this.exit = urlParams.get('exit');
    this.exit_img = "https://monitors.viterbo.edu/"+ this.exit +".jpg"
    this.padtop = urlParams.get('pad');
    this.fetchPhotos = this.fetchPhotos.bind(this)  //needed for reference below
    this.checkAlert = this.checkAlert.bind(this)  //needed for reference below
      // this.reportStatus = this.reportStatus.bind(this)  //needed for reference below
    this.isAlert = false;
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
        var rslts = JSON.parse(res.text)
        if (rslts.status === true){ ///las
            this.isAlert=true;
            this.isVideo=false;
            this.isExit=false;
            var msg = rslts.message;
            this.server_name="https://monitors.viterbo.edu/alerts/";
            var alert ={title: "alert",body: msg, nid:"001",field_event_image:"attention-clipart.jpg",field_location_name:"Notice",type:"Alert"};
            //var newPlayer = Object.assign({}, player, {score: 2});
            var newArray= [];
            newArray.push(alert);
            this.setState({
              photos: newArray
            })
        }
        else{
            this.isAlert=false;
            this.isVideo = false;
            this.isExit = false;
            if (this.vid==="1" && rslts.video===true){
                this.isVideo = true;
                this.forceUpdate();
            }
            else if(this.exit && this.exit.length>0 && rslts.exit===true){
                this.isExit= true;
                this.forceUpdate();
            }
            else{
                this.isVideo = false;
            }
            if(this.isAlert===true){
              this.isAlert=false;
              window.location.reload();
            }
              this.isAlert=false;
            }
        })
  }

  render() {
    const tpad = this.padtop;
    const isAlert = this.isAlert;
    const { isLoaded, photos } = this.state;

      return(

        <div className="App">
        <header className="App-header"  style={{ padding: tpad+"px"}}>
        <img src={logo} className="App-logo" alt="logo" />
        <Clock />
        </header>
        <div className="outer">
            {isLoaded
                ? <SlideShow slides={this.state.photos} monitor={this.monitor} />
                : <div>Waiting</div>
            }


        </div>
        </div>
      );
  }
}

export default App;