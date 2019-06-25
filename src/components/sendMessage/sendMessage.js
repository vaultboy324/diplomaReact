import React from 'react';

import {NavigationBar} from "../based_components/navbar/navbar";

import './sendMessage.css';

const config = require("../config/config");

class SendMessage extends React.Component {
    state = {
        sender: undefined,
        receiver: undefined,
        oldMessages: [],
        target: undefined,
        isDocker: false,
        text: '',
        statusString: undefined
    }

    constructor(props){
        super(props);

    }

    get = async ()=>{
        console.log(this.state);
        let response = await fetch(`${config.server}/message/${this.state.sender}/${this.state.receiver}`);
        let body = await response.json();

        this.setState({oldMessages: body});
        console.log(this.state);
    }

    async post(){
        const jsonString = JSON.stringify(this.state);

        await fetch(`${config.server}/message`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': jsonString.length
            },
            // mode: 'no-cors',
            body: jsonString
        });
    }

    send = async (event) => {
        event.preventDefault();
        console.log(this.state);
        if (this.state.isDocker && this.state.text.indexOf('/') === -1) {
            await this.setState({statusString: 'Название образа имеет некорректный вид'});
            this.forceUpdate();
            return;
        }

        let sender = sessionStorage.getItem('login');

        await this.setState({sender: sender});

        console.log(this.state);

        await this.post();
        await this.get();

        this.forceUpdate();

    }

    handleChangeText = (event)=>{
        this.setState({text: event.target.value})
    }

    async componentWillMount() {
        await this.setState({receiver: this.props.match.params.receiver});
        let isDocker = sessionStorage.getItem('isDocker');

        console.log(isDocker);

        let sender = sessionStorage.getItem('login');
        await this.setState({sender: sender});
        await this.get();

        if(isDocker !== false){
            await this.setState({isDocker: true});
            await this.setState({target: 'Отправьте id образа'});
        } else {
            await this.setState({target: `Получатель: ${this.state.receiver}`});
        }
    }

    render() {
        return (
            <div>
                <NavigationBar/>
                <div className="container-fluid">
                    <div className="text-center">
                        <h1>{this.state.target}</h1>
                    </div>
                    <div className="messageContainer">
                        {
                            this.state.oldMessages.map((item, index) => (
                                <div className="border border-primary">
                                    <h4>{item.sender}</h4>
                                    <p>{item.text}</p>
                                </div>
                            ))
                        }
                    </div>
                    <div>
                        <textarea className="textarea" rows="10" value={this.state.text} onChange={this.handleChangeText}/>
                    </div>
                    <div className="text-right">
                        <button className="btn btn-success" onClick={this.send}>
                            Отправить сообщение
                        </button>
                    </div>
                </div>
                <p>{this.state.statusString}</p>
            </div>
        )
    }
}

export default SendMessage;