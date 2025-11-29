# 🚀 Guide de Déploiement - GAL Website sur GitHub Pages

## 📋 Vue d'ensemble

Ce guide vous permet de déployer votre site GAL sur GitHub Pages avec **toutes les données** (fichiers JSON) incluses.

---

## 📦 Fichiers de Base de Données (JSON)

Votre site utilise 7 fichiers JSON comme base de données :

```
data/
├── blog.json           # Articles de blog
├── formations.json     # Formations disponibles
├── machines.json       # Catalogue de machines
├── media-index.json    # Index des médias
├── newsletter.json     # Abonnés newsletter
├── pages.json          # Contenu des pages
└── videos.json         # Vidéos
```

**Important** : Ces fichiers sont essentiels au fonctionnement du site et doivent être déployés !

---

## 🔧 Étape 1 : Vérifier que Git est installé

```powershell
git --version
```

Si Git n'est pas installé : https://git-scm.com/download/win

---

## 🎯 Étape 2 : Initialiser Git (si ce n'est pas déjà fait)

```powershell
cd C:\Users\USER\Desktop\GAL_Web

# Initialiser Git
git init

# Configurer votre identité (une seule fois)
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"
```

---

## 📝 Étape 3 : Créer/Vérifier le fichier .gitignore

Créez un fichier `.gitignore` pour exclure les fichiers inutiles :

```
# Fichiers système
.DS_Store
Thumbs.db
desktop.ini

# Fichiers de backup
*.backup
*.bak
*~

# Dossier .gemini (documentation interne uniquement)
.gemini/

# Node modules (si vous en avez)
node_modules/

# Logs
*.log

# Fichiers temporaires
tmp/
temp/
```

**⚠️ Ne PAS exclure** : `data/` ni les fichiers `.json` !

---

## 📤 Étape 4 : Committer tous les fichiers

```powershell
# Se positionner dans le dossier
cd C:\Users\USER\Desktop\GAL_Web

# Vérifier l'état
git status

# Ajouter TOUS les fichiers (y compris les JSON)
git add .

# Vérifier que les fichiers JSON sont bien ajoutés
git status | Select-String "data/"

# Créer le commit
git commit -m "🚀 Déploiement complet GAL Website avec base de données JSON

✅ Inclus dans ce déploiement :
- Page d'accueil modernisée (sans stats, boutons arrondis)
- Admin Dashboard avec 14 sections
- Système de réservations machines
- Système d'inscriptions formations
- Chatbot intelligent Lumu
- 7 fichiers JSON base de données
- Toutes les pages HTML optimisées
- Assets et médias
- Scripts JavaScript modulaires
"
```

---

## 🌐 Étape 5 : Connecter à GitHub

### Option A : Nouveau dépôt

```powershell
# Créer un nouveau repo sur GitHub.com
# Nom suggéré : gal-lubumbashi

# Connecter le repo local au repo distant
git remote add origin https://github.com/VOTRE_USERNAME/gal-lubumbashi.git

# Vérifier la connexion
git remote -v
```

### Option B : Repo existant

```powershell
# Si vous avez déjà un repo
git remote set-url origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
```

---

## 🚀 Étape 6 : Pousser vers GitHub

```powershell
# Renommer la branche en 'main' (recommandé)
git branch -M main

# Pousser vers GitHub
git push -u origin main
```

**Si authentification requise** :
- Utilisez un Personal Access Token (PAT) au lieu du mot de passe
- Créez-le sur : https://github.com/settings/tokens

---

## ⚙️ Étape 7 : Activer GitHub Pages

1. Allez sur votre repo GitHub
2. Cliquez sur **Settings** (⚙️)
3. Dans le menu gauche, cliquez sur **Pages**
4. Sous **Source**, sélectionnez :
   - Branch: `main`
   - Folder: `/ (root)`
5. Cliquez sur **Save**

---

## 🔍 Étape 8 : Vérifier le déploiement

Après 2-3 minutes, votre site sera accessible à :

```
https://VOTRE_USERNAME.github.io/VOTRE_REPO/
```

### ✅ Checklist de vérification

Testez ces éléments sur le site déployé :

