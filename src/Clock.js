import React, { Component } from 'react';
import SlideShow from "./SlideShow";



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

export default Clock;