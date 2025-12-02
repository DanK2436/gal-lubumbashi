# 🗄️ GUIDE D'INSTALLATION - Base de Données Complète GAL

## 📋 Vue d'Ensemble

Vous avez maintenant **2 fichiers SQL** pour configurer complètement votre base de données Supabase :

1. **`supabase-RESET.sql`** ⚠️ - Supprime tout ce qui existe
2. **`supabase-DATABASE-COMPLETE.sql`** ✅ - Crée la base de données complète

---

## 🚀 PROCÉDURE D'INSTALLATION

### ⚠️ ÉTAPE 1 : Réinitialisation (Suppression)

**Quand l'utiliser :**
- Vous avez des tables existantes qui posent problème
- Vous voulez repartir de zéro
- Vous avez des erreurs de structure de tables

**Comment faire :**

1. Ouvrez [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet GAL
3. Allez dans **SQL Editor**
4. Cliquez sur **+ New Query**
5. Copiez **TOUT** le contenu de `supabase-RESET.sql`
6. Collez dans l'éditeur
7. Cliquez sur **RUN** (ou Ctrl+Enter)

**Résultat attendu :**
```
⚠️  RÉINITIALISATION TERMINÉE !
Toutes les tables ont été supprimées.
Toutes les données ont été perdues.

👉 Prochaine étape :
   Exécutez supabase-DATABASE-COMPLETE.sql
```

---

### ✅ ÉTAPE 2 : Création de la Base de Données

**Immédiatement après l'ÉTAPE 1 :**

1. Dans Supabase SQL Editor → **+ New Query**
2. Copiez **TOUT** le contenu de `supabase-DATABASE-COMPLETE.sql`
3. Collez dans l'éditeur
4. Cliquez sur **RUN**
5. **Patientez** (cela peut prendre 10-30 secondes)

**Résultat attendu :**
```
✅ BASE DE DONNÉES CRÉÉE AVEC SUCCÈS !

📦 Tables créées : 14 tables

📋 Liste des tables :
   1. videos - Vidéos de tutoriels
   2. formations - Formations professionnelles
   3. machines - Catalogue machines
   4. blog_posts - Articles de blog
   ... (et 10 autres)

🔐 Row Level Security : ACTIVÉ sur toutes les tables
✨ Politiques d'accès : CONFIGURÉES
⚡ Index de performance : CRÉÉS
🔄 Triggers auto-update : ACTIFS

🚀 VOTRE BASE DE DONNÉES EST PRÊTE !
```

---

### 🧪 ÉTAPE 3 : Vérification

**Vérifier que tout est créé correctement :**

```sql
-- Voir le résumé de toutes les tables
SELECT * FROM gal_database_summary;
```

**Résultat attendu :**
```
table_name              | total_records | derniere_creation
-----------------------|---------------|------------------
announcements          | 0             | NULL
blog_posts             | 0             | NULL
chatbot_conversations  | 0             | NULL
chatbot_knowledge      | 0             | NULL
contact_messages       | 0             | NULL
formation_reservations | 0             | NULL
formations             | 0             | NULL
machine_reservations   | 0             | NULL
machines               | 0             | NULL
members                | 0             | NULL
messages               | 0             | NULL
newsletter_subscribers | 0             | NULL
projects               | 0             | NULL
videos                 | 0             | NULL
```

**Tout est à 0 = C'est NORMAL !** Les tables sont vides mais créées.

---

## 📦 Qu'est-ce qui a été Créé ?

### 14 Tables Principales

| Table | Description | Nombre de Colonnes |
|-------|-------------|-------------------|
| **videos** | Vidéos YouTube/tutoriels | 10 |
| **formations** | Formations professionnelles | 12 |
| **machines** | Catalogue machines/équipements | 12 |
| **blog_posts** | Articles de blog/actualités | 13 |
| **newsletter_subscribers** | Abonnés newsletter | 4 |
| **contact_messages** | Messages de contact | 7 |
| **machine_reservations** | Réservations de machines | 11 |
| **formation_reservations** | Inscriptions formations | 9 |
| **members** | Membres du GAL | 10 |
| **projects** | Projets (chantiers/conceptions) | 12 |
| **messages** | Messages privés membres | 7 |
| **announcements** | Annonces générales | 6 |
| **chatbot_conversations** | Historique chatbot | 6 |
| **chatbot_knowledge** | Base connaissances chatbot | 6 |

### Sécurité (RLS)

✅ **Row Level Security** activé sur toutes les tables  
✅ **Politiques d'accès** configurées pour :
- Lecture publique du contenu
- Insertion publique pour formulaires
- Gestion admin complète

### Performance

✅ **25+ Index** créés pour optimiser les requêtes  
✅ **8 Triggers** pour auto-update des timestamps  
✅ **1 Vue** pour monitoring (`gal_database_summary`)

### Intégrité

✅ **Contraintes CHECK** sur les valeurs (status, category, etc.)  
✅ **UNIQUE** sur slug, email  
✅ **NOT NULL** sur champs obligatoires

---

## 🎯 TEST RAPIDE : Ajouter des Données

### Test 1 : Ajouter une vidéo manuellement

```sql
INSERT INTO videos (title, category, url, thumbnail, "durationSeconds") 
VALUES (
    'Test Installation BDD',
    'Électricité',
    'https://www.youtube.com/watch?v=test',
    'https://via.placeholder.com/300x200',
    180
);

-- Vérifier
SELECT * FROM videos;
```

**Si ça marche :** ✅ La base de données est OK !

### Test 2 : Vérifier via l'admin

1. Ouvrez `/admin/index.html`
2. Connectez-vous :
   - Email: `admin@gal-lubumbashi.com`
   - Password: `Admin123!`
3. Cliquez sur **"Vidéos"**
4. Cliquez sur **"+ Ajouter une vidéo"**
5. Remplissez et enregistrez

**Si ça fonctionne :** ✅ Tout est parfait !

### Test 3 : Vérifier à nouveau le résumé

```sql
SELECT * FROM gal_database_summary;
```

Vous devriez voir :
```
videos | 1 | 2025-12-02 19:15:00
```

---

## 🎨 (Optionnel) Ajouter des Données d'Exemple

Si vous voulez des données de test prêtes à l'emploi :

```
1. SQL Editor → + New Query
2. Copiez TOUT le contenu de supabase-donnees-exemple.sql
3. RUN
4. Vous aurez :
   - 4 vidéos
   - 4 formations
   - 6 machines
   - 4 articles de blog
```

---

## 📊 Structure Détaillée des Tables Clés

### Table `videos`

```sql
id UUID                    -- Identifiant unique
title VARCHAR(255)         -- Titre de la vidéo
category VARCHAR(100)      -- Catégorie (Électricité, Métallurgie, etc.)
url VARCHAR(500)           -- URL YouTube ou autre
thumbnail VARCHAR(500)     -- URL de l'image miniature
"durationSeconds" INTEGER  -- ⚠️ Durée en SECONDES (pas en texte!)
description TEXT           -- Description (optionnel)
views INTEGER              -- Nombre de vues
status VARCHAR(50)         -- 'active' par défaut
created_at TIMESTAMP       -- Date de création (auto)
updated_at TIMESTAMP       -- Date de modification (auto)
```

### Table `formations`

```sql
id UUID
title VARCHAR(255)
description TEXT
level VARCHAR(50)          -- 'Débutant', 'Intermédiaire', 'Avancé'
duration VARCHAR(100)      -- Ex: "4 semaines"
price VARCHAR(100)         -- Ex: "200 USD"
modules TEXT[]             -- ⚠️ ARRAY de texte
category VARCHAR(100)
image VARCHAR(500)
instructor VARCHAR(255)
status VARCHAR(50)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Table `machines`

```sql
id UUID
name VARCHAR(255)
slug VARCHAR(255) UNIQUE   -- Généré automatiquement
category VARCHAR(100)      -- 'Agroalimentaire', 'Construction', 'Sur Mesure'
status VARCHAR(50)         -- 'Disponible', 'Sur commande', 'Épuisé'
description TEXT
image VARCHAR(500)
"priceRange" VARCHAR(100)  -- Ex: "1500-2000 USD"
specs JSONB                -- ⚠️ Format JSON: [{"label":"...","value":"..."}]
"defaultWhatsAppMessage" TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Table `blog_posts`

```sql
id UUID
title VARCHAR(255)
slug VARCHAR(255) UNIQUE
content TEXT               -- Contenu complet (Markdown)
excerpt TEXT               -- Résumé court
author VARCHAR(255)
category VARCHAR(100)      -- 'Tutoriels', 'Actualités', 'Conseils', etc.
tags TEXT[]                -- ⚠️ ARRAY de texte
image VARCHAR(500)
date TIMESTAMP
status VARCHAR(50)         -- 'draft', 'published', 'archived'
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

## 🔍 Commandes Utiles

### Voir toutes les tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### Voir les colonnes d'une table
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'videos'
ORDER BY ordinal_position;
```

### Voir les politiques RLS
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Compter les enregistrements
```sql
SELECT 
    COUNT(*) as videos,
    (SELECT COUNT(*) FROM formations) as formations,
    (SELECT COUNT(*) FROM machines) as machines,
    (SELECT COUNT(*) FROM blog_posts) as articles
FROM videos;
```

---

## ❗ Dépannage

### Erreur : "relation already exists"

**Cause :** Les tables existent déjà  
**Solution :** Exécutez d'abord `supabase-RESET.sql`

### Erreur : "column does not exist"

**Cause :** Structure de table incorrecte  
**Solution :** 
1. Exécutez `supabase-RESET.sql`
2. Puis `supabase-DATABASE-COMPLETE.sql`

### Erreur : "new row violates row-level security"

**Cause :** Politique RLS manquante ou incorrecte  
**Solution :** Réexécutez `supabase-DATABASE-COMPLETE.sql`

---

## ✅ Checklist Post-Installation

- [ ] Script `supabase-RESET.sql` exécuté avec succès
- [ ] Script `supabase-DATABASE-COMPLETE.sql` exécuté avec succès
- [ ] Message de confirmation affiché
- [ ] `SELECT * FROM gal_database_summary;` fonctionne
- [ ] 14 tables visibles dans Table Editor
- [ ] Test d'insertion manuelle réussi
- [ ] Test d'ajout via admin réussi
- [ ] Données visibles sur page publique

---

## 🎉 Résultat Final

Une fois terminé, vous aurez :

✅ **14 tables** parfaitement structurées  
✅ **Sécurité** RLS activée partout  
✅ **Performance** optimisée avec index  
✅ **Triggers** automatiques fonctionnels  
✅ **Documentation** dans les commentaires SQL  
✅ **Prêt pour production** !

---

**Fichiers créés :**
- `supabase-RESET.sql` - Réinitialisation
- `supabase-DATABASE-COMPLETE.sql` - Base de données complète
- `supabase-donnees-exemple.sql` - Données de test (optionnel)

**Date de création :** 2025-12-02  
**Version :** 1.0
