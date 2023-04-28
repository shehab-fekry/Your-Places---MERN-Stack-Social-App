// const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const Users = require('../Models/usersM');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllUsers = (req, res, next) => {
    // console.log('getAllUsers: ' + req.headers.authorization)
    Users.find()
    .then(users => {
        if(users.length === 0 || !users){
            return res.json({message: 'There are no users found!'});
        }
        return res.status(200).json({ users });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Somthing went wrong, please try again!'});
    });

}


exports.getUser = (req, res, next) => {
    let userID = req.params.userID;
    Users.findById({_id: userID})
    .then(user => {
        res.json({user})
    })
    .catch(err => console.log(err))
}


exports.postSignin = (req, res, next) => {
    const {email, password} = req.body;
    let errorsArray = validationResult(req).errors;

    if(errorsArray.length !== 0){
        return res.json({errors: errorsArray});
    }

    // comparing emails
    Users.find({email: email})
    .then(user => {
        if(user.length === 0){
            return res.json({message: 'user not found please signup first'});
        }

        // comparing passwords hashed
        bcrypt.compare(password, user[0].password)
        .then(isTrue => {
            if(isTrue){
                // generating token
                let token = jwt.sign(
                    {userID: user[0]._id, name: user[0].name, email: user[0].email},
                    'secret_key_must_not_tell',
                    {expiresIn: '1h'}
                );

                return res.status(201).json({user, token, message: 'Signed In!'});
            }
            else
            return res.status(404).json({message: 'Incorrect Password!'});
        })
        .catch(err => console.log(err))

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Somthing went wrong, please try again!'});
    });
}





exports.postSignup = (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body;
    const imagePath = req.file?.path;
    // console.log(imagePath)
    let errorsArray = validationResult(req).errors;

    if(errorsArray.length !== 0){
        return res.json({errors: errorsArray});
    }

    // hashing password
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        // comparing emails
        Users.find({email: email})
        .then(user => {
            if(user.length === 0){
                // creating new user
                let newUser = new Users({name, email, password: hashedPassword, imagePath});
                newUser.save()
                // generating token
                let token = jwt.sign(
                    {name, email, password},
                    'secret_key_must_not_tell',
                    {expiresIn: '1h'}
                );
                return res.status(201).json({newUser, token, message: 'User Created!'});
            }
            return res.json({message: 'user already exist!'})
        })
        .catch(err => {
            console.log(err);
            res.status(422).json({message: 'Somthing went wrong, please try again!'});
        });
    })
    .catch(err => console.log(err))
}