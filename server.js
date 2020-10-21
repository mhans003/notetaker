const fs = require("fs"); 
const express = require("express"); 
const app = express(); 
const path = require("path"); 
const PORT = process.env.PORT || 3000;

//Configure Express for JSON parsing. 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Configure Express to apply items in /public. 
app.use(express.static("public")); 
  
app.get("/notes", function (request, response) {
    //Render the notes.html page. 
    response.sendFile(path.join(__dirname + "/notes.html")); 
});

app.get("/api/notes", function(request, response) {
    //Access the notes. 
    response.sendFile(path.join(__dirname + "/db/db.json")); 
}); 

app.post("/api/notes", function(request, response) {
    //Retrieve the notes and store as an array. 
    let notes = JSON.parse(fs.readFileSync(path.join(__dirname + "/db/db.json"))); 
    //Add the note to be saved to the db file.  
    notes.push(request.body); 
    //Rewrite the db file to include the new note. 
    fs.writeFileSync(path.join(__dirname + "/db/db.json"), JSON.stringify(notes)); 
    response.end(); 
}); 

app.delete("/api/notes/:id", function(request, response) {
    //Retrieve the notes and store as an array. 
    let notes = JSON.parse(fs.readFileSync(path.join(__dirname + "/db/db.json")));
    //Filter out the note with this ID. 
    let newNotes = notes.filter(note => note.id !== request.params.id); 
    //Rewrite the db file to to exclude this note. 
    fs.writeFileSync(path.join(__dirname + "/db/db.json"), JSON.stringify(newNotes)); 
    response.end(); 
}); 

app.get("*", function(request, response) {
    //Render the index.html page. 
    response.sendFile(path.join(__dirname + "/index.html")); 
});

app.listen(PORT, function() {
    console.log("App Running"); 
}); 