- [ ] Page d'accueil s'affiche correctement
- [ ] Boutons héro sont arrondis et de bonne taille
- [ ] Navigation fonctionne
- [ ] Page Vidéos charge les données JSON
- [ ] Page Formations charge les données JSON
- [ ] Page Machines charge les données JSON
- [ ] Page Blog charge les données JSON
- [ ] Chatbot Lumu s'affiche et répond
- [ ] Admin login fonctionne
- [ ] Espace membre login fonctionne

---

## 🛠️ Étape 9 : Déploiements futurs

Pour mettre à jour le site après modifications :

```powershell
# Se positionner dans le dossier
cd C:\Users\USER\Desktop\GAL_Web

# Vérifier les changements
git status

# Ajouter les modifications
git add .

# Committer avec un message descriptif
git commit -m "Description de vos changements"

# Pousser vers GitHub
git push
```

**Le site sera automatiquement mis à jour en 2-3 minutes !**

---

## 📊 Étape 10 : Vérifier que les JSON sont déployés

Une fois le site en ligne, vérifiez que les JSON sont accessibles :

```
https://VOTRE_USERNAME.github.io/VOTRE_REPO/data/machines.json
https://VOTRE_USERNAME.github.io/VOTRE_REPO/data/formations.json
https://VOTRE_USERNAME.github.io/VOTRE_REPO/data/videos.json
https://VOTRE_USERNAME.github.io/VOTRE_REPO/data/blog.json
```

Si vous obtenez le contenu JSON → ✅ Parfait !

---

## 🐛 Dépannage

### Problème : "Failed to load module script"

**Solution** : Vérifiez les chemins dans vos scripts

Dans `index.html`, changez :
```html
<script type='module' src='../js/pages/home.js'></script>
```
En :
```html
<script type='module' src='js/pages/home.js'></script>
```

### Problème : Fichiers JSON non trouvés

**Vérifiez** :
```powershell
git ls-files | Select-String "data/"
```

Si rien n'apparaît, les JSON n'ont pas été commitées :
```powershell
git add data/*.json
git commit -m "Ajout fichiers JSON base de données"
git push
```

### Problème : Page blanche

1. Ouvrez la console (F12)
2. Vérifiez les erreurs
3. Solutions courantes :
   - Chemins de fichiers incorrects
   - CORS (normal en local, pas sur GitHub Pages)
   - Fichiers manquants

---

## 📁 Structure finale déployée

```
VOTRE_REPO/
├── index.html                 # Page d'accueil
├── admin/
│   ├── index.html            # Dashboard admin
│   └── login.html            # Login admin
├── membres/
│   ├── login.html            # Login membres
│   └── dashboard.html        # Dashboard membres
├── html/
│   ├── about.html
│   ├── blog.html
│   ├── contact.html
│   ├── faq.html
│   ├── formations.html
│   ├── machines.html
│   ├── privacy.html
│   └── videos.html
├── css/
│   ├── animations.css
│   ├── components.css
│   └── style.css
├── js/
│   ├── admin.js
│   ├── app.js
│   ├── chatbot.js
│   ├── chatbot-standalone.js
│   ├── i18n.js
│   ├── menu.js
│   ├── router.js
│   ├── storage.js
│   └── pages/
│       ├── admin.js
│       ├── home.js
│       └── ...
├── data/ ⭐ IMPORTANT
│   ├── blog.json
│   ├── formations.json
│   ├── machines.json
│   ├── media-index.json
│   ├── newsletter.json
│   ├── pages.json
│   └── videos.json
└── public/
    ├── logo-gal-official.jpg
    └── images/
```

---

## 🎉 Succès !

Une fois toutes ces étapes complétées, votre site GAL sera en ligne avec :

✅ Toutes les pages HTML  
✅ Tous les scripts JavaScript  
✅ Toutes les données JSON  
✅ Admin fonctionnel  
✅ Espace membre fonctionnel  
✅ Chatbot Lumu opérationnel  
✅ Système de réservations  
✅ Système d'inscriptions  

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les fichiers sur GitHub
3. Vérifiez que les JSON sont bien commités : `git ls-files data/`

---

**Date de création** : 29 novembre 2025  
**Version** : 1.0 - Déploiement complet avec base de données  
**Statut** : ✅ Prêt pour le déploiement
