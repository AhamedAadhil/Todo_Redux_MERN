const Note = require("../model/note");

// create note controller
const create = async (req, res) => {
  const { title, body } = req.body;
  const userId = req.user.id;
  try {
    const newNote = new Note({
      title,
      body,
      userId,
    });

    const saveNote = await newNote.save();
    res.status(200).json({ note: saveNote });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

// get all note controller
const getallNotes = async (req, res) => {
  const userId = req.user.id;
  try {
    const allnotes = await Note.find({ userId });
    if (allnotes.length === 0) {
      res.status(200).json({ message: "No notes found for this user!" });
      return;
    }
    res.status(200).json({ notes: allnotes });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

// get single note controller
const getSingleNote = async (req, res) => {
  const _id = req.params.id;
  try {
    const note = await Note.findById({ _id });
    if (!note) {
      res.status(400).json({ message: "Note Not Found!" });
      return;
    }
    res.status(200).json({ note: note });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

// update a note controller
const updateNote = async (req, res) => {
  const _id = req.params.id;
  const { title, body } = req.body;
  const updates = {};
  try {
    if (title) {
      updates.title = title;
    }
    if (body) {
      updates.body = body;
    }
    const updatedNote = await Note.findByIdAndUpdate(_id, updates, {
      new: true,
    });
    if (!updatedNote) {
      res.status(400).json({ message: "Note Not Updated!" });
      return;
    }
    res
      .status(200)
      .json({ message: "Note Updated Successfully!", updatedNote });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

// delete a note controller
const deleteNote = async (req, res) => {
  const _id = req.params.id;
  try {
    const deleteNote = await Note.findByIdAndDelete(_id);
    if (!deleteNote) {
      res.status(400).json({ message: "Note Not Found!" });
      return;
    }
    res.status(200).json({ message: "Note Deleted!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

// mark as complete Controller
const markasComplete = async (req, res) => {
  const _id = req.params.id;
  try {
    const markedNote = await Note.findByIdAndUpdate(
      _id,
      { isCompleted: true },
      { new: true }
    );
    if (!markedNote) {
      res.status(400).json({ message: "Note isn't marked as Completed!" });
      return;
    }
    res
      .status(200)
      .json({ message: "Note marked as completed!", note: markedNote });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

// mark as incomplete Controller
const markasinComplete = async (req, res) => {
  const _id = req.params.id;
  try {
    const markedNote = await Note.findByIdAndUpdate(
      _id,
      { isCompleted: false },
      { new: true }
    );
    if (!markedNote) {
      res.status(400).json({ message: "Note isn't marked as inCompleted!" });
      return;
    }
    res
      .status(200)
      .json({ message: "Note marked as incompleted!", note: markedNote });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

// get completed notes Controller
const getCompletedNotes = async (req, res) => {
  const { id } = req.user;
  try {
    const completed = await Note.find({ userId: id, isCompleted: true });
    res.status(200).json({ completed: completed });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

// get incompleted notes Controller
const getInCompletedNotes = async (req, res) => {
  const { id } = req.user;
  try {
    const incompleted = await Note.find({ userId: id, isCompleted: false });
    res.status(200).json({ incompleted: incompleted });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

module.exports = {
  create,
  getallNotes,
  getSingleNote,
  updateNote,
  deleteNote,
  markasComplete,
  markasinComplete,
  getCompletedNotes,
  getInCompletedNotes,
};
