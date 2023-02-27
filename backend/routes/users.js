const express = require('express');
const app = express();

const usersCTRLS = require('../controllers/usersC');
const validate = require('../middlewares/validation/usersData');

const signinValidation = [validate.email, validate.password];
const signupValidation = [validate.name, validate.email, validate.password, validate.confirmPassword];

app.get('/', usersCTRLS.getAllUsers);

app.post('/signin', signinValidation, usersCTRLS.postSignin)

app.post('/signup', signupValidation, usersCTRLS.postSignup)

module.exports = app;