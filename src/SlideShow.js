import isElectron from 'is-electron';
import React, {Component, useState} from 'react';
import request from "superagent";



class SlideShow extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            slideIndex: 0,
            isMap:0,
            isOverview:0,
        };
        this.interval = null;

    }


    componentDidMount() {
        const self = this;
        this.interval = setInterval(this.transitionToNextSlide.bind(this), this.props.speed);
        if (isElectron()) {
            window.require('electron').ipcRenderer.on('am', function (event, data) {
                const inp = data.trim();
                console.log('Message received');
                console.log(data);
                // ... change the state of this React component.
                if (inp == "Left") {
                    console.log("Going Left:");
                    let new_index = 0;
                    //self.setState({ slideIndex: (this.state.slideIndex + (this.state.slideIndex -1)) % this.props.slides.length });
                    //ucCounter=(ucCounter + (60 - 1)) % 60;
                    if (self.state.slideIndex !== undefined) {
                        if (self.state.slideIndex < 1) {
                            self.setState({slideIndex: (self.props.slides.length-1)});
                            console.log("to Top");
                        } else {
                            self.setState({slideIndex: (self.state.slideIndex - 1)});
                            console.log("Subtract");
                        }
                    }
                    console.log("Current Slide:"+ self.state.slideIndex)
                }
                if (inp == 'Right') {
                    console.log("Going Right:");
                    self.transitionToNextSlide();

                }
                if (inp == 'Up') {
                    console.log("Going Map");
                    self.setState({isMap: 1});
                }
                if (inp == 'Down') {
                    console.log("Overview");
                    self.setState({isOverview: 1});
                }
                if (inp == 'AntiClockwise') {

                }

            });
        }
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }


    transitionToNextSlide() {
        this.setState({slideIndex: (this.state.slideIndex + 1) % this.props.slides.length});
        console.log("Next Slide");
        console.log("Current Slide:"+ this.state.slideIndex);
        this.setState({isMap: 0});
        this.setState({isOverview: 0});
        request
            .get('https://monitors.viterbo.edu/alerts/reportslide.php?monitor=' + this.props.monitor +  "&slide=" + this.state.slideIndex)
            .then((res) => {

            })
            .catch(err => {
                // err.message, err.response
            });

        //console.log('https://monitors.viterbo.edu/alerts/reportslide.php?monitor=' + monitor  + "&slide=" + currentSlide)

    }


    render()
    {
        let containerStyle = {
            width: '100%'
        };
        const { slideIndex, isMap } = this.state;
        const Overview = this.state.isOverview;
        let widget;
        if (Overview == 0){
            widget = <ul id={"evt-lst"}>
                {this.props.slides.map(function(item) {
                    return <li id="evt-itm" key={item.nid}> <div id="left">{item.field_event_date}</div>
                        <div id="right">{item.title}</div></li>;
                })}
            </ul>

        }
        else{
            widget = <Slide slide={this.props.slides[this.state.slideIndex]} alt={this.props.imageAlt}
                            mode={this.state.isMap}/>;

        }

        return (

            <div>{widget}</div>
        );
    }

}

export default SlideShow;




class Slide extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="outer">

                {this.props.mode
                    ? <div className="slide-container">
                        <img src={'https://monitors.viterbo.edu/resources/CampusMap.jpeg'} alt={this.props.imageAlt} />
                    </div>
                    : <div className="slide-container">
                        <img src={'https://www.viterbo.edu' + this.props.slide.field_scroller_image} alt={this.props.imageAlt} />
                    </div>
                }


            </div>
        );
    }
}


class Grid extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="outer">
                <ul>
                    {this.props.map(function(item) {
                        return <li key={this.props.title}>{this.props.title}</li>;
                    })}
                </ul>
            </div>
        );
    }
}