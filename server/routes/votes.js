const express = require("express");
const router = express.Router();
const votesController = require("../controllers/votesController");
const authenticateToken = require("../middleware/auth");

router.get("/", votesController.getVote);
router.post("/", authenticateToken, votesController.vote);
router.patch("/", authenticateToken, votesController.changeVote);
router.delete("/", authenticateToken, votesController.deleteVote);

module.exports = router;
