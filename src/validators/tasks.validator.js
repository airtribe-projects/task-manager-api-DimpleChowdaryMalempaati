function validateTaskPayload(payload) {
  if (!payload || typeof payload !== "object") return "Invalid JSON body";
  const { title, description, completed, priority } = payload;
  if (typeof title !== "string" || title.trim().length === 0)
    return "title is required";
  if (typeof description !== "string" || description.trim().length === 0)
    return "description is required";
  if (typeof completed !== "boolean") return "completed must be boolean";
  if (
    priority !== undefined &&
    !["low", "medium", "high"].includes(String(priority).toLowerCase())
  ) {
    return "priority must be one of: low, medium, high";
  }
  return null;
}

module.exports = { validateTaskPayload };
