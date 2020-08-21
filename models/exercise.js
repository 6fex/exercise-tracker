const mongoose = require('mongoose');

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
    date:  Date
}, {
    versionKey: false
});

module.exports = mongoose.model('Exercise', exerciseSchema);
