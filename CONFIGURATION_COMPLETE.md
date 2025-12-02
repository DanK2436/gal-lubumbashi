# ✅ Configuration Complète - Vidéos, Formations, Machines & Articles

## 📋 Vue d'ensemble

Votre site GAL est **déjà configuré** pour gérer les vidéos, formations, machines et articles avec Supabase ! Voici un guide complet.

---

## 🎯 Ce qui est déjà en place

### 1. **Base de données Supabase** ✅
Les tables suivantes existent dans votre base de données :
- ✅ `videos` - Gestion des vidéos
- ✅ `formations` - Gestion des formations
- ✅ `machines` - Gestion des machines
- ✅ `blog_posts` - Gestion des articles de blog
- ✅ `formation_reservations` - Inscriptions aux formations
- ✅ `machine_reservations` - Réservations de machines
- ✅ `newsletter_subscribers` - Abonnés newsletter
- ✅ `contact_messages` - Messages de contact

### 2. **Interface d'administration** ✅
Accessible via : `https://votre-site.com/admin/`

**Navigation admin :**
- 📊 Dashboard - Vue d'ensemble
- 🎬 Vidéos - Ajouter/Modifier/Supprimer
- 📚 Formations - Gestion complète
- 🛠️ Machines - Catalogue de machines
- 📝 Blog - Articles de blog
- 🎓 Inscriptions Formations - Gestion des demandes
- 📅 Réservations Machines - Gestion des réservations
- 📧 Newsletter - Gestion des abonnés
- ✉️ Contacts - Messages reçus

### 3. **Pages publiques** ✅
Toutes les pages chargent automatiquement les données depuis Supabase :
- `videos.html` - Affiche toutes les vidéos
- `formations.html` - Affiche toutes les formations
- `machines.html` - Catalogue de machines
- `blog.html` - Articles de blog

---

## 🚀 Comment ajouter du contenu

### 📹 Ajouter une vidéo

