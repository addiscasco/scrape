const scrape = require("../scripts/scrape");

//bring headlines and notes from the controller
const headlinesController = require("../controllers/headlines");
const notesController = require("../controllers/notes");


module.exports = function (router) {
    //this route renders the homepage
    router.get("/", function (req, res) {
        res.render("home");
    });
    //route renders the saved handlebars page
    router.get("/saved", function (req, res) {
        res.render("saved");
    });
    // when get api/fetch run function to go to headlinescontroller and run fetch and pop message depending on state of articles
    router.get("/api/fetch", function (req, res) {
        headlinesController.fetch(function (err, docs) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles today!"
                });
            } else {
                res.json({
                    message: "added" + docs.insertedCount + " new articles"
                });
            }
        });
    });
    //when router hits api/headlines take the user request definied by query and respond appropriately. If not specified, return all. 
    router.get("/api/headlines", function (req, res) {
        var query = {};
        if (req.query.saved) {
            query = req.query;
        }
        headlinesController.get(query, function (data) {
            res.json(data);
        });
    });
    //api/headlines/parameter for id that refers to headline id.. sets query to the req.params.id and pass to headlines function and respond with data
    router.delete("/api/headlines/:id", function (req, res) {
        var query = {};
        query._d = req.parms.id;
        headlinesController.delete(query, function (err, data) {
            res.json(data);
        });
    });
    //run headline controller update function from user's request
    router.patch("/api/headlines", function (req, res) {
        headlinesController.update(req.body, function (err, data) {
            res.json(data);
        });
    });
    //notes associated with headline id , run route, and set query to nothing, but if parameter if user exist is true then set query id to = params the user set. Then, use get function to pass query for the user's param and return data associated with that on the front end
    router.get("/api/notes/:headline_id?", function (req, res) {
        var query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }
        notesController.get(query, function (err, data) {
            res.json(data);
        });
    });
    //on the id of the note specified, run delete function based on query user chose and return data on FE 
    router.delete("/api/notes/:id", function (req, res) {
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function (err, data) {
            res.json(data);
        });
    });
    //runts notesController and uses what the user uses as their request to display FE
    router.post("/api/notes", function (req, res) {
        notesController.save(req.body, function (data) {
            res.json(data);
        });
    });
};