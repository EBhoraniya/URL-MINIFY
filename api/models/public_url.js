/*Removed Unique and TTL index from fields because of online database not being connected
* with those indexes. Find the solution and add those again.*/

const mongoose = require('mongoose');
const params = require('../parameters');

var SchemaOptions = {
    collection: params.colPublicURLs,
    versionKey: false
};

var sharedSchema = mongoose.Schema({
    _id: {type:String, required:true},
    long_url: {type:String, required:true},
    expiration_time: {type:Date, required:false},
}, SchemaOptions);

module.exports = mongoose.model('PublicURL', sharedSchema);