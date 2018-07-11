const express = require('express');
const router = express.Router();
const priURL = require('../models/private_url');
const User = require('../models/user');



router.delete('/',(req, res)=>{
    var toSend = {};

    var userName = req.body.shortURL.split("/")[0];
    var shortURL = req.body.shortURL.split("/")[1];

    User.findOne({user_name: userName}).then( (result) => {
        if(result){

            email= result._id;
            //   console.log("3  "+email);

            priURL.findById(email).then( (result) => {
                if(result) {

                    uList = result.url_list;

                    var array = uList.map(item => item.short_url);

                    var index = array.indexOf(req.body.shortURL);

                    uList.splice(index, 1);

                    priURL.findByIdAndUpdate(
                        email,
                        {"url_list": uList},
                        {new: true}
                    )
                        .then(() => {


                            if (index > -1) {

                                toSend.status = 'success';
                                toSend.message = 'deleted successfully';
                                toSend.shortURL = array[index];
                                res.status(200).json(toSend);
                            } else {
                                toSend.status = 'fail';
                                toSend.message = 'Could not delete given short URL.';
                                res.status(400).json(toSend);
                            }
                        }
                    )



                }
                else{
                    toSend.status = 'fail';
                    toSend.message = 'Invalid URL';
                    res.status(400).json(toSend);
                }

            });



        }else{
            toSend.status = 'fail';
            toSend.message = 'Invalid URL';
            res.status(400).json(toSend);
        }


    }).catch( (err) => {
        console.log(err);
        toSend.status = 'fail';
        toSend.message = 'error';
        res.status(404).json(toSend);
    });

}
);

module.exports = router;