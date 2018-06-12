//require dependencies
const express = require('express');

const mongoose = require('mongoose');

const exphbs  = require('express-handlebars');

const bodyParser = require('body-parser');



//set up port
const PORT = process.env.PORT || 3000;

//instantiate Express app
const app = express();

//set up an Express router 
const router = express.Router();

//require our routes file pass our router object
require("./config/routes")(router);

//designate public folder as a static directory
app.use(express.static(__dirname + "/public"));

//connect handlebars to express app
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

//use bodyparser in app
app.use(bodyParser.urlencoded({
    extended: false
}));

//every request goes through our router middleware
app.use(router);

//if deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//connect mongoose to our db
mongoose.connect(db, function(error){
    //log errors connecting w/mongoose
    if (error) {
        console.log(error);
    }
    //or log a success message
    else{
        console.log("mongoose connection is successful");
    }
});

//listen on the port
app.listen(PORT, function(){
    console.log("Listening on port: " + PORT);
});









// app.get('/', function (req, res) {
//     res.render('home');
// });

// app.listen(3000);


// const $ = cheerio.load('<h2 class="title">Hello world</h2>')

// $('h2.title').text('Hello there!')
// $('h2').addClass('welcome')

// $.html()

// var request = require('request');
// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });