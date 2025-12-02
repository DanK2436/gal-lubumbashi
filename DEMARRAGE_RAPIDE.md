# 🚀 Guide de Démarrage Rapide - GAL Admin

## ⚡ En 5 minutes, votre site est opérationnel !

---

## Étape 1️⃣ : Configuration Supabase (2 minutes)

### A. Obtenez vos clés Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un projet ou ouvrez le vôtre
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (clé longue commençant par `eyJ...`)

### B. Configurez votre site
1. Ouvrez le fichier : `js/supabase-init.js`
2. Remplacez les valeurs :
```javascript
const SUPABASE_URL = 'https://VOTRE_URL.supabase.co';
const SUPABASE_ANON_KEY = 'VOTRE_CLE_ANON';
```

### C. Créez les tables
1. Dans Supabase, allez dans **SQL Editor**
2. Ouvrez le fichier : `supabase-setup-complete.sql`
3. Copiez tout le contenu
4. Collez dans l'éditeur SQL
5. Cliquez **RUN**
6. ✅ Toutes les tables sont créées avec des données d'exemple !

---

## Étape 2️⃣ : Accès Admin (1 minute)

1. Ouvrez votre site : `/admin/login.html`
2. Connexion :
   - **Email** : `admin@gal-lubumbashi.com`
   - **Mot de passe** : `Admin123!`
3. ✅ Vous êtes dans le dashboard !

---

## Étape 3️⃣ : Ajoutez votre premier contenu (2 minutes)

### 🎬 Ajouter une vidéo

1. Cliquez sur **"Vidéos"** dans le menu
2. Cliquez **"+ Ajouter une vidéo"**
3. Remplissez :
   ```
   Titre         : Ma première vidéo
   Catégorie     : Électricité
   URL           : https://www.youtube.com/watch?v=dQw4w9WgXcQ
   Durée (sec)   : 120
   ```
4. Cliquez **"Enregistrer"**
5. 🎉 Allez sur `/html/videos.html` - votre vidéo est là !

### 📚 Ajouter une formation

1. Menu **"Formations"** > **"+ Ajouter une formation"**
2. Exemple :
   ```
   Titre       : Formation Test
   Niveau      : Débutant
   Durée       : 2 semaines
   Prix        : 100 USD
   Description : Ma formation de test
   Modules     : Module 1
                 Module 2
   ```
3. **Enregistrer**
4. ✅ Visible sur `/html/formations.html`

### 🛠️ Ajouter une machine

1. Menu **"Machines"** > **"+ Ajouter une machine"**
2. Remplissez :
   ```
   Nom         : Machine Test
   Catégorie   : Construction
   Statut      : Disponible
   Prix        : 1000 USD
   Image       : https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600
   Specs       : Capacité:100 kg
                 Garantie:6 mois
   ```
3. **Enregistrer**
4. ✅ Sur `/html/machines.html`

### 📝 Publier un article

1. Menu **"Blog"** > **"+ Nouvel article"**
2. Complétez :
   ```
   Titre     : Mon premier article
   Catégorie : Tutoriels
   Auteur    : Votre nom
   Image     : https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800
   Extrait   : Résumé court
   Contenu   : Texte complet de l'article
   Tags      : test, article
   ```
3. **Publier**
4. ✅ Lisible sur `/html/blog.html`

---

## 📊 Tableau de comparaison

| Élément       | Où ajouter ?      | Où voir ?              | Temps   |
|---------------|-------------------|------------------------|---------|
| 🎬 Vidéo      | Admin > Vidéos    | `/html/videos.html`    | 1 min   |
| 📚 Formation  | Admin > Formations| `/html/formations.html`| 2 min   |
| 🛠️ Machine    | Admin > Machines  | `/html/machines.html`  | 2 min   |
| 📝 Article    | Admin > Blog      | `/html/blog.html`      | 3 min   |

---

## ✅ Vérification complète

### Liste de contrôle

