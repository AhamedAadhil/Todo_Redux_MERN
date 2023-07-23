const router = require("express").Router();
const userController = require("../controller/userController");
const isAuthenticated = require("../middleware/userAuthentication");

router.get("/profile/:id", isAuthenticated, userController.getUser);
router.patch("/profile/update/:id", isAuthenticated, userController.updateUser);
router.delete("/profile/delete", isAuthenticated, userController.deleteAccout);

module.exports = router;
