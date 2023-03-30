const mongoose = require('mongoose');
const Users = require('./usersM');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    imagePath: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    coordinates: {
        lat:{
            type: Number,
            required: true,
        },
        lng:{
            type: Number,
            required: true,
        },
    },
    creator: {
        type: String,
        required: true,
        ref: 'User',
    },
})

module.exports = mongoose.model('Place', placeSchema);