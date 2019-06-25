import React from 'react';
import {Redirect} from "react-router";

import InputField from "../based_components/input_field/input_field";
import Auth from "../auth/auth";
import Button from "react-bootstrap/Button";

import User from "../class/User"

const config = require("../config/config");

class Registration extends React.Component{
    state = {
        login: undefined,
        password: undefined,
        email: undefined,
        name: undefined,
        surname: undefined,
        statusString: undefined
    }

    completeRegistration = async (event) => {
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

        let user = new User(this.state);

        let res = await fetch(`${config.server}/checkUser/${user.getLogin()}`);

        console.log(res.status);

        if(res.status !== 200){
            await this.setState({statusString: "Пользователь с данным логином уже существует"});
            this.forceUpdate();
            return;
        }


        const jsonString = JSON.stringify(user.toDict());

        const response = await fetch(`${config.server}/registration`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': jsonString.length
            },
            // mode: 'no-cors',
            body: jsonString
        });

        let body = await response.json();

        if(response.status === 200){
            user.setToken(body.token);
            console.log(await user.isAuthorised());
            sessionStorage.setItem('token', user.getToken());
            sessionStorage.setItem('login', user.getLogin());
            console.log(sessionStorage.getItem('token'));
            this.forceUpdate();
        } else {
        }
    }

    handleLoginChange = async (event) => {

        // if(response.status === 200){
            this.setState({login: event.target.value});
            // await this.setState({statusString: undefined});
        // } else {
        //     await this.setState({statusString: "Пользователь с данным логином уже существует"});
        // }

        this.forceUpdate();
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value})
    }

    handleNameChange = (event) => {
        this.setState({name: event.target.value})
    }

    handleSurnameChange = (event) => {
        this.setState({surname: event.target.value})
    }

    handleEmailChange = (event) => {
        this.setState({email: event.target.value})
    }

    render() {
        let token = sessionStorage.getItem('token');
        if (typeof token!== undefined && token !== "undefined"){
            return (<Redirect to="/"/>);
        }  else {
            return (
                <form>
                    <InputField field="login" label="Логин" type="text" placeholder="Введите логин" pattern="[A-Za-z0-9]+$" value={this.state.login} onChange={this.handleLoginChange}/>
                    <InputField field="password" label="Пароль" type="password" placeholder="Введите пароль" pattern="[A-Za-z0-9]+$"  value={this.state.password} onChange={this.handlePasswordChange}/>
                    <InputField field="name" label="Имя" type="text" placeholder="Введите имя" pattern="[A-Za-zА-Яа-я]+$" value={this.state.name} onChange={this.handleNameChange}/>
                    <InputField field="surname" label="Фамилия" type="text" placeholder="Введите фамилию" pattern="[A-Za-zА-Яа-я]+$" value={this.state.surname} onChange={this.handleSurnameChange}/>
                    <InputField field="email" label="Элеткронная почта" type="email" placeholder="Введите адрес электронной почты" value={this.state.email} onChange={this.handleEmailChange}/>
                    <button onClick={this.completeRegistration} className="btn btn-primary">
                        Подтвердить регистрацию
                    </button>
                    <p>{this.state.statusString}</p>
                    <p><a href="/auth">У меня уже есть учётная запись</a></p>
                </form>
            );
        }

    }
}

export default Registration;