let noteEditors = {};

const setNoteEdits = (noteId, userInfo, socketId) => {
  if (!noteEditors[noteId]) {
    noteEditors[noteId] = [];
  }
  if (!noteEditors[noteId].find((user) => user.socketId === socketId)) {
    noteEditors[noteId].push({
      ...userInfo,
      socketId,
    });
  }
};

const removeNoteEdits = (noteId, socketId) => {
  if (noteEditors[noteId]) {
    noteEditors[noteId] = noteEditors[noteId].filter(
      (user) => user.socketId !== socketId
    );
  }
};

const disconnectNoteEdits = (socketId) => {
  Object.keys(noteEditors).forEach((noteId) => {
    noteEditors[noteId] = noteEditors[noteId].filter(
      (user) => user.socketId !== socketId
    );
  });
};

console.log(noteEditors);

const socketRoute = (socket, io) => {
  console.log("User connected" + socket.id);

  socket.on("new_note", (data) => {
    io.emit("new_note", data);
  });

  socket.on("update_note", (data) => {
    io.emit("update_note", data);
  });

  socket.on("delete_note", (data) => {
    io.emit("delete_note", data);
  });

  socket.on("note_edit_start", (data) => {
    setNoteEdits(data.noteId, data.userInfo, socket.id);
    io.emit("note_edit_start", {
      ...data?.userInfo,
      socketId: socket.id,
      noteId: data.noteId,
    });
  });

  socket.on("note_edit_end", (data) => {
    removeNoteEdits(data.noteId, socket.id);
    io.emit("note_edit_end", {
      ...data?.userInfo,
      socketId: socket.id,
      noteId: data.noteId
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected" + socket.id);
    io.emit("disconnectUser", socket.id);
    disconnectNoteEdits(socket.id);
  });
};

module.exports = { socketRoute, noteEditors };
