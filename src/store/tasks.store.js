function loadInitialTasks() {
  try {
    // task.json is used only to seed the in-memory store on startup
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const parsed = require("../../task.json");
    if (!parsed || !Array.isArray(parsed.tasks)) return [];
    const loadedAt = new Date().toISOString();
    return parsed.tasks
      .filter((t) => t && typeof t.id === "number")
      .map((t) => ({
        id: t.id,
        title: typeof t.title === "string" ? t.title : "",
        description: typeof t.description === "string" ? t.description : "",
        completed: Boolean(t.completed),
        priority: "low",
        createdAt: loadedAt,
      }));
  } catch {
    return [];
  }
}

let tasks = loadInitialTasks();
let nextId = tasks.reduce((max, t) => (t.id > max ? t.id : max), 0) + 1;

function getAllTasks() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find((t) => t.id === id) || null;
}

function createTask({ title, description, completed, priority }) {
  const task = {
    id: nextId++,
    title,
    description,
    completed,
    priority,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

function updateTask(id, { title, description, completed, priority }) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const updated = {
    ...tasks[idx],
    id,
    title,
    description,
    completed,
    priority,
  };
  tasks[idx] = updated;
  return updated;
}

function deleteTask(id) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
