var production = true;

if(production) {

    module.exports.domainName = 'localhost/';
    module.exports.mongoServer = 'mongodb+srv://URL_shortener_API:VikiEku@url-shortener-hgvpt.mongodb.net/test?retryWrites=true';
    module.exports.dbName = 'URL_shortener';
    module.exports.dbLocation = this.mongoServer + '/' + this.dbName;
    module.exports.colUsers = 'Users';
    module.exports.colPublicURLs = 'Public_URLs';
    module.exports.colPrivateURLs = 'Private_URLs';
    module.exports.authTokenKey = 'url_shortener';
    module.exports.randomUserName_length = 5;
    module.exports.randomURL_length = 7;
    module.exports.apiPort = 80;

}else{

    module.exports.domainName = 'localhost/';
    module.exports.mongoServer = 'mongodb://localhost:27017';
    module.exports.dbName = 'URL_shortener';
    module.exports.dbLocation = this.mongoServer + '/' + this.dbName;
    module.exports.colUsers = 'Users';
    module.exports.colPublicURLs = 'Public_URLs';
    module.exports.colPrivateURLs = 'Private_URLs';
    module.exports.authTokenKey = 'url_shortener';
    module.exports.randomUserName_length = 5;
    module.exports.randomURL_length = 7;
    module.exports.apiPort = 3000;

}