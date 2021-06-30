
import React from "react";
import Hls from "hls.js";
export default class VideoPlayer extends React.Component {
    state = {};
    componentDidUpdate() {
    const video = this.player;
       let config = {
            maxMaxBufferLength: 1,
            liveSyncDuration: 0.5,
            liveMaxLatencyDuration: 1,
            liveBackBufferLength: 0,
            nudgeMaxRetry: 10
        };
        const hls = new Hls(config);
        const url = "https://monitors.viterbo.edu/vid/file.m3u8";

        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() { video.play(); });
    }
    render() {
        return (
            <video
                className="videoCanvas"
                ref={player => (this.player = player)}
                autoPlay={true}
            />
        );
    }
}