

//until document is ready don't run javascript
$(document).ready(function () {
    //setting a reference to the articleContainer div where all the dynamic content will go. Adding event listeners to any dynamically generated "save article" and Scrape New Article button
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    //once page is ready, run initPage function 
    initPage();

    function initPage() {
        //empty article container, run an AJAX request for any unsaved headlines
        articleContainer.empty();
        //if saved = false run function
        $.getJSON("/api/headlines?saved=false").then(function (data) {

            //if headlines exist , render them to the page
            if (data && data.length) {
                renderArticles(data);
            }
            //otherwise render a message explaining we have no articles
            else {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        // handles appending HTML containing our article data to the page
        // passed an array of JSON containing all available articles in our database
        var articlePanels = [];
        //we pass each article JSON object to the createPanel function which returns a bootstrap panel with our article data inside
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        //once we have all the HTML for the articles stored in our articlePanels array, append them to the articlePanels container
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        //takes in a single JSON object for an article/headline. It constructs a jQuery element containing all of the formatted HTML for the article panel
        var panel =
            $(["<div class='panel panel-default'>", "<div class='panel-heading'>", "<h3>", article.headline, "<a class='btn btn-success save'>", "Save Article", "</a>", "</h3>", "</div>", "<div class='panel-body'>", article.summary, "</div>", "</div>"].join(""));
        //Attach article's id to the jQuery element
        //Use this when trying to figure out which article the user wants to save
        panel.data("_id", article._id);
        //return the contructed panel jQuery element
        return panel;
    }

    function renderEmpty() {
        //renders some HTML to the page explaining we don't have any articles to view using a joined array of HTML String data because it's easier to read/change than a concatenated string
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>We don't have any new articles.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3> What would you like to do next?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
                "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
                "</div>"
            ].join(""));
        //appending this data to the page 
        articleContainer.append(emptyAlert);
    }

    function handleArticleSave() {
        //function triggered when the user wants to save an article
        //when we rendered the article initially, we attached a js object containing headline id to the element using the .data method. Here we retrieve that.
        var articleToSave = $(this).parents(".panel").data();
        //user decided to save it
        articleToSave = true;
        //using a patch method to be semantic since this is an update to an existing record in our collection
        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
            //if data is true/exist
            .then(function (data) {
                //if successful, mongoose will send back an object containing a key of "ok" with the value of 1 which translates to true
                if (data.ok) {
                    //run the initPage function again which will reload the entire list of articles initPage();
                }
            });
    }

    function handleArticleScrape() {
        //this function handles the user clicking any "scrape new article" buttons
        $.getJSON("/api/fetch")
            .then(function (data) {
                //if we're able to successfully scrape the NYTIMES and compare the articles to those already in our collection, re render the articles on the page and let the user know how many unique articles we were able to save
                initPage();
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");
            });
    }
});