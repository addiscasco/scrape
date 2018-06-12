$(document).ready(function () {
    //getting a reference to the article container div rendering all articles inside of 
    var articleContainer = $(".article-container");
    //adding event listener for dynamically generated buttons for deleting articles, pulling up article notes, saving article notes, and deleting article notes
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    //initPage kicks everything off when the page is loaded
    initPage();

    function initPage() {
        //empty the article container, run an AJAX request for any saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function (data) {
            if (data && data.length) {
                renderArticles(data);
            }
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
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.headline,
                "<a class='btn btn-danger delete'>",
                "Delete From Saved",
                "</a>",
                "<a class='btn btn-info notes'>Article Notes</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div>",
                "</div>"
            ].join(""));
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
                "<h3> What would you like to browse saved articles?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
                "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
                "</div>"
            ].join(""));
        //appending this data to the page 
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data) {
        //handles rendering note list items to our notes modal, setting up an array of notes to render after finished. Also, setting up a currentNote variable to temporarily store each note
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            //if we have no notes, just display a message explining this
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article yet",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            //if notes exist go through each one and construct an li element to contain our noteText and a delete button
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));

                //store the note id on the delete button for easy access when trying to delete
                currentNote.children("button").data("_id", data.notes[i]._id);
                //adding our currentNote to the notesToRender array
                noteToRender.push(currentNote);
            }
        }
        //apend the notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
    }

    function handleArticleDelete() {
        //handles deleting articles/headlines. Grab the id of the article to delete from the panel element the delete button sits inside
        var articleToDelete = $(this).parents(".panel").data();
        //using a delete method here just to be semantic since we are deleting an article/headline
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function (data) {
            //if this works out, run initPage again which will rerender our list of saved articles
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleNotes() {
        //handles opening the note modal and displaying notes. Grab article id to get notes for the panel element the delete button sits inside
        var currentArticle = $(this).parents(".panel").data();
        //grab any notes with this headline/article id
        $.get("/api/notes/" + currentArticle._id).then(function (data) {
            //construction of our initial HTML to add to the notes modal
            var modalText = [
                "<div class='container-fuid text-center'>",
                "<h4>Notes For Article: ",
                currentArticle._id,
                "</h4>",
                "<hr/>",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            //adding the formatted HTML to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || [] //noteData
            };
            //adding infor about the article and article notes to the save button for easy access. When trying to add a new note
            $(".btn.save").data("article", noteData);
            //renderNotesList will populate the actual note HTML inside of the modal we just created/opened
            renderNoteList(noteData);
        });
    }

    function handleNoteSave(){
        //handles what happens when user tries to save new note for an article. Sets a variable to hold some formatted data about our note, grabbing the note typed into the input box
        var noteData;
        var newData = $(".bootbox-body textarea").val().trim();
        //if data exist into note field, format it and post it to the "/api/notes" route and send the formatted noteData as well
        if (newNote){
            noteData ={
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function(){
                //when complete close the modal
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete(){
        //handles the deletion of notes. Grab the note id we want to delete sand store data on the delete button we created it
        var noteToDelete =$(this).data("_id");
        //perform DELETE req to "/api/notes/" with the note id we're deleting as a parameter
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function(){
            //done then hide the modal 
            bootbox.hideAll();
        });
    }
});