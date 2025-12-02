# 📋 Configuration Supabase pour GAL

## 🎯 Objectif
Configurer toutes les tables nécessaires dans Supabase pour pouvoir **ajouter des vidéos, formations, machines et articles** depuis l'interface admin.

## ⚠️ Problème identifié
Actuellement, même en local, vous ne pouvez pas ajouter de contenu car les tables Supabase ne sont pas correctement configurées ou n'ont pas les bonnes structures de colonnes.

---

## 🚀 Solution : Exécuter le script SQL

### Étape 1 : Accéder à Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet GAL (ou créez-en un si nécessaire)

### Étape 2 : Ouvrir l'éditeur SQL

1. Dans le menu de gauche, cliquez sur **SQL Editor** (icône </> )
2. Cliquez sur **+ New Query** pour créer une nouvelle requête

### Étape 3 : Copier et exécuter le script

1. Ouvrez le fichier `supabase-gal-complete.sql`
2. **Copiez TOUT le contenu** du fichier
3. **Collez-le** dans l'éditeur SQL de Supabase
4. Cliquez sur **RUN** (bouton en bas à droite) ou appuyez sur `Ctrl + Enter`

### Étape 4 : Vérifier la configuration

Après l'exécution, vous devriez voir :
- ✅ Messages de confirmation dans la console
- ✅ Un tableau récapitulatif des tables créées

Pour vérifier manuellement :
```sql
SELECT * FROM gal_tables_summary;
```

---

## 📦 Tables créées

Le script crée automatiquement les tables suivantes :

### Tables principales (contenu)
- ✅ **videos** - Gestion des vidéos
- ✅ **formations** - Gestion des formations
- ✅ **machines** - Catalogue des machines
- ✅ **blog_posts** - Articles de blog

### Tables fonctionnelles
- ✅ **newsletter_subscribers** - Abonnés à la newsletter
- ✅ **contact_messages** - Messages de contact
- ✅ **machine_reservations** - Réservations de machines
- ✅ **formation_reservations** - Inscriptions aux formations

### Tables espace membre
- ✅ **members** - Membres du GAL
- ✅ **projects** - Projets (chantiers & conceptions)
- ✅ **messages** - Messages privés
- ✅ **announcements** - Annonces générales

### Tables chatbot
- ✅ **chatbot_conversations** - Conversations du chatbot
- ✅ **chatbot_knowledge** - Base de connaissances

---

## 🔑 Structures importantes

### Table `videos`
```sql
- id (UUID)
- title (texte)
- category (texte) - Ex: "Électricité", "Métallurgie"
- url (texte) - URL YouTube ou autre
- thumbnail (texte) - URL de l'image miniature
- durationSeconds (entier) - Durée en secondes
- description (texte)
```

### Table `formations`
```sql
- id (UUID)
- title (texte)
- description (texte)
- level (texte) - "Débutant", "Intermédiaire", "Avancé"
- duration (texte) - Ex: "4 semaines"
- price (texte) - Ex: "200 USD"
- modules (tableau de texte) - Liste des modules
```

### Table `machines`
```sql
- id (UUID)
- name (texte)
- slug (texte unique) - Généré automatiquement
- category (texte) - "Agroalimentaire", "Construction", "Sur Mesure"
- status (texte) - "Disponible" ou "Sur commande"
- image (texte) - URL de l'image
- priceRange (texte) - Ex: "1500-2000 USD"
- specs (JSON) - Format: [{"label": "Capacité", "value": "500 kg/h"}]
```

### Table `blog_posts`
```sql
- id (UUID)
- title (texte)
- slug (texte unique)
- content (texte) - Contenu complet en Markdown
- excerpt (texte) - Extrait court
- author (texte)
- category (texte) - "Tutoriels", "Actualités", "Conseils"
- tags (tableau de texte)
- image (texte) - URL de l'image principale
```

---

## 🔒 Sécurité (RLS)

Le script active automatiquement **Row Level Security (RLS)** sur toutes les tables et configure les politiques d'accès suivantes :

- 📖 **Lecture publique** : Tout le monde peut lire le contenu
- ✍️ **Écriture publique** : Permet l'ajout depuis l'admin (vous pouvez restreindre plus tard si nécessaire)
- 🔐 Les politiques peuvent être affinées ultérieurement via le dashboard Supabase

