const mongoose = require('mongoose');

const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
const date = new Intl.DateTimeFormat('en-US', options).format(new Date(Date.now()));
const formatedDate = date.split(',').join('');

const exerciseSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration_mins: {
        type: Number,
        required: true
    },
    date:  {
        type: String,
        default: formatedDate
    }
    }, {
        versionKey: false
    });

module.exports = mongoose.model('Exercise', exerciseSchema);
