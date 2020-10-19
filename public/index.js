//Access page elements. 
const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");
const $currentNote = $("#current-note"); 
//const $deleteNote = $(".delete-note"); 

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
    id: Math.floor(Math.random() * 1000000),
    date: moment().format("l")
  };

  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

//Delete the clicked note. 
const handleNoteDelete = function(event) {
  console.log(event.target); 
  //Prevents the click listener for the list from being called when the button inside of it is clicked. 
  event.stopPropagation();

  console.log($(this).parent().parent().parent().parent().data()); 

  //const note = $(this).parent(".list-group-item").data();

  const note = $(this).parent().parent().parent().parent().data(); 

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
  const create$li = (text, date, withDeleteButton = true) => {
    const $li = $("<li class='list-group-item'>");

    const container = $("<div>"); 
    container.attr("class","container"); 
    const row = $("<div>"); 
    row.attr("class","row"); 

    const textContent = $("<div>"); 
    textContent.attr("class","col-8"); 
    textContent.css("padding-left","0px"); 

    const iconContainer = $("<div>"); 
    iconContainer.attr("class","col-4"); 
    iconContainer.css("top","10px"); 

    const $span = $("<span>").text(text);
    //$li.append($span);

    const dateDiv = $("<div>").text(date); 
    dateDiv.attr("class","text-muted"); 
    dateDiv.css("font-size","0.7rem"); 


    if (withDeleteButton) {
      const $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
      );
      //$li.append($delBtn);
      iconContainer.append($delBtn); 
    }

    
    //$li.append(dateDiv); 
    textContent.append($span); 
    textContent.append(dateDiv); 

    row.append(textContent); 
    row.append(iconContainer); 

    container.append(row); 

    $li.append(container); 

    return $li;
  };

  if (notes.length === 0) {
    noteListItems.push(create$li("No saved Notes", false));
  }

  notes.forEach((note) => {
    const $li = create$li(note.title, note.date).data(note);
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
}; 

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
//$deleteNote.on("click", handleNoteDelete); 
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);
$currentNote.on("click", toggleReadOnly); 

// Gets and renders the initial list of notes
getAndRenderNotes();
