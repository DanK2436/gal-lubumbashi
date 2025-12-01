# 🚀 Déploiement Rapide - GAL Lubumbashi

## 🎯 Deux Options de Backend

### Option A : LocalStorage + JSON (Simple, gratuit)
- ✅ Pas de configuration backend
- ✅ Données stockées localement dans le navigateur
- ⚠️ Les données ne sont pas synchronisées entre appareils

### Option B : Supabase (Base de données cloud)
- ✅ Données synchronisées en temps réel
- ✅ Authentification intégrée
- ✅ Gratuit jusqu'à 500 Mo
- 📖 Voir `DEPLOIEMENT_RAPIDE_SUPABASE.md` ou `SUPABASE_SETUP.md`

---

## Méthode 1️⃣ : Script Automatique (RECOMMANDÉ)

**Le plus simple !** Double-cliquez sur :
```
deployer.ps1
```

Le script va :
- ✅ Vérifier Git
- ✅ Vérifier tous les fichiers JSON
- ✅ Créer un commit
- ✅ Pousser vers GitHub
- ✅ Vous donner l'URL du site

---

## Méthode 2️⃣ : Commandes PowerShell

Ouvrez PowerShell dans le dossier et exécutez :

```powershell
# Ajouter tous les fichiers (y compris JSON)
git add .

# Créer un commit
git commit -m "🚀 Déploiement GAL Lubumbashi"

# Pousser vers GitHub
git push
```

---

## Méthode 3️⃣ : Guide Complet

Lisez le guide détaillé :
```
GUIDE_DEPLOIEMENT.md
```

---

## ⚠️ IMPORTANT

### Les fichiers JSON DOIVENT être déployés :

```
data/blog.json          ← Articles
data/formations.json    ← Formations
data/machines.json      ← Machines
data/videos.json        ← Vidéos
data/newsletter.json    ← Abonnés
data/pages.json         ← Pages
data/media-index.json   ← Médias
```

### Vérifier que les JSON sont inclus :

```powershell
git ls-files | Select-String "data/"
```

Si aucun résultat → Les JSON ne seront PAS déployés !

**Solution** :
```powershell
git add data/*.json
git commit -m "Ajout fichiers JSON"
git push
```

---

## 🗄️ Configuration Backend (Optionnel)

Pour activer **Supabase** (données synchronisées en cloud) :

1. Consultez le guide rapide : `DEPLOIEMENT_RAPIDE_SUPABASE.md`
2. Ou le guide complet : `SUPABASE_SETUP.md`

**Sans backend**, le site fonctionne avec LocalStorage (données locales uniquement).

---

## 🌐 Après le Déploiement

1. Allez sur GitHub → Settings → Pages
2. Activez Pages (Branch: main, Folder: root)
3. Attendez 2-3 minutes
4. Votre site sera à : `https://username.github.io/repo/`

---

## ✅ Vérifier que tout fonctionne

Testez ces URLs :
```
https://username.github.io/repo/
https://username.github.io/repo/data/machines.json
https://username.github.io/repo/html/formations.html
https://username.github.io/repo/admin/
```

---

## 📚 Documentation

- **Déploiement général** : `GUIDE_DEPLOIEMENT.md`
- **Configuration Supabase (rapide)** : `DEPLOIEMENT_RAPIDE_SUPABASE.md`
- **Configuration Supabase (détaillée)** : `SUPABASE_SETUP.md`
