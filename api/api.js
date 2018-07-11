const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const params = require('./parameters');
const router = express.Router();

const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const shortenPublicRoute = require('./routes/shorten_public');
const shortenPrivateRoute = require('./routes/shorten_private');
const getLongRoute = require('./routes/get_long');
const historyRoute = require('./routes/private_history');
const displayRoute = require('./routes/display');
const privateUtilsRoute = require('./routes/utils_private');

router.use(bodyParser.json());
router.use('/signup', signupRoute);
router.use('/login', loginRoute );
router.use('/display', displayRoute );
router.use('/shorten/public', shortenPublicRoute);
router.use('/shorten/private', authenticateUser, shortenPrivateRoute);
router.use('/history', authenticateUser, historyRoute);
router.use('/private', authenticateUser, privateUtilsRoute);
router.use('/long', (req, res) => {
    req.url = '/get/long' + req.url.substr(1);
    router.handle(req, res);
});
router.use('/get', getLongRoute);



router.use(function(err, req, res, next){
    console.log(err);
    res.status(404).json({
        status: 'fail',
        message: 'Invalid request'
    });
});

function authenticateUser(req, res, next){
    try{
        var decodedData = jwt.verify(req.headers.authorization.split(" ")[1], params.authTokenKey);
        req.userData = decodedData;
        next();
    }catch (err) {
        console.log(err);
        res.status(401).json({
           status: 'fail',
           message: 'Authorization failed'
        });
    }
}


module.exports = router;