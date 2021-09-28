import isElectron from 'is-electron';
import React, {Component, useState} from 'react';
import request from "superagent";



class onepage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        const self = this;


        fetch('https://monitors.viterbo.edu/scrape/' + this.props.data)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.items
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

        request
            .get('https://monitors.viterbo.edu/statics/' + this.props.data)
            .then((res) => {
                this.setState({
                    data: res,
                    feed: 0,
                })
            })
            .catch(err => {
                // err.message, err.response
            });
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return <div className={'grid'}>
                {items.map(item => (
                    <div className={'cell'}>
                        <hx>{item.title}</hx>
                        <ul>
                            <li>
                                {item.calories}
                            </li>
                            <li>
                                {item.details}
                            </li>
                        </ul>

                    </div>
                ))}
            </div>;
        }
    }
}


export default onepage;