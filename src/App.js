import React from 'react';

import Auth from './components/auth/auth';
import Registration from './components/registration/registration'
import Home from './components/home/home'
import NewTournament from './components/new_tournament/new_tournament'
import UserPage from './components/user_page/user_page'
import Tournament from './components/tournament/tournament'
import SendMessage from './components/sendMessage/sendMessage'

import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

const history = createBrowserHistory();

class App extends React.Component {
    state =  {
        string: undefined
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter history={history}>
                <Switch>
                    <Route exact path="/auth" component={Auth}/>
                    <Route exact path="/registration" render={()=> {
                        let token = sessionStorage.getItem('token');
                        if(token !== "undefined" && typeof token !== undefined){
                            return(<Home/>);
                        } else {
                            return(<Registration/>);
                        }
                    }}/>
                    <Route exact path="/" render={()=>{
                        let token = sessionStorage.getItem('token');
                        if (token !== "undefined"){
                            return(<Home/>)
                        } else {
                            return(<Auth/>)
                        }
                    }}/>
                    <Route exact path="/logout" render={()=>{
                        sessionStorage.setItem('token', undefined);
                        return <Redirect to="/"/>
                    }}/>
                    <Route exact path="/newTournament" component={NewTournament}/>
                    <Route exact path="/user/:login" component={UserPage}/>
                    <Route exact path="/tournament/:id" component={Tournament}/>
                    <Route exact path="/dialog/:receiver" component={SendMessage}/>
                </Switch>
            </BrowserRouter>
        )
    }

    getData(){
        this.getResponse()
            .then((res) => {
                const someData = res;
                this.setState({string: someData})
            })
    }

    getResponse = async () => {
        const response = await fetch('/api');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    }
}

export default App;