# Taskly

Taskly est une petite application web de gestion de tâches. On peut créer un
compte, se connecter, puis ajouter, modifier, terminer et supprimer ses tâches.
L'interface est simple et va à l'essentiel.

## Technologies

- Frontend en React 19 avec Vite, Tailwind CSS v4, React Router et Motion
- API en Node.js avec Express 5, Mongoose, JWT et bcrypt
- Base de données MongoDB Atlas
- Jest, ESLint et Docker pour l'outillage

## Fonctionnalités

- Inscription et connexion par email et mot de passe avec JWT
- Création, modification et suppression de tâches (titre, description, date, statut)
- Quatre statuts possibles, non commencé, à faire, en cours et terminé
- Édition directe dans la liste et filtres côté client
- Interface responsive en pleine page, sans fenêtre modale

## Structure du projet

```
.
├── api/                # API Express (auth + todos, modèles Mongoose)
│   ├── models/         # schémas User et Todo
│   ├── route/          # routeurs auth / user / todos
│   └── index.js        # point d'entrée
├── web/                # frontend React (Vite + Tailwind)
│   └── src/            # pages, composants, lib
└── docker-compose.yml  # services api et web
```

## Démarrage rapide

Le plus simple pour lancer Taskly en local, sans installer de base de données.

```bash
npm install     # installe les dépendances racine, api et web
npm run dev     # lance l'API (MongoDB en mémoire) et le frontend
```

L'application tourne sur `http://localhost:5173` et l'API sur
`http://localhost:3000`. Un compte de démonstration existe déjà,
`demo@taskly.fr` avec le mot de passe `demo1234`.

Au premier lancement, un binaire MongoDB en mémoire est téléchargé
automatiquement puis mis en cache. Les données sont remises à zéro à chaque
redémarrage.

## Utiliser MongoDB Atlas

Pour avoir une base persistante, il faut faire pointer l'API vers un vrai
cluster. Copiez d'abord le fichier d'exemple.

```bash
cp .env.exemple .env
```

Trois variables sont à remplir. `PORT` est le port de l'API, par exemple 3000.
`SECRET` est la clé utilisée pour signer les tokens JWT. `MONGODB_URI` est la
chaîne de connexion MongoDB Atlas.

Ensuite on lance l'API et le frontend séparément.

```bash
cd api && npm install && npm start     # http://localhost:3000
cd web && npm install && npm run dev   # http://localhost:5173
```

Par défaut le frontend appelle l'API sur le port 3000 de l'hôte courant. On peut
changer ça avec la variable d'environnement `VITE_API_URL`.

## Lancer avec Docker

La base est hébergée sur MongoDB Atlas, donc seuls l'API et le frontend sont
conteneurisés. Une fois le fichier `.env` rempli.

```bash
docker compose up --build
```

Le frontend est alors disponible sur `http://localhost:8081` et l'API sur
`http://localhost:3000`.

## Tests

```bash
npm test          # lance les tests de l'API et du frontend
```

Ou séparément.

```bash
cd api && npm test   # middleware d'authentification
cd web && npm test   # helpers de date et de statut
```
---

Ce projet a été réalisé dans le cadre de ma formation à Epitech.