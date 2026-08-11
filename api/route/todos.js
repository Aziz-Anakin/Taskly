import express from "express";
import { auth } from "../auth.js";
import { Todo } from "../models/Todo.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ created_at: -1 });
  res.json(todos);
});

router.get("/:id", auth, async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return res.status(404).json({ msg: "Tâche non trouvée" });
  }
  res.json(todo);
});

router.post("/", auth, async (req, res) => {
  const { title, description, due_time, status } = req.body;
  if (!title || !description || !due_time) {
    return res.status(400).json({ msg: "Titre, description et date requis" });
  }
  const todo = await Todo.create({
    title,
    description,
    due_time,
    status: status || "todo",
    user: req.user.id,
  });
  res.json(todo);
});

router.put("/:id", auth, async (req, res) => {
  const { title, description, due_time, status } = req.body;
  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (due_time !== undefined) update.due_time = due_time;
  if (status !== undefined) update.status = status;

  const todo = await Todo.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!todo) {
    return res.status(404).json({ msg: "Tâche non trouvée" });
  }
  res.json(todo);
});

router.delete("/:id", auth, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ msg: "Tâche supprimée" });
});

export default router;
