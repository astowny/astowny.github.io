# astowny.github.io

Portfolio de **Tony Duong** — Ingénieur Fullstack & IA.
En ligne : https://astowny.github.io

Site statique, **zéro build**, déployé sur GitHub Pages. Fond 3D interactif
(Three.js, réseau de neurones réactif à la souris), bilingue **FR / EN**,
animations au scroll, projets filtrables.

## Structure

| Fichier      | Rôle |
|--------------|------|
| `index.html` | structure des sections + import map Three.js |
| `style.css`  | thème teal (repris du CV), glassmorphism, responsive |
| `bg.js`      | scène 3D Three.js (module ES, via CDN jsDelivr) |
| `script.js`  | rendu du contenu depuis `data.json`, i18n, filtres, curseur, scroll-spy |
| `data.json`  | **tout le contenu** (profil, compétences, expérience, projets, formation) |

## Mettre à jour le contenu

Tout vit dans `data.json`. Les textes traduisibles sont des objets `{ "fr": "...", "en": "..." }`.

### Ajouter un projet
Ajoute un objet dans `projects` :

```jsonc
{
  "name": "Mon projet",
  "featured": true,                    // optionnel : badge "Phare"
  "category": "ai",                    // web3 | ai | vision | saas
  "tagline": { "fr": "...", "en": "..." },
  "description": { "fr": "...", "en": "..." },
  "tags": ["TypeScript", "AI"],
  "links": [
    { "label": "Live", "url": "https://..." },   // "Live" -> pastille verte animée
    { "label": "Code", "url": "https://github.com/..." }
  ]
}
```

La catégorie doit exister dans `projectFilters` (sinon ajoute-la). Pas d'autre changement.

## Local

```bash
# n'importe quel serveur statique (le fetch de data.json ne marche pas en file://)
python -m http.server 8000
# ou
npx serve .
```

Puis ouvre http://localhost:8000.

## Déploiement

GitHub Pages sert la branche `main` à la racine. Push = redéploiement automatique.
Aucun workflow nécessaire.

## Accessibilité / perf

- `prefers-reduced-motion` respecté (3D figée, animations désactivées).
- Fallback gradient si WebGL indisponible.
- Rendu 3D mis en pause quand l'onglet est masqué.
- Curseur custom désactivé sur écrans tactiles.
