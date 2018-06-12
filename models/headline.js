const mongoose = require("mongoose");

//create a schema using mongoose schema function
const Schema = mongoose.Schema;

//headlineSchema that requires a headline, summary, date, and saved
const headlineSchema = new Schema ({
    headline: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String, 
        required: true
    },
    date: String, 
    Saved: {
        type: Boolean,
        default: false
    }
});

const Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;