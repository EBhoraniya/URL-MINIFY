const express = require('express');
const params = require('./api/parameters');
const mongoose = require('mongoose');
const app = express();

const apiRoutes = require('./api/api.js');
const serverRoutes = require('./server/server');

app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

app.use('/api', apiRoutes);
app.use('/', serverRoutes);
app.use(express.static('./client/build'));

var mongooseOptions = {
    dbName: params.dbName
    // autoIndex: false /*uncomment it when deploying*/
};

mongoose.connect(params.mongoServer, mongooseOptions).then(function(msg){
    console.log("Database connected");
}).catch(function(err) {
    console.log("Error connecting database");
    console.log(err);
});

app.listen(process.env.PORT || params.apiPort);