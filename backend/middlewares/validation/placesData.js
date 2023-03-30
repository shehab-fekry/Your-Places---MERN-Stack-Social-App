const { body } = require('express-validator');

exports.title = body('title')
.notEmpty()
.withMessage('Title is required')
.isLength({min: 5, max:30})
.withMessage('Title is too short minLength of 5 characters')
.trim()

exports.description = body('description')
.notEmpty()
.withMessage('Description is required')
.isLength({min: 5, max: 400})
.withMessage('Description must be betwwen 5-400 characters')
.trim()

exports.address = body('address')
.notEmpty()
.withMessage('Address is required')
.isLength({min: 5, max:100})
.withMessage('Address must be betwwen 5-100 characters')
.trim()

exports.coordinates = body('coordinates')
.notEmpty()
.withMessage('Coordinates is required')
// .isLatLong()
// .withMessage('Coordinates must be in th form lat,lng')