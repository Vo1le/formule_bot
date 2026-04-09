# 🎲 Formules Bot — Case Opening Discord

Bot Discord de case opening de formules style **Sol's RNG**, avec intégration **UnbelievaBoat** pour les pièces et animations d'ouverture par édition de messages.

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
| `/solde` | Voir son solde UNB |
| `/leader_roll` | Top 10 joueurs (4 modes de tri) |

---

## 🎁 Cases disponibles

| Case | Prix | Contenu |
|------|------|---------|
| Case Basique 📦 | 100 🪙 | Toutes les raretés, chances classiques |
| Case Prépa 📚| 500 🪙 | Commun -50%, Rare+, Épique x3 |
| Case Normalien 🎓 | 2000 🪙 | Minimum Rare, Légendaire x10, Secret x15 |

---

## ✨ Formules (19 au total)

| Rareté |  | Chance approx. |
|--------|-------|----------------|
| ⚪ Commun |  | 1/10 à 1/18 |
| 🟢 Peu Commun |  | 1/50 à 1/75 |
| 🔵 Rare |  | 1/250 à 1/500 |
| 🟣 Épique |  | 1/2500 à 1/4000 |
| 🟡 Légendaire |  | 1/10000 à 1/15000 |
| ⚡ Secret |  | 1/100000 à 1/250000 |

---

## 💡 Ajouter des formules

Édite `data/auras.js` et ajoute un objet dans le tableau `AURAS` :

```js
{
  id: "ma_forumule",
  name: "nom",
  rarity: "Rare",        // Commun | Peu Commun | Rare | Épique | Légendaire | Secret
  emoji: "🌟",
  color: 0xFF0000,       // couleur hex de l'embed
  chance: 500,           // 1 sur 500
  sellPrice: 1000,       // pièces UNB de revente
  description: "Une description.",
  frames: ["🌑","🌟","✨🌟","🌟✨🌟","🌟"],  // frames d'animation
},
```

Made by : Volte. Discord : _volte_
