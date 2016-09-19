var mongoose = require('mongoose');

var SavecardSchema = new mongoose.Schema({
    src: String,
    blogName: String,
    summary: String,
    postUrl: String,
    date: { type: Date, default: Date.now }

});

var SaveCard = mongoose.model('SaveCard', SavecardSchema);
module.exports = SaveCard;