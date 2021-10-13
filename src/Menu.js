import isElectron from 'is-electron';
import React, {Component, useState} from 'react';
import request from "superagent";
import { Textfit } from 'react-textfit';


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
        const vegan = 'https://viterbo.campusdish.com/-/media/Global/All%20Divisions/Dietary%20Information/Vegan-80x80.png';
        const vegi= 'https://viterbo.campusdish.com/-/media/Global/All%20Divisions/Dietary%20Information/Vegan-80x80.png';
        const { error, isLoaded, items } = this.state;

        const name = this.props.data.split('.')[0].toUpperCase();

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return <div className={'container-fluid py-5'}>
                <div className={'row'}>
                    <div className={'col-lg-10 mx-auto col-12 text-center mb-3'}>
                        <h1 className={'mt-0 tf'}>{name}</h1>
                        <hr className="accent my-5"></hr>
                    </div>
                    <div className={"card-columns"}>
                {items.map(item => (
                    <div className={'card X'}>
                        <span className={'float-right font-weight-bold'}>{item.calories}</span>
                        <h6 className={'text-truncate'}>{item.title}</h6>
                        <p className={'small'}>{item.details}</p>
                            {item.isvegan
                                ? <div className={"font-weight-bold small"}><img src={vegan}/></div>
                                : <span/>
                            }
                            {item.isvegetarian
                                ? <div><img src={vegi}/></div>
                                : <span/>
                            }
                    </div>
                ))}
            </div>
            </div>
            </div>;
        }
    }
}


export default onepage;