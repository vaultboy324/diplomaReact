const mongoose = require("mongoose");

const userScheme = new mongoose.Schema({
    login: String,
    password: String,
    name: String,
    surname: String,
    email: String,
});

const tournamentScheme = new mongoose.Schema({
   name: String,
    task: String,
    date:Date,
    files: [],
    hiddenFiles: [],
    creator: String,
    participants: [],
    score: Number
});

const messageScheme = new mongoose.Schema({
    sender: String,
    receiver: String,
    text: String
})

module.exports = {
    userScheme,
    tournamentScheme,
    messageScheme
};