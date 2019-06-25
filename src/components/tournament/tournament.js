import React from 'react';

import {NavigationBar} from "../based_components/navbar/navbar";
import UserTable from "../based_components/user_table/user_table"

import {Redirect} from "react-router";

import "./tournament.css"

const config = require('../config/config');

const vkbeautify = require('vkbeautify');

class Tournament extends React.Component {
    state = {
        name: undefined,
        files: [],
        participants: [],
        creator: undefined,
        _id: undefined,
        date: undefined,
        enjoy: false
    }

    joinToTournament = (event) => {
        console.log(this.state);
        this.setState({enjoy: true});
        sessionStorage.setItem('isDocker', true);
        this.forceUpdate();
    }

    async componentWillMount() {
        await this.setState({_id: this.props.match.params.id})
        let response = await fetch(`${config.server}/tournament/${this.state._id}`);
        let body = await response.json();
        await this.setState(body);
        console.log(this.state);
    }

    render() {
        let flag = this.state.enjoy;
        console.log(flag);
        if(flag === false || typeof flag === "undefined"){
            return (<div>
                <NavigationBar/>
                <div className="name">
                    <h1>{this.state.name}</h1>
                </div>
                <div>
                    <div className="row">
                        <div className="childContainer">
                            <UserTable userList={this.state.participants}/>
                        </div>
                            {
                                this.state.participants.map((item, index) => (
                                    <div className="">
                                        <p>{item.name}</p>
                                    </div>
                                ))
                            }
                        <div className="childContainer">
                            {
                                this.state.files.map((item, index) => (
                                    <div className="">
                                        <h3>Файл: {item.name}</h3>
                                        <h4>Данные</h4>
                                        <pre>{vkbeautify.json(item.data)}</pre>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="info">
                    <p>До: {new Date(this.state.date).toLocaleDateString()}</p>
                    <br/>
                    <p>Учредитель: <a href={`/user/${this.state.creator}`}>{this.state.creator}</a></p>
                </div>
                <div className="endButton">
                    <button className="btn btn-success" onClick={this.joinToTournament}>Принять участие</button>
                </div>
            </div>)
        } else {
            return <Redirect to={`/dialog/${this.state._id}`}/>
        }
    }
}

export default Tournament;