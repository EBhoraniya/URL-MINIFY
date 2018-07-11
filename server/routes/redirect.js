const express = require('express');
const URL = require('url');
const PublicURL = require('../../api/models/public_url');
const priURL = require('../../api/models/private_url');
const User = require('../../api/models/user');
const router = express.Router();

router.get('/:shortURL', (req, res) => {
    findPublicURL(req, res);
});

router.get('/:userName/:shortURL', (req, res) => {
    findPrivateURL(req, res);
});

function findPublicURL(req, res){
    PublicURL.findById(req.params.shortURL).then( (result) => {
        if(result){
            var url = URL.parse(result.long_url);
            if(!url.protocol)
                result.long_url = 'https://'+result.long_url;
            res.setHeader('Cache-Control', 'no-cache');
            res.status(301).redirect(''+result.long_url);
        }else{
            res.status(404).json({msg:'not found'});
        }
    }).catch( (err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'Internal server error';
        res.status(404).json({msg:'err'});
    });
}

function findPrivateURL(req, res){
   
    shorturl = req.params.userName+"/"+req.params.shortURL;
   // console.log(shorturl);

    User.findOne({user_name: req.params.userName}).then( (result) => {
            if (result) {

                email = result._id;

                priURL.findById(email).then((result) => {
                    if (result) {

                        uList = result.url_list;

                        var array = uList.map(item => item.short_url);
                        var result = array.indexOf(shorturl);

                        if (result > -1) {

                            var array2 = uList.map(item => item.long_url);
                            longurl = array2[result];

                            var url = URL.parse(longurl);
                            if (!url.protocol)
                                longurl = 'https://' + longurl;
                            res.setHeader('Cache-Control', 'no-cache');
                            res.status(301).redirect('' + longurl);
                        }
                        else {
                            res.status(404).json({msg: 'not found'});
                        }

                    } else {
                        res.status(404).json({msg: 'not found'});
                    }
                })
            }
            else {
                res.status(404).json({msg: 'not found'});
            }



        }
    ).catch( (err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'Internal server error';
        res.status(404).json({msg:'err'});
    });


}

module.exports = router;