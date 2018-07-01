var mongoose = require("mongoose");

// create a Schema
var Schema = mongoose.Schema;

// Create a Schema for Articles that requires a headline, summary, date, and saved property
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: "Summary Unavailable"
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    },
    date: { type: Date, default: Date.now }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;