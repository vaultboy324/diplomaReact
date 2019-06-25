import React from 'react';

import {NavigationBar} from "../based_components/navbar/navbar";
import UserTable from "../based_components/user_table/user_table"
import Tournaments from "../tournaments/tournaments";

import './home.css';

const config = require('../config/config');

class Home extends React.Component {
    state = {
        tournaments: [],
        users: []
    };

    constructor(props) {
        super(props);
        // sessionStorage.setItem('join', false);
    };

    async getTournaments() {
        let response = await fetch(`${config.server}/tournament`);
        let tournaments = await response.json();
        return tournaments;
    }

    async getUsers() {
        let response = await fetch(`${config.server}/allUsers`);
        let users = await response.json();
        return users;
    }

    async componentWillMount() {
        let tournaments = await this.getTournaments();
        await this.setState({tournaments: tournaments});

        let users = await this.getUsers();
        await this.setState({users: users});
    }

    render(){
        return (
            <div className="App">
                <NavigationBar />
                <div className="row">
                    <div className="childrenContainer">
                        <UserTable userList={this.state.users}/>
                    </div>
                    <div className="childrenContainer">
                        <Tournaments tournaments={this.state.tournaments}/>
                    </div>
                </div>
            </div>
        )
    };
}

export default Home;