/*Removed Unique and TTL index from fields because of online database not being connected
* with those indexes. Find the solution and add those again.*/

const mongoose = require('mongoose');
const params = require('../parameters');

var SchemaOptions = {
    collection: params.colPrivateURLs,
    versionKey: false
};

var url_list =
    [
        {
            short_url: {type: String, required: true},
            long_url: {type: String, required: true},
            expiration_time: {type: Date, required: false}
        }
    ];

var privateSchema = mongoose.Schema({
    _id:{type:String, lowercase:true, required:true},
    url_list

}, SchemaOptions);

module.exports = mongoose.model('PrivateURL', privateSchema);