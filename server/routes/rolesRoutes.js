const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/rolesController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

router.get("/", authenticateToken, isAdmin, rolesController.getAllRoles);
router.post("/assign", authenticateToken, isAdmin, rolesController.assignRole);
router.delete(
  "/remove",
  authenticateToken,
  isAdmin,
  rolesController.removeRole,
);

module.exports = router;