- [ ] Supabase configuré dans `js/supabase-init.js`
- [ ] Script SQL exécuté (tables créées)
- [ ] Connexion admin réussie
- [ ] Au moins 1 vidéo ajoutée
- [ ] Au moins 1 formation ajoutée
- [ ] Au moins 1 machine ajoutée
- [ ] Au moins 1 article publié
- [ ] Toutes les pages publiques affichent le contenu

### Test complet (1 minute)

1. **Vidéos** : Allez sur `/html/videos.html`
   - ✅ Vous voyez les vidéos d'exemple + les vôtres

2. **Formations** : `/html/formations.html`
   - ✅ Liste des formations
   - ✅ Bouton "Réserver" fonctionne

3. **Machines** : `/html/machines.html`
   - ✅ Catalogue visible
   - ✅ Réservation possible

4. **Blog** : `/html/blog.html`
   - ✅ Articles visibles
   - ✅ Clic sur "Lire l'article" ouvre le contenu

---

## 🎯 Fonctionnalités complètes disponibles

### Pages publiques
- ✅ Page vidéos avec lecteur YouTube intégré
- ✅ Formations avec système de réservation
- ✅ Catalogue machines avec demandes de réservation
- ✅ Blog avec articles complets
- ✅ Formulaire de contact (enregistré dans Supabase)
- ✅ Inscription newsletter

### Interface Admin
- ✅ Dashboard avec statistiques
- ✅ CRUD complet pour vidéos
- ✅ CRUD complet pour formations
- ✅ CRUD complet pour machines
- ✅ CRUD complet pour articles
- ✅ Gestion des inscriptions formations
- ✅ Gestion des réservations machines
- ✅ Liste des abonnés newsletter
- ✅ Messages de contact
- ✅ Gestion des membres
- ✅ Gestion des projets (chantiers/conceptions)

### Base de données
- ✅ Toutes les données dans Supabase
- ✅ Synchronisation automatique
- ✅ Accessible de n'importe quel appareil
- ✅ Sauvegardes automatiques par Supabase
- ✅ Évolutif et sécurisé

---

## 🆘 Problèmes courants

### ❌ "Page blanche" ou données vides

**Solution** :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs
3. Assurez-vous que `js/supabase-init.js` a les bonnes clés
4. Vérifiez que le script SQL a bien été exécuté dans Supabase

### ❌ "Impossible de se connecter à l'admin"

**Solution** :
- Email : `admin@gal-lubumbashi.com`
- Mot de passe : `Admin123!` (attention à la casse !)

### ❌ "Les vidéos ne se chargent pas"

**Solution** :
- Certaines vidéos YouTube ont des restrictions
- Utilisez des vidéos publiques sans restriction
- Un bouton "Regarder sur YouTube" s'affiche automatiquement

### ❌ "Erreur Supabase"

**Solution** :
1. Vérifiez que les tables existent dans Supabase
2. Vérifiez les RLS policies (doivent permettre l'accès public)
3. Ré-exécutez le script `supabase-setup-complete.sql`

---

## 📞 Besoin d'aide ?

### Documentation complète
Consultez : `CONFIGURATION_COMPLETE.md`

### Fichiers importants
- `js/supabase-init.js` - Configuration
- `js/storage.js` - Fonctions de données
- `supabase-setup-complete.sql` - Script SQL
- `admin/index.html` - Interface admin

---

## 🎉 Félicitations !

Votre site GAL est maintenant **100% opérationnel** avec :

✅ **Base de données Supabase** - Toutes vos données sont sécurisées  
✅ **Interface d'administration** - Gérez facilement votre contenu  
✅ **Pages publiques dynamiques** - Tout s'affiche automatiquement  
✅ **Système de réservations** - Formations et machines  
✅ **Blog fonctionnel** - Publiez vos actualités  

---

**Temps total de configuration : 5 minutes**  
**Dernière mise à jour : 2 décembre 2025**  
**Version : 1.0**
