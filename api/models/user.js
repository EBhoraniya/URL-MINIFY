/*Removed Unique and TTL index from fields because of online database not being connected
* with those indexes. Find the solution and add those again.*/

const mongoose = require('mongoose');
const params = require('../parameters');

var SchemaOptions = {
    collection: params.colUsers,
    versionKey: false
};

var userSchema = mongoose.Schema({
    _id:{type:String, lowercase:true, required:true},
    password:{type:String, required:true},
    user_name:{type:String, required:true}
}, SchemaOptions);

module.exports = mongoose.model('User', userSchema);