import express from "express";
import authRoutes from "./route/auth.js";
import userRoutes from "./route/user.js";
import todosRoutes from "./route/todos.js";

// Application Express (sans démarrage ni connexion DB) — réutilisée par
// index.js (prod / Atlas) et dev-server.js (base en mémoire).
export const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (req, res) => {
  res.json({ msg: "backend OK" });
});

app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/todos", todosRoutes);

// Gestionnaire d'erreurs (Express 5 capture les erreurs async automatiquement).
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: "Erreur serveur" });
});
