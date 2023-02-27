const mongoose = require('mongoose');
const Users = require('./usersM');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    imageURL: {
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

placeSchema.methods.addCreatedPlaceToUser = function (creatorID, createdPlace) {
    Users.findById({_id: creatorID})
    .then(user => {
        user.places.push(createdPlace._id);
        // console.log(user);
        return user.save()
    })
    .catch(err => console.log(err));
}

module.exports = mongoose.model('Place', placeSchema);