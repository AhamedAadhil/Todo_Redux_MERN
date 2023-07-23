const router = require("express").Router();
const noteController = require("../controller/noteController");
const isAuthenticated = require("../middleware/userAuthentication");

router.post("/create", isAuthenticated, noteController.create);
router.get("/getAll", isAuthenticated, noteController.getallNotes);
router.get("/get/:id", isAuthenticated, noteController.getSingleNote);
router.patch("/update/:id", isAuthenticated, noteController.updateNote);
router.delete("/delete/:id", isAuthenticated, noteController.deleteNote);
router.patch("/mac/:id", isAuthenticated, noteController.markasComplete);
router.patch("/maic/:id", isAuthenticated, noteController.markasinComplete);
router.get("/completed", isAuthenticated, noteController.getCompletedNotes);
router.get("/incompleted", isAuthenticated, noteController.getInCompletedNotes);

module.exports = router;
