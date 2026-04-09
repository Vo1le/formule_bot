# 🎲 Aura Bot — Case Opening Discord

Bot Discord de case opening d'auras style **Sol's RNG**, avec intégration **UnbelievaBoat** pour les pièces et animations d'ouverture par édition de messages.

---

## 📁 Structure

```
aura-bot/
├── commands/
│   ├── open.js          ← /open — ouvrir une case
│   ├── inventory.js     ← /inventory — voir ses auras
│   ├── sell.js          ← /sell — revendre une aura
│   ├── cases.js         ← /cases — voir les probabilités
│   ├── balance.js       ← /balance — voir son solde UNB
│   └── leaderboard.js   ← /leaderboard — classement
├── data/
│   ├── auras.js         ← Définition de toutes les auras
│   └── inventory.json   ← Inventaires (généré automatiquement)
├── utils/
│   ├── unb.js           ← Wrapper API UnbelievaBoat
│   ├── inventory.js     ← Gestion inventaire (lecture/écriture JSON)
│   ├── rollAura.js      ← Logique de tirage
│   └── animation.js     ← Animation d'ouverture (édition d'embed)
├── index.js             ← Entrée principale du bot
├── deploy-commands.js   ← Script d'enregistrement des slash commands
├── package.json
└── example.env
```

---

## 🚀 Installation locale

```bash
# 1. Cloner et installer
git clone <ton-repo>
cd aura-bot
npm install

# 2. Configurer l'environnement
cp example.env .env
# Remplir les 4 variables dans .env

# 3. Enregistrer les commandes slash (une seule fois)
npm run deploy

# 4. Lancer le bot
npm start
```

---

## ⚙️ Variables d'environnement

| Variable        | Valeur                          | Source                                             |
|-----------------|---------------------------------|----------------------------------------------------|
| `DISCORD_TOKEN` | Token du bot                    | Discord Dev Portal → Bot → Reset Token             |
| `CLIENT_ID`     | Application ID                  | Discord Dev Portal → General Information           |
| `GUILD_ID`      | ID du serveur Discord           | Clic droit sur serveur → Copier l'ID (Developer Mode) |
| `UNB_TOKEN`     | Token API UnbelievaBoat         | https://unbelievaboat.com/applications             |

### Obtenir le token UNB
1. Aller sur [unbelievaboat.com/applications](https://unbelievaboat.com/applications)
2. Se connecter avec Discord
3. Créer une application → copier le token
4. **Header d'auth** : `Authorization: <token>` (pas de préfixe "Bearer")

---

## ☁️ Déploiement sur Render (gratuit)

### 1. Créer le repo GitHub
```bash
git init && git add .
git commit -m "init: aura bot"
git remote add origin https://github.com/TOI/aura-bot.git
git push -u origin main
```

### 2. Créer un Web Service sur Render
- Type : **Web Service** (ou Background Worker si disponible)
- Build Command : `npm install`
- Start Command : `npm start`
- Instance : **Free**

### 3. Ajouter les variables d'environnement dans Render
Dans Dashboard → ton service → **Environment** → ajouter les 4 variables.

### ⚠️ Note persistance
Sur Render free tier, le système de fichiers est éphémère : `data/inventory.json` est réinitialisé à chaque redémarrage. Pour une persistance durable, remplace le système de fichiers par une base de données (ex: [Neon.tech](https://neon.tech) PostgreSQL gratuit ou [MongoDB Atlas](https://www.mongodb.com/atlas) M0 gratuit).

---

## 🎮 Commandes

| Commande | Description |
|----------|-------------|
| `/open <case>` | Ouvrir une case avec animation |
| `/cases` | Voir toutes les cases disponibles |
| `/cases <case>` | Probabilités détaillées d'une case |
| `/inventory` | Voir ses auras (paginé) |
| `/inventory <joueur>` | Voir l'inventaire d'un autre joueur |
| `/sell <numéro/nom>` | Revendre une aura (confirmation bouton) |
| `/balance` | Voir son solde UNB |
| `/leaderboard` | Top 10 joueurs (4 modes de tri) |

---

## 🎁 Cases disponibles

| Case | Prix | Contenu |
|------|------|---------|
| 📦 Basique | 100 🪙 | Toutes les raretés, chances classiques |
| 💜 Premium | 500 🪙 | Commun -50%, Rare+, Épique x3 |
| ✨ Légendaire | 2000 🪙 | Minimum Rare, Légendaire x10, Secret x15 |

---

## ✨ Auras (19 au total)

| Rareté | Auras | Chance approx. |
|--------|-------|----------------|
| ⚪ Commun | Ember, Frost, Mud, Wind, Stone | 1/10 à 1/18 |
| 🟢 Peu Commun | Lightning, Nature, Shadow, Ocean | 1/50 à 1/75 |
| 🔵 Rare | Inferno, Storm, Crystal, Void | 1/250 à 1/500 |
| 🟣 Épique | Dragon, Aurora, Soul | 1/2500 à 1/4000 |
| 🟡 Légendaire | Celestial, Galaxy | 1/10000 à 1/15000 |
| ⚡ Secret | Divinity, Oblivion | 1/100000 à 1/250000 |

---

## 💡 Ajouter des auras

Édite `data/auras.js` et ajoute un objet dans le tableau `AURAS` :

```js
{
  id: "mon_aura",
  name: "Mon Aura",
  rarity: "Rare",        // Commun | Peu Commun | Rare | Épique | Légendaire | Secret
  emoji: "🌟",
  color: 0xFF0000,       // couleur hex de l'embed
  chance: 500,           // 1 sur 500
  sellPrice: 1000,       // pièces UNB de revente
  description: "Une description.",
  frames: ["🌑","🌟","✨🌟","🌟✨🌟","🌟"],  // frames d'animation
},
```
