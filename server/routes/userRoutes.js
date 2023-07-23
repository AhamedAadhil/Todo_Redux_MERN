const router = require("express").Router();
const userController = require("../controller/userController");
const isAuthenticated = require("../middleware/userAuthentication");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.delete("/logout", isAuthenticated, userController.logout);

module.exports = router;
