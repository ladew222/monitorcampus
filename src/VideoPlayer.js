
import React from 'react';
import ReactDOM from 'react-dom';
import ReactJWPlayer from 'react-jw-player';

export default class VideoPlayer extends React.Component {
    componentDidUpdate() {

    }
    render() {
        return (

            <ReactJWPlayer
                playerId='my-unique-id'
                playerScript='https://cdn.jwplayer.com/libraries/hx9WAY7D.js'
                file='https://monitors.viterbo.edu/vid/file.m3u8'
            />
        );
    }
}