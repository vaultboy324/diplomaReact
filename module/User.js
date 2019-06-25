const mongoose = require("mongoose");
const config = require('../config/config');

module.exports = {
    createUser: (oUserContext) => {
        mongoose.connect(config.mongoose.uri, {
            useNewUrlParser: true
        });

        let userScheme = require('../model/model').userScheme;
        let User = mongoose.model("users", userScheme);

        let user = new User({
            login: oUserContext.login,
            password: oUserContext.password,
            name: oUserContext.name,
            surname: oUserContext.surname,
            email: oUserContext.email,
            score: 0
        });
        user.save();
    },

    getUserByLogPass: async (oAuthContext) => {
        mongoose.connect(config.mongoose.uri, {
            useNewUrlParser: true
        });

        let userScheme = require('../model/model').userScheme;
        let User = mongoose.model("users", userScheme);

        let user = await User.findOne({
            login: oAuthContext.login,
            password: oAuthContext.password
        }).exec();

        return user;
    },
    getUserByLogin: async (sUserLogin) => {
        mongoose.connect(config.mongoose.uri, {
            useNewUrlParser: true
        });

        let userScheme = require('../model/model').userScheme;
        let User = mongoose.model("users", userScheme);

        let user = await User.findOne({login: sUserLogin}).exec();

        let result = undefined;

        if(user){
            result = user.toJSON();
            result.password = undefined;
        }
        return result;
    },
    getAllUsers: async () => {
        mongoose.connect(config.mongoose.uri,{
            useNewUrlParser: true,
        });

        let userScheme = require('../model/model').userScheme;
        let User = mongoose.model("users", userScheme);

        let users = await User.find({}).exec();

        let result = [];

        users.forEach((element)=>{
            result.push(element.toJSON())
        });

        return result;
    }
}