const {
  createNote,
  getAllNotes,
  getMyNotes,
  updateNote,
  deleteNote,
  getNoteEditors,
} = require("../controller/noteController");
const authMiddleware = require("../middleware/authMIddleware");

const router = require("express").Router();

router.post("/create", authMiddleware, createNote);
router.get("/get-all", authMiddleware, getAllNotes);
router.get("/get-my", authMiddleware, getMyNotes);
router.put("/update/:id", authMiddleware, updateNote);
router.delete("/delete/:id", authMiddleware, deleteNote);
router.get("/editors/:id", authMiddleware, getNoteEditors);

module.exports = router;
