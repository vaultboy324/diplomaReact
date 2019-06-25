import React from 'react';

import {NavigationBar} from "../based_components/navbar/navbar";
import Tournaments from "../tournaments/tournaments"

import {Redirect} from "react-router";

import './user_page.css';

const config = require('../config/config');

class UserPage extends React.Component {
    state = {
        login: undefined,
        name: undefined,
        surname: undefined,
        email: undefined,
        tournaments: [],
        redirect: false
    }

    async componentWillMount() {
        await this.setState({login: this.props.match.params.login});
        let response = await fetch(`${config.server}/user/${this.state.login}`);
        let userInfo = await response.json();
        console.log(userInfo.user);
        await this.setState(userInfo.user);
    }

    sendMessage = async (event) => {
        sessionStorage.setItem('isDocker', false);
        await this.setState({redirect: true});
        this.forceUpdate();
    }

    render() {
        if(!this.state.redirect) {
            return (
                <div>
                    <NavigationBar/>
                    <div className="row userContainer">
                        <div className="userInfo">
                            <p>Логин: {this.state.login}</p>
                            <p>Фамилия: {this.state.surname}</p>
                            <p>Имя: {this.state.name}</p>
                            <p>Электронная почта: {this.state.email}</p>
                        </div>
                        <div className="tournamentsInfo">
                            <Tournaments tournaments={this.state.tournaments}/>
                        </div>
                    </div>
                    <div className="buttonDiv">
                        <button className="btn btn-success" onClick={this.sendMessage}>Отправить сообщение</button>
                    </div>
                </div>)
        } else {
           return( <Redirect to={`/dialog/${this.state.login}`}/>);
        }
    }
}

export default UserPage;