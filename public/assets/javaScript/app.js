// Grabs articles
$.getJSON("/articles", function (data) {

    //Will go through the array and append data ID, title, link to #articles. Also, creates button to take user to the website corresponding to the article 
    for (var i = 0; i < data.length; i++) {
        var dataI = data[i];
        $("#articles").append("<p dataId='" + dataI._id + "'>" + dataI.title + "<br />" + "<p class='summary'>" + "</p>" + "</p>");

        $("#articles").append(`<a href=" + dataI.link}" id="link" dataId="${dataI._id}> ${dataI.link} </>`);

        $("#articles").append(`<button id="editNote" dataId='"${dataI.link}"'>Read More</button>`);
    }
});

$(document).on("click", "#editNote", function () {

    var hyperlink = $(this).attr("dataId");
    window.open(hyperlink);

    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var id = $(this).attr("dataId");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + id
    })
        // Add note
        .then(function (data) {
            console.log(data);
            //title, insertNoteText, and button to submit new note with new info
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='insertNoteTitle' name='title' >");
            $("#notes").append("<textarea id='insertNoteBody' name='body'></textarea>");
            $("#notes").append("<button dataId='" + data._id + "' id='saveNote'>Save</button>");

            // If note exist, then insert title and body
            if (data.note) {
                $("#insertNoteTitle").val(data.note.title);
                $("#insertNoteBody").val(data.note.body);
            }
        });
});

// Click saveNote button and grabs id that corresponds to article 
$(document).on("click", "#saveNote", function () {

    var id = $(this).attr("dataId");

    // POST request to update note 
    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            title: $("#insertNoteTitle").val(),
            body: $("#insertNoteBody").val()
        }
    })
        // Logs response and empties notes
        .then(function (data) {
            console.log(data);
            $("#notes").empty();
        });

    $("#insertNoteTitle").val("");
    $("#insertNoteBody").val("");
});

$("#scrape").on("click", function () {
    console.log("Scrape CLICKED");

    $.get("/scrape", function (data, cb) { })
        .then(function (data) {
            if (data) {
                alert("Scrape succeeded");
                location.reload();
            }
        });
});