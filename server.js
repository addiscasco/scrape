//require dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');

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
app.use(bodyParser.urlencoded({extended: true}));

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

mongoose.Promise =global.Promise;


//listen on the port
app.listen(PORT, function(){
    console.log("Listening on port: " + PORT);
});
