import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Charge le .env situé à la racine du projet, quel que soit le dossier de lancement.
dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
});

import { app } from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("API running on port " + PORT);
  });
});
