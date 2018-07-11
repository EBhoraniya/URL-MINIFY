const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const params = require('../parameters');
const User = require('../models/user');
const router = express.Router();

router.post('/', (req, res) => {
    req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');
    req.body._id = req.body.email.toLowerCase();
    delete req.body.email;

    var toSend = {
        email: req.body._id
    };

    findUser(req, res, toSend);
});

function findUser(req, res, toSend, next){
    User.findOne(req.body).then( (result) => {
        if(result){
            toSend.status = 'success';
            toSend.message = 'Successfully logged in.';
            toSend.userName = result.user_name;
            toSend.authToken = generateToken(result);

        }else{
            toSend.status = 'fail';
            toSend.message = 'Invalid email or password.';
        }

        res.status(200).json(toSend);
    }).catch( (err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'Internal server error';
        res.status(404).json(toSend);
    });
}

function generateToken(usr){
    var payload = {};
    payload.email = usr._id;
    payload.userName = usr.user_name;

    return jwt.sign(payload, params.authTokenKey, {expiresIn:'1h'});
}

module.exports = router;