1. Connectez-vous à l'admin : `/admin/login.html`
2. Cliquez sur **"Vidéos"** dans le menu
3. Cliquez sur **"+ Ajouter une vidéo"**
4. Remplissez les champs :
   - **Titre** : Nom de la vidéo
   - **Catégorie** : Électricité, Métallurgie, Menuiserie, Plomberie
   - **Durée** : En secondes (ex: 120 pour 2 minutes)
   - **URL** : Lien YouTube (ex: https://youtube.com/watch?v=...)
   - **Miniature** : URL de l'image (facultatif, générée auto depuis YouTube)
5. Cliquez sur **"Enregistrer"**
6. ✅ La vidéo apparaît instantanément sur `/html/videos.html`

### 📚 Ajouter une formation

1. Dans l'admin, cliquez sur **"Formations"**
2. Cliquez sur **"+ Ajouter une formation"**
3. Remplissez :
   - **Titre** : Nom de la formation
   - **Niveau** : Débutant, Intermédiaire, Avancé
   - **Durée** : Ex: "2 semaines", "3 mois"
   - **Prix** : Ex: "50 USD", "Gratuit"
   - **Description** : Détails de la formation
   - **Modules** : Un par ligne
4. Enregistrez
5. ✅ La formation apparaît sur `/html/formations.html`

### 🛠️ Ajouter une machine

1. Cliquez sur **"Machines"**
2. **"+ Ajouter une machine"**
3. Remplissez :
   - **Nom** : Nom de la machine
   - **Catégorie** : Agroalimentaire, Construction, Sur Mesure
   - **Statut** : Disponible / Sur commande
   - **Prix** : Ex: "1200 USD"
   - **Image** : URL de l'image
   - **Spécifications** : Format `clé:valeur` (une par ligne)
     ```
     Capacité:1000 kg/heure
     Moteur:Honda 6.5 HP
     Garantie:6 mois
     ```
4. Enregistrez
5. ✅ La machine s'affiche sur `/html/machines.html`

### 📝 Ajouter un article de blog

1. Cliquez sur **"Blog"**
2. **"+ Nouvel article"**
3. Remplissez :
   - **Titre** : Titre de l'article
   - **Catégorie** : Tutoriels, Actualités, Conseils, Études de cas
   - **Auteur** : Votre nom
   - **Image principale** : URL de l'image de couverture
   - **Extrait** : Résumé court
   - **Contenu complet** : Texte de l'article
   - **Tags** : Séparés par des virgules (ex: soudure, débutant, sécurité)
4. Cliquez sur **"Publier"**
5. ✅ L'article apparaît sur `/html/blog.html`

---

## 📊 Gestion des inscriptions et réservations

### Inscriptions aux formations
- Les visiteurs s'inscrivent via le bouton **"Réserver"** sur `/html/formations.html`
- Vous recevez les demandes dans **Admin > Inscriptions Formations**
- Vous pouvez confirmer ou supprimer chaque inscription

### Réservations de machines
- Les visiteurs réservent via **"Réserver"** sur `/html/machines.html`
- Gérez les demandes dans **Admin > Réservations Machines**

### Messages de contact
- Formulaire de contact : `/html/contact.html`
- Consultez dans **Admin > Contacts**

### Newsletter
- Formulaire sur la page d'accueil et pages du site
- Liste des abonnés dans **Admin > Newsletter**

---

## 🔧 Configuration Supabase requise

### Vérification de la configuration

1. **Vérifiez vos clés Supabase** dans `js/supabase-init.js` :
```javascript
const SUPABASE_URL = 'VOTRE_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'VOTRE_CLE_ANONYME';
```

2. **Exécutez le script SQL** (si pas déjà fait) :
   - Fichier : `supabase-tables.sql`
   - Ouvrez Supabase Dashboard > SQL Editor
   - Copiez et exécutez le contenu du fichier

### Structure des tables

#### Table `videos`
```sql
- id (UUID)
- title (VARCHAR)
- description (TEXT)
- url (VARCHAR) - URL YouTube
- thumbnail (VARCHAR)
- duration (INTEGER) - En secondes
- views (INTEGER)
- status (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Table `formations`
```sql
- id (UUID)
- title (VARCHAR)
- description (TEXT)
- date (TIMESTAMP)
- capacity (INTEGER)
- instructor (VARCHAR)
- status (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Table `machines`
```sql
- id (UUID)
- name (VARCHAR)
- type (VARCHAR)
- slug (VARCHAR)
- status (VARCHAR)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Table `blog_posts`
```sql
- id (UUID)
- title (VARCHAR)
- slug (VARCHAR) - Unique
- content (TEXT)
- excerpt (TEXT)
- author (VARCHAR)
- image (VARCHAR)
- status (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🎨 Personnalisation

### Modifier les catégories

**Pour les vidéos** - `js/admin.js` ligne 134-138 :
```javascript
<option value="Électricité">Électricité</option>
<option value="Métallurgie">Métallurgie</option>
<option value="Menuiserie">Menuiserie</option>
<option value="Plomberie">Plomberie</option>
```

**Pour les machines** - `js/admin.js` ligne 524-526 :
```javascript
<option value="Agroalimentaire">Agroalimentaire</option>
<option value="Construction">Construction</option>
<option value="Sur Mesure">Sur Mesure</option>
```

**Pour le blog** - `js/admin.js` ligne 750-753 :
```javascript
<option value="Tutoriels">Tutoriels</option>
<option value="Actualités">Actualités</option>
<option value="Conseils">Conseils</option>
<option value="Études de cas">Études de cas</option>
```

---

## ✅ Test rapide

### Comment vérifier que tout fonctionne

1. **Connexion admin** :
   - URL : `/admin/login.html`
   - Email : `admin@gal-lubumbashi.com`
   - Mot de passe : `Admin123!`

2. **Ajouter une vidéo de test** :
   - Titre : "Test Vidéo"
   - URL : https://www.youtube.com/watch?v=dQw4w9WgXcQ
   - Catégorie : Électricité
   - Durée : 120

3. **Vérifier l'affichage** :
   - Allez sur `/html/videos.html`
   - Votre vidéo doit apparaître

4. **Test complet** :
   - ✅ Ajoutez une formation
   - ✅ Ajoutez une machine
   - ✅ Ajoutez un article
   - ✅ Vérifiez chaque page publique

---

## 📝 Résumé des fichiers importants

### Backend (Supabase)
- `js/storage.js` - Toutes les fonctions CRUD
- `js/supabase-init.js` - Configuration Supabase
- `js/supabase-service.js` - Service de communication
- `supabase-tables.sql` - Script de création des tables

### Admin
- `admin/index.html` - Interface admin
- `js/pages/admin.js` - Navigation admin
- `js/admin.js` - Gestionnaires CRUD

### Pages publiques
- `html/videos.html` + `js/pages/videos.js`
- `html/formations.html` + `js/pages/formations.js`
- `html/machines.html` + `js/pages/machines.js`
- `html/blog.html` + `js/pages/blog.js`

---

## 🆘 Dépannage

### Les données n'apparaissent pas
1. Vérifiez la console du navigateur (F12)
2. Assurez-vous que Supabase est bien configuré dans `js/supabase-init.js`
3. Vérifiez que les Row Level Security (RLS) policies sont activées
4. Exécutez à nouveau `supabase-tables.sql`

### Erreur de connexion admin
- Utilisez : `admin@gal-lubumbashi.com` / `Admin123!`
- Ces credentials sont codés en dur dans `js/storage.js` ligne 441

### Les vidéos YouTube ne se chargent pas
- Certaines vidéos ont des restrictions d'embedding
- Un bouton "Regarder sur YouTube" apparaît automatiquement
- Testez avec des vidéos sans restrictions

---

## 🎉 Félicitations !

Votre système est **100% opérationnel** ! Vous pouvez maintenant :

✅ Ajouter des vidéos depuis l'admin → Elles s'affichent sur le site  
✅ Ajouter des formations → Visibles publiquement + inscriptions  
✅ Ajouter des machines → Catalogue + réservations  
✅ Publier des articles → Blog fonctionnel  
✅ Gérer tout depuis Supabase → Base de données centralisée  

---

**Date de création** : 2 décembre 2025  
**Version** : 1.0  
**Auteur** : Système GAL - Lubumbashi
