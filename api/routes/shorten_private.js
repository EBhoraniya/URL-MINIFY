const express = require('express');
const params = require('../parameters.js');
const priURL = require('../models/private_url');
const router = express.Router();
const URL = require('url');

router.post('/', function (req, res) {

    var toSend = {};

    //  console.log(req.userData);

    var url = URL.parse(req.body.longURL);
    longurl = req.body.longURL;
    if (!url.protocol)
        longurl = 'https://' + req.body.longURL;

    saveUrl(req, res, toSend);
    // displayUrl(req, res, toSend);

});

module.exports = router;

function saveUrl(req, res, toSend) {

    priURL.findById(req.userData.email).then((result) => {
        if (result) {

            checkUniqueShortURL(req, res, toSend, true);

        }
        else {

            if (req.body.shortURL)
                shorturl = req.userData.userName + "/" + req.body.shortURL;
            else
                shorturl = req.userData.userName + "/" + getRandomShortURL();

            var uList =
                [
                    {
                        short_url: shorturl,
                        long_url: longurl,
                        expiration_time: req.body.expirationTime
                    }
                ];

            var newUrl = new priURL({
                _id: req.userData.email,
                url_list: uList
            });

            newUrl.save().then(() => {

               // displayUrl(req, res, toSend);
                toSend.status = 'success';
                toSend.message = 'successfully generated shorten URL';
                toSend.longURL = longurl;
                toSend.shortURL = shorturl;
                res.status(200).json(toSend);

            })
        }

    }).catch((err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'Internal server error';
        return res.status(404).json(toSend);
    });

}

function displayUrl(req, res, toSend) {

    priURL.findById(req.userData.email).then((result) => {

        uList = result.url_list;

        return res.status(200).json({
            "total shorten URLs": uList.length,
            URLs: uList.map(List => {
                return {
                    long_url: List.long_url,
                    short_url: List.short_url,
                    expiration_time: List.expiration_time,

                };
            })
        });

    }).catch((err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'Internal server error';
        return res.status(404).json(toSend);
    });
}


function checkUniqueShortURL(req, res, toSend, calledFirstTime) {
    if (req.body.shortURL !== undefined) {

        priURL.findById(req.userData.email).then((ans) => {

            uList = ans.url_list;

            var array = uList.map(item => item.short_url);

            if (calledFirstTime) {
                req.body.shortURL = req.userData.userName + "/" + req.body.shortURL;
            }

            var result = array.includes(req.body.shortURL);

            if (result && calledFirstTime) {
                toSend.status = 'fail';
                toSend.message = 'Requested short URL is already in use. Try different or don\'t define attribute to generate random short url.';
                return res.status(400).json(toSend);

            } else if (result) {
                req.body.shortURL = getRandomShortURL();
                checkUniqueShortURL(req, res, toSend, false);
            } else {
                //  console.log("req.body.shortURL  "+req.body.shortURL);
               // toSend.shortURL = req.body.shortURL;
                addURL(req, res, toSend);
            }
        }).catch((err) => {
            console.log(err);
            toSend.status = 'fail';
            toSend.message = 'Internal server error';
            res.status(404).json(toSend);
        });

    }
    else {

        req.body.shortURL = req.userData.userName + "/" + getRandomShortURL();
        checkUniqueShortURL(req, res, toSend, false);

    }

}


function getRandomShortURL() {
    var pattern = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var length = params.randomURL_length;
    var random = '';

    while (length) {
        length = length - 1;
        random += pattern.charAt(Math.floor(Math.random() * pattern.length));
    }

    return random;
}

function addURL(req, res, toSend) {
    var uList = {
        short_url: req.body.shortURL,
        long_url: longurl,
        expiration_time: req.body.expirationTime
    };

    priURL.findByIdAndUpdate(
        req.userData.email,
        {$push: {"url_list": uList}}
    ).then(() => {

        //displayUrl(req, res, toSend);
        toSend.status = 'success';
        toSend.message = 'successfully generated shorten URL';
        toSend.longURL = longurl;
        toSend.shortURL = req.body.shortURL;
        res.status(200).json(toSend);
    })

};