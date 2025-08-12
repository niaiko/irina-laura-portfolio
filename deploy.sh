#!/bin/bash
# Script de déploiement pour Render

echo "🔄 Installation des dépendances..."
npm ci

echo "🏗️  Build de l'application..."
npm run build

echo "📂 Vérification du dossier de sortie..."
ls -la dist/ai-portfolio/browser/

echo "✅ Build terminé - Prêt pour le déploiement!"
