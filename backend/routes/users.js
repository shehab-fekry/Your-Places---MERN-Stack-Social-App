const express = require('express');
const app = express();
const fileUpload = require('../middlewares/fileUpload');

const usersCTRLS = require('../controllers/usersC');
const validate = require('../middlewares/validation/usersData');

const signinValidation = [validate.email, validate.password];
const signupValidation = [validate.name, validate.email, validate.password, validate.confirmPassword];

app.get('/', usersCTRLS.getAllUsers);

app.get('/:userID', usersCTRLS.getUser);

app.post('/signin', signinValidation, usersCTRLS.postSignin)

app.post('/signup', fileUpload.single('imagePath'), signupValidation, usersCTRLS.postSignup)

module.exports = app;