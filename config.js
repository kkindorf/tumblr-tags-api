//exports.DATABASE_URL = 'mongodb://kkindorf:Soccer88@ds046549.mlab.com:46549/tumblr-tags';
                            
exports.PORT = process.env.PORT || 8080;
exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://kkindorf:Soccer88@ds046549.mlab.com:46549/tumblr-tags' :
                            'mongodb://localhost/tumblr-api-dev');
exports.PORT = process.env.PORT || 8080;