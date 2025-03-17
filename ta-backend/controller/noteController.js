const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");
const { Note } = require("../model");
const { noteEditors } = require("../router/socketRoute");

module.exports.createNote = asyncErrorCatcher(async (req, res) => {
  const { title, content } = await req.body;
  const note = await new Note({
    title,
    content,
    author: req.user.id,
  }).save();
  const newNote = await Note.findById(note._id).populate(
    "author",
    "name email"
  );
  res.json({
    message: "Note created",
    success: true,
    data: {
      ...newNote._doc,
      editors: [],
    },
  });
});

module.exports.getAllNotes = asyncErrorCatcher(async (req, res) => {
  const notes = await Note.find().populate("author", "name email");
  const notesWithEditors = await Promise.all(
    notes.map(async (note) => {
      const editors = noteEditors[note._id] || [];
      return { ...note._doc, editors };
    })
  );
  res.json({ data: notesWithEditors, success: true });
});

module.exports.getMyNotes = asyncErrorCatcher(async (req, res) => {
  const notes = await Note.find({ author: req.user.id });
  res.json({ data: notes, success: true });
});

module.exports.updateNote = asyncErrorCatcher(async (req, res) => {
  const { title, content } = await req.body;
  const note = await Note.findByIdAndUpdate(
    await req.params.id,
    { title, content },
    { new: true }
  ).populate("author", "name email");
  res.json({ message: "Note updated", success: true, data: note });
});

module.exports.deleteNote = asyncErrorCatcher(async (req, res) => {
  await Note.findByIdAndDelete(await req.params.id);
  res.json({ message: "Note deleted", success: true });
});

module.exports.getNoteEditors = asyncErrorCatcher(async (req, res) => {
  const noteId = await req.params.id;
  const noteEditors = noteEditors[noteId] || [];
  res.json({ data: noteEditors, success: true });
});
