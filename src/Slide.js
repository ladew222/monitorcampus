import React from 'react';

class Slide extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={classes}>
                <img src={this.props.slide.imagePath} alt={this.props.imageAlt} />
                <h2>{this.props.slide.title}</h2>

            </div>
        );
    }
}

export default Slide;