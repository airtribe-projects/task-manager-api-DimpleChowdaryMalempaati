const express = require("express");
const {
  listTasks,
  listTasksByPriority,
  getTask,
  postTask,
  putTask,
  removeTask,
} = require("../controllers/tasks.controller");

const router = express.Router();

router.get("/", listTasks);
router.get("/priority/:level", listTasksByPriority);
router.get("/:id", getTask);
router.post("/", postTask);
router.put("/:id", putTask);
router.delete("/:id", removeTask);

module.exports = router;
