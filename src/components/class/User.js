const config = require('../config/config')

export default class User {
    _login;
    _password;
    _name;
    _surname;
    _email;
    _authFlag;
    _token;

    constructor(oFields){
        this._login = oFields.login;
        this._password = oFields.password;
        this._name = oFields.name;
        this._surname = oFields.surname;
        this._email = oFields.email;

        console.log(this.toDict());
    };

    getLogin(){
        return this._login
    };

    getPassword(){
        return this._password
    }

    getName(){
        return this._name
    }

    getSurname(){
        return this._surname
    }

    getEmail(){
        return this._email
    }

    setAuth(flag){
        this._authFlag = flag;
    }

    setToken(token){
        this._token = token
    }

    getToken(){
        return this._token;
    }

    async isAuthorised(){
        let response = await fetch(`${config.server}/authInfo`,{
            method: 'GET',
            headers: {
                'Authorization': this.getToken()
            }
        });

        let body = await response.json();

        return body;
    }

    // async sendFlag(){
    //     let json = {
    //         "authFlag": this._authFlag
    //     };
    //
    //     let jsonString = JSON.stringify(json);
    //     await fetch(`${config.server}/authInfo`, {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Content-Length': jsonString.length
    //         },
    //         // mode: 'no-cors',
    //         body: jsonString
    //     });
    // }

    toDict(){
        return {
            "login": this._login,
            "password": this._password,
            "name": this._name,
            "surname": this._surname,
            "email": this._email
        }
    }
}

