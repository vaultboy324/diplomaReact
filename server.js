const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie');
const config = require('./config/config');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const schedule = require('node-schedule');

// var MongoClient = require('mongodb').MongoClient;
// MongoClient.connect(config.mongoose.uri);

let session = require('express-session');
let MongoDBStore = require('connect-mongodb-session')(session);

let Docker = require('dockerode');
let docker = new Docker();

let urlEncodeParser = bodyParser.urlencoded({extended: false});

let app = express();
let store = new MongoDBStore({
   uri: config.mongoose.uri,
   collection: "mySessions"
});

store.on('error', (err) => {
   console.log(err);
});

app.use(express.json({
   type: ['application/json', 'text/plain']
}));

app.use('/public', express.static('public'));
app.use(session({
   secret: config.session.secret,
   key: config.session.key,
   cookie: config.session.cookie,
   store: store,
   resave: true,
   saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   next();
});

app.get("/api", (req, res) => {
   let result = {
      "string": "Hello from express"
   };
   res.send(result);
});

app.get("/registration", async (req, res) => {
   res.send(0);
});

app.post("/registration", async (req, res)=> {
   await require('./module/User').createUser(req.body);
   let result = {
      "string": "Регистрация завершена"
   };
   const user = {
      login: req.body.login,
      password: req.body.password
   };
   jwt.sign(user,`${config.secretKey}`,(err, token) => {
      res.status(200).json({
         token
      });
   });
});

app.get("/checkUser/:login", async (req, res) => {
   let user = await require('./module/User').getUserByLogin(req.params.login);

   if(user){
      res.status(400).end();
   } else {
      res.status(200).end();
   }
});

app.post("/auth", async (req, res)=> {
   let user = await require('./module/User').getUserByLogPass(req.body);

   if(user){
      let forJWT = {
         login: user.login,
         password: user.password
      };
      jwt.sign(forJWT, `${config.secretKey}`, (err, token) => {
         res.status(200).json({
            token
         });
      });
   } else {
      res.status(400).json({
         "result": "Пользователя с данной парой логин-пароль не существует"
      });
   }
});

app.get("/authInfo",require('./module/Token').verifyToken, (req, res)=>{
   jwt.verify(req.headers.authorization, `${config.secretKey}`, (err, authData)=> {
      if(err){
         res.status(400).json({
            'result': "Вы не авторизованы"
         })
      } else {
         res.status(200).json({
            authData
         });
      }
   })
});

app.post("/tournament", async (req, res) => {
   await require('./module/Tournament').createTournament(req.body);
   schedule.scheduleJob(req.body.date, ()=> {
      console.log("Конкурс кончился");
   });
   res.status(200).send({
      result: "Конкурс добавлен"
   });
});

app.get("/tournament", async (req, res) => {
   let tournaments = await require('./module/Tournament').getAllTournaments();
   res.status(200).send(tournaments);
});

app.get("/user/:login", async (req, res) => {
   let user = await require('./module/User').getUserByLogin(req.params.login);
   if(user){
      let tournaments = await require('./module/Tournament').getTournamentsByUser(user.login);
      user.tournaments = tournaments;
      res.status(200).send({
         user
      });
   } else {
      res.status(400).send({
         err: "Данного пользователя не существует"
      });
   }
});

app.get("/tournament/:id", async (req, res) => {
   try{
      let response = await require('./module/Tournament').getSingleTournament(req.params.id);
      let tournament = response.toJSON();
      tournament.hiddenFiles = undefined;

      res.status(200).json(tournament);
   } catch (e) {
      res.status(400).json({
         "result": "Данного конкурса не существует"
      });
   }
});

app.get("/allUsers", async (req, res) => {
   let users = await require('./module/User').getAllUsers();
   res.status(200).json(users);
});

app.post("/message", async (req, res)=> {
    await require('./module/Message').createMessage(req.body);

    if(req.body.isDocker){
        await require('./module/Tournament').joinToTournament(req.body);
    }

    res.sendStatus(200);
});

app.get("/message/:s/:r", async (req, res) => {
    let object = {
        sender: req.params.s,
        receiver: req.params.r
    };
    let messages = await require('./module/Message').getMessage(object);
    res.status(200).json(messages);
});

const server = app.listen(process.env.PORT || '5000', () => {
   console.log(`App listen on port ${server.address().port}`);
   console.log('Press Ctrl+C to quit');
});