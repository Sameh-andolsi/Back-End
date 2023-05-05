const express = require("express");
const router = express.Router();
const employerController = require("../controller/employerController");

const authEmployer = require("../middleware/authEmployer");
router.post("/login", employerController.login);
router.post("/register", employerController.register);

router.post("/create", authMiddleware, employerController.create);
router.put("/update/:id", authMiddleware, employerController.update);
router.delete("/delete/:id", authMiddleware, employerController.remove);
router.get("/:id/jobOffers", employerController.listJobOffers);

module.exports = router;
