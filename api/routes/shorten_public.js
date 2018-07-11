const express = require('express');
const PublicURL = require('../models/public_url');
const URL = require('url');
const params = require('../parameters');
const router = express.Router();

router.post('/', (req, res) => {

    var toSend = {};

    addURL(req, res, toSend);

});

function addURL(req, res, toSend){
    toSend.longURL = req.body.longURL;
    toSend.shortURL = req.body.shortURL;

    var url = URL.parse(toSend.longURL);
    if(!url.protocol)
        toSend.longURL = 'https://' + toSend.longURL;

    if(req.body.expirationTime){
        var currentDate = new Date();
        var expiryDate = new Date(currentDate.getTime() + req.body.expirationTime*60*1000);
        req.body.expirationTime = expiryDate.getTime();
        toSend.expirationTime = expiryDate.toString();
    }

    checkUniqueShortURL(req, res, toSend, true);
}

function checkUniqueShortURL(req, res, toSend, calledFirstTime){
    if(req.body.shortURL){
        PublicURL.findById(req.body.shortURL).then( (result) => {
            if(result && calledFirstTime){
                toSend.status = 'fail';
                toSend.message = 'Requested short URL is already in use. Try differenmt or don\'t define attribute to generate random short url.';
                res.status(200).json(toSend);
            }else if(result){
                req.body.shortURL = getRandomShortURL();
                checkUniqueShortURL(req, res, toSend, false);
            }else{
                toSend.shortURL = req.body.shortURL;
                saveURL(req, res, toSend);
            }
        }).catch( (err) => {
            console.log(err);
            toSend.status = 'fail';
            toSend.message = 'Internal server error';
            res.status(404).json(toSend);
        });
    }else{
        req.body.shortURL = getRandomShortURL();
        checkUniqueShortURL(req, res, toSend, false);
    }
}

function saveURL(req, res, toSend){
    var newURL = new PublicURL({
        _id:req.body.shortURL,
        long_url:req.body.longURL
    });

    if(req.body.expirationTime)
        newURL.expiration_time = req.body.expirationTime;

    if(req.body.expirationTime){
        newURL.expiration_time = req.body.expirationTime;
    }

    newURL.save().then( () => {
        toSend.status = 'success';
        toSend.message = 'Successfully generated short URL.';
        res.status(200).json(toSend);
    }).catch( (err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'Internal server error';
        res.status(404).json(toSend);
    });
}

function getRandomShortURL(){
    var pattern = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var length = params.randomURL_length;
    var random = '';

    while(length){
        length = length - 1;
        random += pattern.charAt(Math.floor(Math.random() * pattern.length));
    }

    return random;
}

module.exports = router;