const mongoose = require("mongoose");
const config = require('../config/config');

module.exports = {
    createMessage(oMessageContext){
        mongoose.connect(config.mongoose.uri, {
            useNewUrlParser: true
        });

        let messageScheme = require('../model/model').messageScheme;
        let Message = mongoose.model("messages", messageScheme);

        let message = new Message({
            sender: oMessageContext.sender,
            receiver: oMessageContext.receiver,
            text: oMessageContext.text
        });
        message.save();
    },
    async getMessage(oMessageContext){
        mongoose.connect(config.mongoose.uri, {
            useNewUrlParser: true
        });

        let messageScheme = require('../model/model').messageScheme;
        let Message = mongoose.model("messages", messageScheme);

        let messages = await Message.find({
            sender: oMessageContext.sender,
            receiver: oMessageContext.receiver
        });

        var result = [];

        messages.forEach((element)=>{
            result.push(element.toJSON());
        });

        return result;
    }
}