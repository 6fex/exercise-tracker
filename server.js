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
    .catch(()=> res.send('username already taken :('));
});

app.post('/api/exercise/add', (req, res) => {
    const { username, description, duration_mins, date } = req.body;
    
    const newDate = new Date(date);

    doesUserExist(username)
    .then(() => res.send(`user does not exist :(`))
    .catch(() => {
        Exercise.create({
            username: username, 
            description: description, 
            duration_mins: duration_mins, 
            date: newDate
        }, (error, createdExercise) => {
            if(error) return console.error(error);
            res.json(createdExercise);
        });
    });
});

app.get('/api/exercise/log', (req, res) => {
    const { userId, from, to, limit = 0} = req.query;
    
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if(from !== undefined && to !== undefined) {
        Exercise.find({username: userId})
        .find({date: {$gte: fromDate, $lte: toDate}})
        .sort({date: -1})
        .limit(limit)
        .exec((error, exercises) => {
            if(error) console.error(error);
            res.json(exercises);
        });
    } else if(from !== undefined) {
        Exercise.find({username: userId})
        .find({date: {$gte: fromDate}})
        .sort({date: -1})
        .limit(limit)
        .exec((error, exercises) => {
            if(error) console.error(error);
            res.json(exercises);
        });
    } else if(to !== undefined) {
        Exercise.find({username: userId})
        .find({date: {$lte: toDate}})
        .sort({date: -1})
        .limit(limit)
        .exec((error, exercises) => {
            if(error) console.error(error);
            res.json(exercises);
        });
    } else {
        Exercise.find({username: userId})
        .sort({date: -1})
        .limit(limit)
        .exec((error, exercises) => {
            if(error) console.error(error);
            res.json(exercises);
        });
    }
});

