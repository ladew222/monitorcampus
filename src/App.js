import React, { Component } from 'react';
import request from 'superagent';
import logo from './logo-red.svg';
import './App.css';
import Slider from "react-slick";  //slider library loaded via npm
import Sound from 'react-sound';  //sound library loaded via npm

//centering inline css for slide
let fillimg = {
  width:'90vw',
  height:'80vh'
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    }

    //http://viterbouniveristyd8dev.prod.acquia-sites.com/
    this.server_name="http://viterbouniveristyd8dev.prod.acquia-sites.com/";

    this.fetchPhotos = this.fetchPhotos.bind(this)  //needed for reference below
    this.checkAlert = this.checkAlert.bind(this)  //needed for reference below
    this.isAlert=false;
  }

  componentWillMount() {
    this.fetchPhotos();
    var intervalId = setInterval((this.fetchPhotos), 180000); // 3 minutes in milliseconds
    var intervalId2 = setInterval((this.checkAlert),  10000); // 10 seconds
  }

  fetchPhotos() {  //call api from drupal to get slides, stores in photos
    request
        .get(this.server_name + 'm1')
        .then((res) => {
      this.setState({
      photos: res.body
    })
  })
  }
  checkAlert() {  //checks libservices for alert json string to see if active
    request
        .get('http://libservices.viterbo.edu/al/alerts/site.php')
        .then((res) => {
      var rslts = JSON.parse(res.text)
      if (rslts.status === true){ ///las
      console.log('alert');
      this.isAlert=true;
      var alert ={title: "alert",body: "testing 123 asdfasdfasdfasdfasdf asddfasdfasfdsa", nid:"001",field_event_image:"attention-clipart.jpg",field_location_name:"Notice"};
      //var newPlayer = Object.assign({}, player, {score: 2});
      this.server_name="/";
      var newArray= [];
      newArray.push(alert);
      this.setState({
        photos: newArray
      })
    }
  else{
      this.isAlert=false;
      console.log('no alert');

    }
  })

  }

  render() {
    const isAlert = this.isAlert;
    const sound = isAlert ? ( //if alert play sound
    <Sound
        url="/alarm.wav"
    playStatus={Sound.status.PLAYING}
    playFromPosition={0 /* in milliseconds */}
    onLoading={this.handleSongLoading}
    onPlaying={this.handleSongPlaying}
    onFinishedPlaying={this.handleSongFinishedPlaying}
  />
  ) : (
    <nosound/>
  );
    var speed=11000; //set speed based on variable hardcoded now
    if (this.state.photos.length>0){
      speed=this.state.photos[0].Speed;
    }
    var settings = {
      dots: false,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      speed: 1000,
      autoplaySpeed: 5000,
      cssEase: "linear",
      arrows: false,
    };
    return (

        <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        </header>
        <div className="outer">
        {sound}
        <Slider {...settings}>
          {this.state.photos.map((photo, key) => { //loop through photos to output each photo inside slider widget
          return (
              <div key={photo.nid} className="slide-outer">
                  {console.log(photo)}
              <div className="slide-container">
              {photo.Type === 'Event' ? ( //differnt content depending on type
                <div>
                <h1 >{photo.title}</h1>
                <img alt="banner" className="scroll-img" src= {this.server_name + photo.field_event_image}/>
                <h4>{photo.field_event_dates}</h4>
                <h4>{photo.field_location_name}</h4>
                <p></p>
                <p>{photo.body}</p>
                </div>
              ) : (
                <div>
                <img alt="banner" className="scroll-img" style={fillimg} src= {this.server_name + photo.field_banner_image}/>
                </div>
              )}
              </div>
              </div>
              )
          })}
        </Slider>
      </div>
      </div>
      );
  }
}

export default App;