//bring in our scrape script and makeDate scripts
const scrape = require("../scripts/scrape");
const makeDate = require("../scripts/date");

//bring in headline and note mongoose models
const Headline = require("../models/Headline");

module.exports = {
    fetch: function (cb) {
        scrape(function (data) {
            var articles = data;
            //go through ea article and run make date function and set saved to false
            for (var i = 0; i < articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }
            console.log("DATA");
            console.log(data);
            //mongo function taking headline and inserting into the collection and if one article fails it won't stop the process and instead will skip the article
            Headline.collection.insertMany(articles, { ordered: false }, {sparse: true, unique: true}, function (err, docs) {
                cb(err, docs);
            });

            // Headline.create(articles).then(function (dbArticle) {
            //     console.log("dbart", dbArticle);
            // }).catch(function (err) {
            //     console.log(err);
            // });
        });
    },
    //delete function and whatever headline is queried will be removed
    delete: function (query, cb) {
        Headline.remove(query, cb);
    },
    //find all headlines in query and sort from most recent to least recent and pass those docs to our callback function
    get: function (query, cb) {
        Headline.find(query)
            .sort({
                _id: -1
            })
            .exec(function (err, doc) {
                cb(doc);
            });
    },
    //update
    update: function (query, cb) {
        Headline.update({ _id: query._id }, {
            $set: query
        }, {}, cb);
    }
};
