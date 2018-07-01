//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var rp = require('request-promise')
var cheerio = require("cheerio");

// Require models
// var db = require("./models");
var Article = require("./models/Article.js")
//bypass the index.js and use the model directly

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

// var db = "mongodb://addthis:password410@ds123971.mlab.com:23971/heroku_w239b39v" || "mongodb://localhost/scrape";
//
// mongoose.connect(db, function (error){
//     if(error){
//         console.log(error);
//     }
//     else{
//         console.log("connected");
//     }
// });

//brandon
//Connect to MongoDB db = scraper
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/scraper" );
var db = mongoose.connection;

db.on( "error", function ( error ) {
  console.log( "Mongoose Error: ", error );
} )

db.once( "open", function () {
  console.log( "Mongoose connected." );
} );


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
    // Grabs body of HTML with request-promise so I didn't have to refactor the code
    rp("http://www.nytimes.com/").then(function (response) {
        // Receive response into cheerio and save it to $ variable
        var $ = cheerio.load(response);

        $("article.story").each(function (i, el) {

            var outcome = {};

            outcome.title = $(this).children('.story-heading').text();
            // console.log('title', outcome.title);

            outcome.link = $(this).children('.story-heading').children().attr('href')
            // console.log('link', outcome.link);

            outcome.author = $(this).children('.byline').text();
            // console.log('author', outcome.author);

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
            //
            // console.log(this)
            // console.log("link: " + outcome.link);

            // Creates a new Article
            if (outcome.link && outcome.title) {

                Article.create(outcome)
                    .then(function (dbArticle) {
                        console.log("db article create", dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        });
        res.send("Success!");
        res.send(dbArticle);
    });
});

//Gets all articles
app.get("/articles", function (req, res) {
    Article.find({})
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
