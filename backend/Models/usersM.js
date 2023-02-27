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
    places: [ {type: mongoose.Types.ObjectId, require:true, ref: 'User'} ],
})

// userSchema.methods.addCreatedPlaceToUser = function (creatorID, newPlace) {
//     this.findById({_id: creatorID})
//     .then(user => {
//         user.places.push(newPlace._id);
//         return user.save();
//     })
//     .catch(err => console.log(err));
// }


module.exports = mongoose.model('User', userSchema);