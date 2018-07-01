//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var rp = require('request-promise')

var Article = require("./models/Article.js");


// Require models
var db = require("./models");

//Set up port
var PORT = process.env.PORT || 3000;

//Instantiate express app
var app = express();

// Logging requests
app.use(logger("dev"));

// Use body-parser 
app.use(bodyParser.urlencoded({ extended: true }));

//Public folder as a static directory
app.use(express.static("public"));
mongoose.Promise = Promise;

// Connect MONGODB or Localhost 
// var MONGODB_URI = "mongodb://addthis:password410@ds123971.mlab.com:23971/heroku_w239b39v" || "mongodb://localhost/Scrape";

//connect mongoose to our db

//Connect to MongoDB
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/scraper" );
var database = mongoose.connection;

database.on( "error", function ( error ) {
  console.log( "Mongoose Error: ", error );
})

database.once( "open", function () {
  console.log( "Mongoose connected." );
});

// var database = "mongodb://addthis:password410@ds123971.mlab.com:23971/heroku_w239b39v" || "mongodb://localhost/scrape";

// mongoose.connect(database, function (error) {
//     if (error) {
//         console.log(error);
//     }
//     else {
//         console.log("connected");
//     }
// });

// mongoose.connect(MONGODB_URI, function (error) {
//     if (error) {
//         console.log(error);
//     }
//     else {
//         console.log("Mongoose connection is successful");
//     }
// });

// Routes
app.get("/scrape", function (req, res) {
    // Grabs body of HTML with request
    rp("http://www.nytimes.com/").then(function (response) {
        // Receive response into cheerio and save it to $ variable
        var $ = cheerio.load(response);

        // Grabs h2 elements
        $(".summary").each(function (i, el) {

            var outcome = {};

            outcome.title = $(this).children('.story-heading').children('a').text();
            console.log('title', outcome.title);

            outcome.author = $(this).children('.byline').text();
            append(outcome.author);


            outcome.link = $(this).children(".story-heading").children().attr("href");
            console.log('link', outcome.link);

            // outcome.title = $(this)
            //     .parent(".story theme-summary lede")
            //     .children(".story-heading")
            //     .children("a")
            //     .children(".byline")
            //     .children(".timestamp")
            //     .children(".summary")
            //     .text().trim();
            // outcome.link = $(this)
            //     .children("a")
            //     .attr("href");

            // console.log("RESULT: " + outcome);

            // // Creates a new Article 
            if (outcome.link && outcome.title) {

                db.Article.create(outcome)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        });
        res.send("Success!");
    });
});

//Gets all articles
app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
        });
});

//Listening on the port
app.listen(process.env.PORT || PORT, function () {
    console.log("App listening on PORT " + PORT);
});