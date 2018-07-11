const express = require('express');
const PrivateURL = require('../models/private_url');
const params = require('../parameters');
const router = express.Router();

router.get('/', (req, res) => {
    var toSend = {};
    toSend.userName = req.userData.userName;
    toSend.email = req.userData.email;

    getHistory(req, res, toSend);

});

function getHistory(req, res, toSend){
    PrivateURL.findById(req.userData.email).then( (result) => {
        if(result)
            toSend.urlList = result.url_list;
        else
            toSend.urlList = [];

        toSend.status = 'success';
        toSend.message = 'History for requested user found successfully';
        res.status(200).json(toSend);
    }).catch( (err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'Internal server error';
        res.status(404).json(toSend);
    });
}

module.exports = router;