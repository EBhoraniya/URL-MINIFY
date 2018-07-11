const express = require('express');
const crypto = require('crypto');
const User = require('../models/user');
const params = require('../parameters');
const router = express.Router();



router.post('/', (req, res) => {

    var toSend = {};

    addUser(req, res, toSend);

});

function addUser(req, res, toSend){
    req.body.email = req.body.email.toLowerCase();
    toSend.email = req.body.email;
    toSend.userName = req.body.userName;
    checkUniqueId(req, res, toSend);
}

function checkUniqueId(req, res, toSend){
    User.findById(req.body.email).then( (result) => {
        if(result){
            toSend.status = 'fail';
            toSend.message = 'Account with given email address already exists.';
            res.status(400).json(toSend);
        }else{
            checkUniqueUserName(req, res, toSend, true);
        }
    }).catch( (err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'Internal server error';
        res.status(404).json(toSend);
    });
}

function checkUniqueUserName(req, res, toSend, calledFirstTime){
    if(req.body.userName){
        User.findOne({user_name:req.body.userName}).then( (result) => {
            if(result && calledFirstTime){
                toSend.status = 'fail';
                toSend.message = 'Account with given user name already exists.';
                res.status(400).json(toSend);
            }else if(result){
                req.body.userName = getRandomUserName();
                checkUniqueUserName(req, res, toSend, false);
            }else{
                toSend.userName = req.body.userName;
                saveUser(req, res, toSend);
            }
        }).catch( (err) => {
            console.log(err);
            toSend.status = 'fail';
            toSend.message = 'Internal server error';
            res.status(404).json(toSend);
        });
    }else{
        req.body.userName = getRandomUserName();
        checkUniqueUserName(req, res, toSend, false);
    }
}

function saveUser(req, res, toSend){
    var newUser = new User({
        _id: req.body.email,
        password: crypto.createHash('md5').update(req.body.password).digest('hex'),
        user_name: req.body.userName
    });

    newUser.save().then( () => {
        toSend.status = 'success';
        toSend.message = 'Successfully registered.';
        res.status(200).json(toSend);
    }).catch( (err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'Internal server error';
        res.status(404).json(toSend);
    });
}

function getRandomUserName(){
    var pattern = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var length = params.randomUserName_length;
    var random = '';

    while(length){
        length = length - 1;
        random += pattern.charAt(Math.floor(Math.random() * pattern.length));
    }

    return random;
}

module.exports = router;