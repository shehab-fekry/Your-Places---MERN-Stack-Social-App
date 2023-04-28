const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const Places = require('../Models/placesM');
const Users = require('../Models/usersM');

exports.getPlacesByUserId = (req, res, next) => {
    let userID = req.params.userID;

    Places.find({creator: userID})
    .then(userPlaces => {
        if(userPlaces.length === 0 || !userPlaces){
            return res.json({message: 'No places Creeated yet!'})
        }
        res.status(200).json({ places: userPlaces });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Somthing went wrong, please try again!'});
    });
}


exports.getPlaceById = (req, res, next) => {
    let placeID = req.params.placeID;

    Places.findById({_id: placeID})
    .then(place => {
        res.status(200).json({ place });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Somthing went wrong, please try again!'});
    });
}


exports.createPlace = (req, res, next) => {
    let {title, description, address, coordinates, creator} = req.body;
    coordinates = {lat: coordinates.split(',')[0], lng: coordinates.split(',')[1]};
    let imagePath = req.file.path;
    
    let errorsArray = validationResult(req).errors;
    if(errorsArray.length !== 0){
        return res.json({errors: errorsArray});
    }

    let newPlace = new Places({imagePath, title, description, address, coordinates, creator});
    newPlace.save()
    .then(result => {
        Users.findById({_id: creator})
        .then(user => {
            user.places.push(newPlace._id);
            user.save();
            res.status(201).json({place: newPlace});
        })
        .catch(err => console.log(err))
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Somthing went wrong, please try again!'});
    });
}


exports.updatePlaceById =(req, res, next) => {
    const placeID = req.params.placeID;
    let {title, description, address, coordinates} = req.body;
    coordinates = {lat: coordinates.split(',')[0], lng: coordinates.split(',')[1]};
    let imagePath = req.file?.path;
    
    let errorsArray = validationResult(req).errors;
    if(errorsArray.length !== 0){
        return res.json({errors: errorsArray});
    }

    Places.findById({_id: placeID})
    .then(place => {
        // authinticating if the user is the creator
        if(place.creator.toString() !== req.userAuthData.userID){
            return res.status(401).json({message: `you are not authorized to update this place!`});
        }

        // if user updated post image it will be updated to the new
        // else it will stay as it was
        place.imagePath = imagePath ? imagePath : place.imagePath;
        place.title = title;
        place.description = description;
        place.address = address;
        place.coordinates = coordinates;
        place.save()
        
        res.status(201).json({message: `place of title:${title} is updated successfully..!`});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Somthing went wrong, please try again!'});
    });
}


exports.deletePlaceById = (req, res, next) => {
    const {placeID, userID} = req.params;

    Places.findById(placeID)
    .then(place => {
        // authinticating if the user is the creator
        if(place.creator.toString() !== req.userAuthData.userID){
            return res.status(401).json({message: `you are not authorized to delete this place!`});
        }

        // delete image from uploads folder
        fs.unlink(place.imagePath, err => {
            err ? console.log(err) : null
        })

        // delete image from database
        Places.deleteOne({_id: placeID})
        .then(res => {
            Users.findById(userID)
            .then(user => {
                user.places = user.places.filter(place => String(place) !== placeID);
                user.save()
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err)) 
    })
    .catch()
}