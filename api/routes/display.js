const express = require('express');
const PublicURL = require('../models/public_url');
const URL = require('url');
const params = require('../parameters');
const router = express.Router();



router.get('/', (req, res) => {

    var toSend = {};

    displayURL(req, res, toSend);

});

function displayURL(req, res, toSend)
{
    PublicURL.find({}, function(err, urls) {
        var urlMap = [];
        var i=0;
        urls.forEach(function(url) {
            urlMap[i] = url;
            i=i+1;
        });

        res.send(urlMap);
    });
}

module.exports = router;