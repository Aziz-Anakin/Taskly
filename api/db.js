import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Charge le .env situé à la racine du projet, quel que soit le dossier de lancement.
dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
});

// Connexion à MongoDB Atlas (chaîne de connexion dans MONGODB_URI).
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI manquant : renseignez votre chaîne MongoDB Atlas dans le .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connecté");
  } catch (err) {
    console.error("Échec de connexion à MongoDB :", err.message);
    process.exit(1);
  }
}
