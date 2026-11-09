const router = require("express").Router();
const {
  listTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate
} = require("../controllers/templateController");
const { protect } = require("../middleware/auth");

router.get("/", listTemplates);
router.get("/:key", getTemplate);
router.post("/", protect, createTemplate);
router.put("/:id", protect, updateTemplate);
router.delete("/:id", protect, deleteTemplate);

module.exports = router;
