const express = require('express');
const PublicURL = require('../models/public_url');
const priURL = require('../models/private_url');
const User = require('../models/user');
const router = express.Router();

router.get('/long', (req, res) => {
    var shortURL = req.query.shortURL;

    var toSend = {};
    toSend.shortURL = req.query.shortURL;

    if(!req.query.shortURL.includes('/'))
        findPublicURL(req, res, toSend);
    else
        findPrivateURL(req, res, toSend);
});

function findPublicURL(req, res, toSend){
    PublicURL.findById(req.query.shortURL).then( (result) => {
        if(result){
            toSend.status = 'success';
            toSend.message = 'Found long URL.';
            toSend.longURL = result.long_url;
            res.status(200).json(toSend);
        }else{
            toSend.status = 'fail';
            toSend.message = 'Could not find long URL for given short URL.';
            res.status(200).json(toSend);
        }
    }).catch( (err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'Internal server error';
        res.status(404).json(toSend);
    });
}

function findPrivateURL(req, res, toSend){

    var userName = req.query.shortURL.split("/")[0];
    var shortURL = req.query.shortURL.split("/")[1];
  //  console.log("1  "+shortURL);
  //  console.log("2  "+userName);


    User.findOne({user_name: userName}).then( (result) => {
        if(result){

            email= result._id;
         //   console.log("3  "+email);

            priURL.findById(email).then( (result) => {
                if(result) {

                     uList = result.url_list;

                    var array = uList.map(item => item.short_url);

                    var index = array.indexOf(req.query.shortURL);

                    if(index > -1 ){
                       // console.log("4  "+index);
                        var array2 = uList.map(item => item.long_url);

                        toSend.status = 'success';
                        toSend.message = 'Found long URL.';
                        toSend.longURL = array2[index];
                        res.status(200).json(toSend);
                    }else{
                        toSend.status = 'fail';
                        toSend.message = 'Could not find long URL for given short URL.';
                        res.status(200).json(toSend);
                    }

                }
                else{
                    toSend.status = 'fail';
                    toSend.message = 'Invalid URL';
                    res.status(200).json(toSend);
                }

                });



        }else{
            toSend.status = 'fail';
            toSend.message = 'Invalid URL';
            res.status(200).json(toSend);
        }


    }).catch( (err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'error';
        res.status(404).json(toSend);
    });

}

module.exports = router;
