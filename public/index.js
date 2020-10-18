//Access page elements. 
const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");
const $currentNote = $("#current-note"); 

//Keep track of the current note being displayed. 
let activeNote = {};

//Retrieve notes from the db file. 
const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

//Save a new note to the db file, using the passed in note object that was created. 
const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

//Delete the note from the db file. 
const deleteNote = (id) => {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

//Display an active note on the page. 
const renderActiveNote = () => {
  //Hide the save button until ready to be saved. 
  $saveNoteBtn.hide();

  //Render the note to be displayed unless there is nothing to display. 
  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

//Get the note data from the user's input, save it to the db file, and update the view. 
const handleNoteSave = function() {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
    id: Math.floor(Math.random() * 1000000)
  };

  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

//Delete the clicked note. 
const handleNoteDelete = function(event) {
  //Prevents the click listener for the list from being called when the button inside of it is clicked. 
  event.stopPropagation();

  const note = $(this).parent(".list-group-item").data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

//Sets the activeNote and displays it. 
const handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};

//Sets the activeNote to and empty object and allows the user to enter a new note. 
const handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

//If a note's title or text are empty, hide the save button. 
// Otherwise show it. 
const handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

//Render's the list of note titles
const renderNoteList = (notes) => {
  $noteList.empty();

  const noteListItems = [];

  //Returns jquery object for li with given text and delete button
  //unless withDeleteButton argument is provided as false. 
  const create$li = (text, withDeleteButton = true) => {
    const $li = $("<li class='list-group-item'>");
    const $span = $("<span>").text(text);
    $li.append($span);

    if (withDeleteButton) {
      const $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
      );
      $li.append($delBtn);
    }
    return $li;
  };

  if (notes.length === 0) {
    noteListItems.push(create$li("No saved Notes", false));
  }

  notes.forEach((note) => {
    const $li = create$li(note.title).data(note);
    noteListItems.push($li);

    console.log(note.text); 
  });

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => {
  return getNotes().then(renderNoteList);
};

const toggleReadOnly = () => {
  $noteTitle.attr("readonly", false);
  $noteText.attr("readonly", false);
}

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);
$currentNote.on("click", toggleReadOnly); 

// Gets and renders the initial list of notes
getAndRenderNotes();
