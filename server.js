const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Exercise = require('./models/exercise');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const port = process.env.PORT || 9999;
app.listen(port, () => {
    console.log(`listening at ${port}`);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/index.html');
});
const doesUserExist = (username) => {
    return new Promise((resolve, reject) =>{
        User.exists({username: username}, (error, exists) => {
            if(error) console.error(error);
            if(!exists) {
                resolve();
            } else {
                reject();
            };
        });
    });
};

app.post('/api/exercise/new-user', (req, res) => {
    const usernameReq = req.body.username;
    doesUserExist(usernameReq).then(() => {
        User.create({username: usernameReq}, (error, newUser) => {
            if(error) console.error(error);
            res.json(newUser);
        });
    })
    .catch(()=> res.status(409).send({error: 'username already taken'}));
});

app.post('/api/exercise/add', (req, res) => {
    const { username, description, duration_mins, date } = req.body;
    
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const newDate = new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    const formatedDate = newDate.split(',').join('');

    doesUserExist(username)
    .then(() => res.status(409).send({error: 'user does not exist'}))
    .catch(() => {
        Exercise.create({
            username: username, 
            description: description, 
            duration_mins: duration_mins, 
            date: formatedDate
        }, (error, createdExercise) => {
            if(error) return console.error(error);
            res.json(createdExercise);
        });
    });
});

app.get('/api/exercise/log', (req, res) => {
    const { userId, from = -Infinity, to = Infinity, limit = 0} = req.query;
    
    Exercise.find({username: userId})
    .find({date: {$gte: from, $lte: to}})
    .sort({date: -1})
    .limit(limit)
    .exec((error, exercises) => {
        if(error) console.error(error);
        res.json(exercises);
    });
});

app.get('/api/exercise/users', (req, res) => {
    User.find((error, user) => {
        if(error) return console.error(error);
        res.json(user);
    });
});
