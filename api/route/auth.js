import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name, firstname } = req.body;
  if (!email || !password || !name || !firstname) {
    return res.status(400).json({ msg: "Tous les champs sont requis" });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ msg: "Cet email est déjà utilisé" });
  }
  const passwordCrypte = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: passwordCrypte,
    name,
    firstname,
  });
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET);
  res.json({ token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Email et mot de passe requis" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ msg: "Email ou mot de passe incorrect" });
  }
  const motDePasseOk = await bcrypt.compare(password, user.password);
  if (!motDePasseOk) {
    return res.status(401).json({ msg: "Email ou mot de passe incorrect" });
  }
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET);
  res.json({ token });
});

export default router;
