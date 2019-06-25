import React from "react"

import InputField from "../based_components/input_field/input_field"

import User from "../class/User"
import {Redirect} from "react-router";

const config = require("../config/config");

class Auth extends React.Component {
    state = {
        login: undefined,
        password: undefined,
        statusString: undefined
    }

    logIn = async (event) => {
        event.preventDefault();

        if(typeof this.state.login === "undefined" || this.state.login.length === 0){
            await this.setState({statusString: "Логин не может быть пустым"});
            this.forceUpdate();
            return;
        }

        if(typeof this.state.password == "undefined" || this.state.password.length === 0){
            await this.setState({statusString: "Пароль не может быть пустым"});
            this.forceUpdate();
            return;
        }

        let user  = new User(this.state);

        const jsonString = JSON.stringify(user.toDict());

        const response = await fetch(`${config.server}/auth`, {
            method: 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': jsonString.length
            } ,

            body: jsonString
        });

        let body = await response.json();

        if(response.status === 200){
            user.setToken(body.token)
            sessionStorage.setItem('token', user.getToken());
            sessionStorage.setItem('login', user.getLogin());
        } else {
            await this.setState({statusString: body.result});
        }
        console.log(this.state);
        this.forceUpdate();
    }

    handleLoginChange = (event) => {
        this.setState({login: event.target.value})
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value})
    }

    render() {
        let token = sessionStorage.getItem('token');

        if (typeof token!== undefined && token !== "undefined"){
            return (<Redirect to="/"/>);
        } else {
            return (<form onSubmit={this._testMethod}>
                <InputField field="login" label="Логин" type="text" placeholder="Введите логин" pattern="[A-Za-z0-9]+$" value={this.state.login} onChange={this.handleLoginChange}/>
                <InputField field="password" label="Пароль" type="password" placeholder="Введите пароль" pattern="[A-Za-z0-9]+$"  value={this.state.password} onChange={this.handlePasswordChange}/>
                <button onClick={this.logIn} className="btn btn-primary">
                    Войти
                </button>
                <p>{this.state.statusString}</p>
                <p><a href="/registration">У меня ещё нет учётной записи</a></p>
            </form>);
        }
    }

    _testMethod = (event) => {
        event.preventDefault();
        this.setState({
            login: event.target.elements["login"].value,
            password: event.target.elements["password"].value
        });
    }
}

export default Auth;