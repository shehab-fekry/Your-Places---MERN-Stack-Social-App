const mongoose = require('mongoose');
const places = require('./placesM');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required : true,
    },
    places: [ {type: mongoose.Types.ObjectId, require:true, ref: 'User'} ],
})

module.exports = mongoose.model('User', userSchema);