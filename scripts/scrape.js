//information cheerio needs to scrape from NYTIMES

//require two packages that make scrape possible
const request = require("request");

const cheerio = require("cheerio");

//variable scrape includes function that has callback as a paramater - request package to request from nytimes 
var scrape = function (cb) {
    request("https://www.nytimes.com", function (err, res, body) {
        //use as jQuery
        var $ = cheerio.load(body);
        //new array of articles
        var articles = [];
        //select all theme-summaries
        $(".theme-summary").each(function (i, element) {
            //grabs text and cuts off whitespace and set to var head & sum
            var head = $(this).children(".story-heading").text().trim();
            var sum = $(this).children(".summary").text().trim();
            //if head and sum exist = scraper is able to get text from those two objects and cleans up text
            if (head && sum) {
                //cleans up text with white space
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };
                articles.push(dataToAdd);
            }
        });
        //cb sends us articles
        cb(articles);
    });
};

module.exports = scrape;