---

## 🎨 Interface Admin

Une fois le script exécuté, vous pourrez :

1. **Ajouter des vidéos** via `/admin/index.html` → Section "Vidéos"
2. **Ajouter des formations** via `/admin/index.html` → Section "Formations"
3. **Ajouter des machines** via `/admin/index.html` → Section "Machines"
4. **Ajouter des articles** via `/admin/index.html` → Section "Blog"

### Identifiants Admin par défaut
```
Email: admin@gal-lubumbashi.com
Mot de passe: Admin123!
```

---

## 🧪 Test de fonctionnement

### Test 1 : Ajouter une vidéo
1. Allez sur `/admin/index.html`
2. Connectez-vous
3. Cliquez sur "Vidéos" dans le menu
4. Cliquez sur "+ Ajouter une vidéo"
5. Remplissez le formulaire :
   - Titre : "Test vidéo"
   - Catégorie : "Électricité"
   - URL : Une URL YouTube valide
   - Thumbnail : URL d'une image
   - Durée : 120 (secondes)
6. Cliquez sur "Enregistrer"
7. ✅ La vidéo devrait apparaître dans la liste

### Test 2 : Vérifier dans Supabase
1. Allez dans Supabase → **Table Editor**
2. Sélectionnez la table `videos`
3. ✅ Vous devriez voir votre vidéo de test

### Test 3 : Affichage public
1. Allez sur `/html/videos.html`
2. ✅ La vidéo devrait s'afficher sur la page publique

---

## ❗ Dépannage

### Problème : "Error creating video" ou message d'erreur similaire

**Causes possibles :**
1. Le script SQL n'a pas été exécuté complètement
2. Les politiques RLS bloquent l'accès
3. La structure de table ne correspond pas au code

**Solution :**
```sql
-- Vérifier que les tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('videos', 'formations', 'machines', 'blog_posts');

-- Vérifier les politiques RLS
SELECT * FROM pg_policies 
WHERE tablename IN ('videos', 'formations', 'machines', 'blog_posts');
```

### Problème : "durationSeconds column does not exist"

**Solution :** Recréez la table videos avec la bonne structure
```sql
DROP TABLE IF EXISTS videos CASCADE;
-- Puis réexécutez le script complet
```

### Problème : Rien ne s'affiche dans l'admin

**Vérification :**
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs JavaScript
3. Vérifiez que `js/supabase-init.js` contient vos bonnes clés Supabase

---

## 🔄 Mise à jour des clés Supabase

Si vous n'avez pas encore configuré vos clés Supabase :

1. Dans Supabase Dashboard → **Settings** → **API**
2. Copiez :
   - **Project URL**
   - **anon/public key**
3. Collez-les dans `js/supabase-init.js` :

```javascript
const supabaseConfig = {
    url: "VOTRE_PROJECT_URL_ICI",
    anonKey: "VOTRE_ANON_KEY_ICI"
};
```

---

## 📊 Vue d'ensemble

Après configuration, vous pouvez toujours vérifier l'état de vos données :

```sql
-- Voir le nombre d'enregistrements dans chaque table
SELECT * FROM gal_tables_summary ORDER BY table_name;

-- Voir les dernières vidéos ajoutées
SELECT title, category, created_at 
FROM videos 
ORDER BY created_at DESC 
LIMIT 5;

-- Voir les dernières formations ajoutées
SELECT title, level, price, created_at 
FROM formations 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## ✅ Checklist de configuration

- [ ] Script SQL exécuté dans Supabase
- [ ] Aucune erreur dans la console SQL
- [ ] Tables visibles dans Table Editor
- [ ] Clés Supabase configurées dans `js/supabase-init.js`
- [ ] Test d'ajout de vidéo réussi
- [ ] Test d'ajout de formation réussi
- [ ] Test d'ajout de machine réussi
- [ ] Test d'ajout d'article réussi
- [ ] Contenu visible sur les pages publiques

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans la console navigateur (F12)
2. Vérifiez les logs Supabase (Dashboard → Logs)
3. Assurez-vous que le script SQL a bien été exécuté en entier
4. Vérifiez que vos clés Supabase sont correctes

---

**Dernière mise à jour :** 2025-12-02
**Version du script :** supabase-gal-complete.sql
