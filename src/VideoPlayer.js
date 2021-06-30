
import React from "react";
import ReactDOM from 'react-dom';
import ReactHlsPlayer from 'react-hls-player';
export default class VideoPlayer extends React.Component {
    componentDidUpdate() {

    }
    render() {
        return (
            <ReactHlsPlayer
                src="https://monitors.viterbo.edu/vid/file.m3u8"
                hlsConfig={{
                    maxLoadingDelay: 4,
                    autoPlay: true,
                    minAutoBitrate: 0,
                    lowLatencyMode: true,
                }}
            />
        );
    }
}