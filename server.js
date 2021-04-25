// All dependencies needed
let express = require("express");
let path = require("path");
let fs = require("fs");

// Express App and Port
let app = express();
let PORT = process.env.PORT || 3000;

// Express set up request handler
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Get  for - Index.html-
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
// Get for - Notes.html -
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});
// Get for - db.json -

app.get("/api/notes", function (req, res) {
  return res.sendFile(path.join(__dirname, "/db/", "db.json"));
});
// Note posting to json
app.post("/api/notes", function (req, res) {
  let note = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "db/db.json"), "utf8")
  );
  let newNote = req.body;
  newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase();

  console.log(newNote);
  if (note === "") {
    note = [];
    note.push(newNote);
  } else {
    note.push(newNote);
  }

  let notes = JSON.stringify(note);
  let file = path.join(__dirname, "db", "/db.json");
  fs.writeFileSync(file, notes);

  res.sendFile(path.join(__dirname, "db", "db.json"));
});

app.delete("/api/notes/:id", function (req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = req.params.id;
  console.log(`Deleting note with ID ${noteID}`);
  savedNotes = savedNotes.filter(currNote => {
    return currNote.id != noteID;
  });
  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
});
// Starts the server

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
