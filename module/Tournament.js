const mongoose = require("mongoose");
const config = require('../config/config');

module.exports = {
    createTournament: (oTournamentContext) => {
        mongoose.connect(config.mongoose.uri, {
            useNewUrlParser: true
        });

        let tournamentScheme = require('../model/model').tournamentScheme;
        let Tournament = mongoose.model("tournaments", tournamentScheme);

        let tournament = new Tournament({
            name: oTournamentContext.name,
            task: oTournamentContext.task,
            files: oTournamentContext.files,
            hiddenFiles: oTournamentContext.hiddenFiles,
            creator: oTournamentContext.creator,
            participants: oTournamentContext.participants,
            date: oTournamentContext.date
        });

        tournament.save();
    },
    getAllTournaments: async () => {
        mongoose.connect(config.mongoose.uri, {
            useNewUrlParser: true
        });

        let tournamentScheme = require('../model/model').tournamentScheme;
        let Tournament = mongoose.model("tournaments", tournamentScheme);

        let tournaments = await Tournament.find({}).select({"_id": 1, "name": 1, "creator": 1, "date": 1}).exec();
        let result = [];
        tournaments.forEach((element)=> {
           result.push(element.toJSON());
        });
        return result;
    },
    async getTournamentsByUser(sUserLogin){
        mongoose.connect(config.mongoose.uri, {
            useNewUrlParser: true
        });

        let tournamentScheme = require('../model/model').tournamentScheme;
        let Tournament = mongoose.model("tournaments", tournamentScheme);

        let tournaments = await Tournament.find({$or:[{"creator": sUserLogin}, {"participants.name": sUserLogin}]}).exec();
        let result = [];
        tournaments.forEach((element)=> {
            result.push(element.toJSON());
        });
        return result;
    },
    async getSingleTournament(sId){
        mongoose.connect(config.mongoose.uri, {
            useNewUrlParser: true
        });

        let tournamentScheme = require('../model/model').tournamentScheme;
        let Tournament = mongoose.model("tournaments", tournamentScheme);

        let objectId = mongoose.Types.ObjectId;
        let queryId = objectId(sId);

        try {
            let tournament = await Tournament.findById(queryId).exec();
            return tournament;
        } catch (e){
            throw e;
        }
    },
    async joinToTournament(oTournamentContext){
        mongoose.connect(config.mongoose.uri,{
            useNewUrlParser: true,
        });
        let singleTournament = await this.getSingleTournament(oTournamentContext.receiver);

        let participant = {
            login: oTournamentContext.sender,
            score: 0
        };

        singleTournament.participants.push(participant);
        singleTournament.save();
    }
}