# astowny.github.io

Portfolio statique déployé sur GitHub Pages : https://astowny.github.io

## Mettre à jour les projets

Tout vit dans `data.json`. Édite ce fichier, commit, push — Pages redéploie automatiquement.

```jsonc
{
  "profile": { "name": "...", "tagline": "...", "links": [ ... ] },
  "sections": [
    {
      "id": "github",                 // utilisé pour l'ancre #section-github
      "title": "GitHub",
      "subtitle": "...",
      "items": [
        {
          "name": "Mon projet",
          "description": "Une phrase.",
          "tags": ["TypeScript", "AI"],
          "links": [
            { "label": "Live", "url": "https://..." },
            { "label": "Code", "url": "https://github.com/..." }
          ]
        }
      ]
    }
  ]
}
```

### Ajouter un projet
Ouvre `data.json`, repère la section (`github`, `vercel`, `ai-studio`, `skilance`, …), ajoute un objet dans `items`. Pas besoin d'autre changement.

### Ajouter une nouvelle plateforme
Ajoute un objet dans `sections` avec un `id` unique. La nav et la section apparaissent automatiquement.

## Stack

- Static HTML/CSS/JS, zéro framework, zéro build.
- Dark/light auto avec toggle (préférence système + localStorage).
- Données séparées dans `data.json` pour édition rapide.

## Déploiement

GitHub Pages sert la branche `main` à la racine. Aucun workflow nécessaire.

## Local

```bash
# n'importe quel serveur statique fait l'affaire
python -m http.server 8000
# ou
npx serve .
```

Puis ouvre http://localhost:8000.
