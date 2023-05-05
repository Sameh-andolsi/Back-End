const express = require("express");
const router = express.Router();
const developerController = require("../controllers/developerController");
const authMiddleware = require("../middleware/auth");

router.post("/register", developerController.register);
router.post("/login", developerController.login);
router.put("/profile", authMiddleware, developerController.updateProfile);
router.post("/profile", authMiddleware, developerController.createProfile);
router.delete("/profile", authMiddleware, developerController.deleteProfile);

module.exports = router;
