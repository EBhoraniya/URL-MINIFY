const express = require('express');
const router = express.Router();

const redirectRoute = require('./routes/redirect');

router.use('/', redirectRoute);

router.use(function(err, req, res, next){
    console.log(err);
    res.status(404).json({
        status: 'fail',
        message: 'Invalid request'
    });
});

module.exports = router;
