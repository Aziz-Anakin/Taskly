import express from "express";
import { auth } from "../auth.js";
import { User } from "../models/User.js";
import { Todo } from "../models/Todo.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ msg: "Utilisateur non trouvé" });
  }
  res.json(user);
});

router.get("/todos", auth, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ created_at: -1 });
  res.json(todos);
});

export default router;
