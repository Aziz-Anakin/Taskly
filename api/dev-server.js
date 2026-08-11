// Serveur de DÉVELOPPEMENT : démarre une base MongoDB en mémoire (aucune
// installation requise) et insère un compte de démo + quelques tâches.
// Les données sont réinitialisées à chaque lancement.
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { app } from "./app.js";
import { User } from "./models/User.js";
import { Todo } from "./models/Todo.js";

process.env.SECRET = process.env.SECRET || "dev_secret_change_me";
const PORT = process.env.PORT || 3000;

const DEMO = { email: "demo@taskly.fr", password: "demo1234" };

const mongod = await MongoMemoryServer.create();
await mongoose.connect(mongod.getUri());
console.log("Base MongoDB en mémoire démarrée (réinitialisée à chaque lancement).");

await seedDemo();

app.listen(PORT, () => {
  console.log(`API (dev) sur http://localhost:${PORT}`);
  console.log(`Compte de démo  ->  ${DEMO.email}  /  ${DEMO.password}`);
});

async function seedDemo() {
  const password = await bcrypt.hash(DEMO.password, 10);
  const user = await User.create({
    email: DEMO.email,
    password,
    name: "Taskly",
    firstname: "Démo",
  });

  const day = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  };

  await Todo.insertMany([
    { title: "Préparer la présentation", description: "Finaliser les slides du projet Taskly", due_time: day(1), status: "in progress", user: user._id },
    { title: "Faire les courses", description: "Acheter du pain, du lait et des œufs", due_time: day(2), status: "todo", user: user._id },
    { title: "Rendez-vous médecin", description: "Consultation annuelle à 14h", due_time: day(5), status: "not started", user: user._id },
    { title: "Réviser l'examen", description: "Chapitres 4 à 7 d'algorithmique", due_time: day(-1), status: "done", user: user._id },
  ]);
}
