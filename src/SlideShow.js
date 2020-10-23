import React, { Component } from 'react';



class SlideShow extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.interval = null;

    }

    componentDidMount() {
        this.interval = setInterval(this.transitionToNextSlide.bind(this), 3400);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    transitionToNextSlide() {
        this.setState({slideIndex: (this.state.slideIndex + 1) % this.props.slides.length})
    }


        render()
        {
            let containerStyle = {
                width: '100%'
            };

            return (
                <div style={containerStyle}>
                    <Slide slide={this.props.slides[this.state.slideIndex]}/>
                </div>
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
            <div className="ggg">
                <img src={'https://www.viterbo.edu' + this.props.slide.field_scroller_image} alt={this.props.imageAlt} />

            </div>
        );
    }
}




