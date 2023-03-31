const express = require('express');
const app = express();

const placesCTRLS = require('../controllers/placesC');
const validate = require('../middlewares/validation/placesData');
const userTokenAuth = require('../middlewares/userTokenAuth');
const fileUpload = require('../middlewares/fileUpload');

const validation = [validate.title, validate.description, validate.address, validate.coordinates]; 

// get all places of a user
app.get('/:userID/places', placesCTRLS.getPlacesByUserId);

// get specific place
app.get('/:placeID', placesCTRLS.getPlaceById);

// this middleware protect the below 3 middlewares 
// with user token authorization 
app.use(userTokenAuth)

// create new place
app.post('/new', fileUpload.single('imagePath'), validation, placesCTRLS.createPlace)

// update specific place
app.patch('/:placeID', fileUpload.single('imagePath'), validation, placesCTRLS.updatePlaceById);

// delete specific place
app.delete('/:placeID/:userID', placesCTRLS.deletePlaceById);

module.exports = app;