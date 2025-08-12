# 🚀 Guide de Déploiement Render - Portfolio Irina Laurà

## Configuration Render

### 1. Paramètres du Service
- **Type**: Static Site
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist/ai-portfolio/browser`

### 2. Variables d'environnement (optionnel)
```
NODE_VERSION=18
```

### 3. Fichiers de configuration inclus
- `_redirects` - Gestion des routes SPA
- `render.yaml` - Configuration automatique
- `manifest.json` - PWA support

## Dépannage

### Erreur "Not Found"
✅ **Solution appliquée**: Fichier `_redirects` avec règle `/* /index.html 200`

### Erreur de build
- Vérifier Node.js version 18+
- Vérifier que `npm ci` s'exécute correctement
- Vérifier le chemin de publication: `dist/ai-portfolio/browser`

## Structure finale
```
dist/ai-portfolio/browser/
├── _redirects          # Redirection SPA
├── index.html          # Point d'entrée
├── main-*.js          # Application Angular
├── styles-*.css       # Styles
├── polyfills-*.js     # Polyfills
├── images/            # Images du portfolio
├── favicon.svg        # Icône moderne
└── manifest.json      # PWA manifest
```

## URL de déploiement
Une fois déployé, votre portfolio sera accessible sur votre domaine Render.

🎨 **Portfolio d'Irina Laurà - Créatrice d'Images IA**
