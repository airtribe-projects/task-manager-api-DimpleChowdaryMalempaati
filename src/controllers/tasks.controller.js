const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../store/tasks.store");
const { validateTaskPayload } = require("../validators/tasks.validator");

function normalizePriority(value, fallback = "low") {
  if (value === undefined || value === null || String(value).trim() === "") {
    return fallback;
  }
  return String(value).toLowerCase();
}

function parseTaskId(req) {
  const taskId = Number(req.params.id);
  return Number.isFinite(taskId) ? taskId : null;
}

function normalizeTaskInput(body) {
  return {
    title: body.title.trim(),
    description: body.description.trim(),
    completed: body.completed,
    priority: normalizePriority(body.priority),
  };
}

function validateOrRespondBadRequest(req, res) {
  const errorMessage = validateTaskPayload(req.body);
  if (!errorMessage) return null;
  res.status(400).json({ error: errorMessage });
  return errorMessage;
}

function parseCompletedQuery(value) {
  if (value === undefined) return null;
  if (value === true || value === false) return value;
  if (typeof value !== "string") return null;
  const v = value.toLowerCase();
  if (v === "true") return true;
  if (v === "false") return false;
  return null;
}

function sortByCreatedAt(taskList, order = "desc") {
  const direction = String(order).toLowerCase() === "asc" ? 1 : -1;
  return [...taskList].sort((a, b) => {
    const at = Date.parse(a.createdAt || 0);
    const bt = Date.parse(b.createdAt || 0);
    return (at - bt) * direction;
  });
}

function respondNotFound(res, message = "Not found") {
  return res.status(404).json({ error: message });
}

function listTasks(req, res) {
  let result = [...getAllTasks()];

  // Filtering: /tasks?completed=true|false
  const completedFilter = parseCompletedQuery(req.query.completed);
  if (completedFilter !== null) {
    result = result.filter((t) => t.completed === completedFilter);
  }

  // Sorting: /tasks?sort=createdAt&order=asc|desc
  if (String(req.query.sort || "").toLowerCase() === "createdat") {
    result = sortByCreatedAt(result, req.query.order);
  }

  return res.status(200).json(result);
}

function getTask(req, res) {
  const taskId = parseTaskId(req);
  if (taskId === null) return respondNotFound(res, "Invalid task id");

  const task = getTaskById(taskId);
  if (!task) return respondNotFound(res, "Task not found");
  return res.status(200).json(task);
}

function listTasksByPriority(req, res) {
  const level = String(req.params.level || "").toLowerCase();
  if (!["low", "medium", "high"].includes(level))
    return respondNotFound(res, "Invalid priority level");
  const result = getAllTasks().filter((t) => t.priority === level);
  return res.status(200).json(result);
}

function postTask(req, res) {
  if (validateOrRespondBadRequest(req, res)) return;

  const task = createTask(normalizeTaskInput(req.body));
  return res.status(201).json(task);
}

function putTask(req, res) {
  const taskId = parseTaskId(req);
  if (taskId === null) return respondNotFound(res, "Invalid task id");

  if (validateOrRespondBadRequest(req, res)) return;

  const existing = getTaskById(taskId);
  if (!existing) return respondNotFound(res, "Task not found");

  const normalized = normalizeTaskInput(req.body);
  const updated = updateTask(taskId, {
    ...normalized,
    priority: normalizePriority(req.body.priority, existing.priority || "low"),
  });
  if (!updated) return respondNotFound(res, "Task not found");
  return res.status(200).json(updated);
}

function removeTask(req, res) {
  const taskId = parseTaskId(req);
  if (taskId === null) return respondNotFound(res, "Invalid task id");

  const deleted = deleteTask(taskId);
  if (!deleted) return respondNotFound(res, "Task not found");
  return res.status(200).json({ message: "Task deleted successfully", id: taskId });
}

module.exports = {
  listTasks,
  listTasksByPriority,
  getTask,
  postTask,
  putTask,
  removeTask,
};
