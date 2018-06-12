//controller for notes

const Note = require("../models/Note");
const makeDate = require("../scripts/date");

module.exports = {
    //finds allnotes associated with headline id
    get : function(data, cb){
        Note.find({
            _headlineId: data._id
        },cb);
    },
    //takes data from user and cb, create obj newNote with three properties and takes the note and creates a note and runs function to return either error or document. 
    save: function(data,cb){
        var newNote = {
            _headlineId: data._id,
            date: makeDate(), 
            noteText: date.noteText
        };
        Note.create(newNote, function(err,doc){
            if(err){
                console.log(doc);
                cb(doc);
            }
        });
    },
    //delete function to remove notes associated with function
    delete: function(data, cb){
        Note.remove({
            _id:data._id
        }, cb);
    }
};