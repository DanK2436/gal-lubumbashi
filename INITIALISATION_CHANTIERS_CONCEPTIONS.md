# 🚀 Initialisation du Stockage - Chantiers et Conceptions

## 📋 Vue d'ensemble

Ce guide vous permet d'initialiser complètement le système de gestion des **Chantiers** et **Conceptions** avec Supabase.

## ✅ Prérequis

Avant de commencer, assurez-vous que :
- ✓ Vous avez un compte Supabase actif
- ✓ Votre projet Supabase est créé
- ✓ Les clés API sont configurées dans `js/supabase-init.js`

## 🗄️ Étape 1 : Créer la table `projects`

### Option A : Via l'interface Supabase

1. Connectez-vous à [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `gal-lubumbashi`
3. Allez dans **SQL Editor** (icône 🔍 dans le menu)
4. Cliquez sur **+ New Query**
5. Copiez-collez le script ci-dessous
6. Cliquez sur **Run** ou appuyez sur `Ctrl+Enter`

```sql
-- ================================================================
-- SCRIPT D'INITIALISATION COMPLÈTE
-- Table des projets (chantiers et conceptions)
-- Version: 1.0
-- Date: 2024-12-02
-- ================================================================

-- Supprimer la table si elle existe déjà (ATTENTION: SUPPRIME TOUTES LES DONNÉES)
-- Décommentez la ligne suivante uniquement si vous voulez repartir de zéro
-- DROP TABLE IF EXISTS projects CASCADE;

-- Créer la table projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('chantiers', 'conceptions')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter un commentaire sur la table
COMMENT ON TABLE projects IS 'Stocke les chantiers et conceptions du GAL';

-- Ajouter des commentaires sur les colonnes
COMMENT ON COLUMN projects.type IS 'Type de projet: chantiers ou conceptions';
COMMENT ON COLUMN projects.status IS 'Statut: active, completed ou draft';

-- Créer un index sur le type pour accélérer les requêtes filtrées
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);

-- Créer un index sur le statut
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Créer un index sur created_at pour le tri
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Créer une fonction de mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Activer Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Lecture publique projets" ON projects;
DROP POLICY IF EXISTS "Insertion publique projets" ON projects;
DROP POLICY IF EXISTS "Modification publique projets" ON projects;
DROP POLICY IF EXISTS "Suppression publique projets" ON projects;
DROP POLICY IF EXISTS "Accès public projets" ON projects;

-- Créer les politiques de sécurité (accès complet pour tous - ajustez selon vos besoins)
CREATE POLICY "Accès public lecture projets" 
    ON projects FOR SELECT 
    USING (true);

CREATE POLICY "Accès public insertion projets" 
    ON projects FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Accès public modification projets" 
    ON projects FOR UPDATE 
    USING (true);

CREATE POLICY "Accès public suppression projets" 
    ON projects FOR DELETE 
    USING (true);

-- ================================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- Décommentez pour ajouter des exemples
-- ================================================================

/*
-- Exemple de chantiers
INSERT INTO projects (title, description, image, type, status) VALUES
('Construction Centre Communautaire', 'Nouveau centre pour les artisans du quartier Kampemba', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5', 'chantiers', 'active'),
('Rénovation Atelier de Soudure', 'Modernisation complète de l''atelier avec nouveaux équipements', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd', 'chantiers', 'completed');

-- Exemple de conceptions
INSERT INTO projects (title, description, image, type, status) VALUES
('Design Nouvel Espace Formation', 'Conception architecturale du futur centre de formation GAL', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e', 'conceptions', 'active'),
('Plans Extension Atelier', 'Étude et plans pour l''extension de 500m² de l''atelier principal', 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e', 'conceptions', 'draft');
*/

-- ================================================================
-- VÉRIFICATION
-- ================================================================

-- Afficher le nombre de projets par type
SELECT 
    type,
    COUNT(*) as nombre,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as actifs,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completes,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as brouillons
FROM projects
GROUP BY type;

-- Afficher tous les projets
SELECT id, title, type, status, created_at 
FROM projects 
ORDER BY created_at DESC;
```

### Option B : Via le fichier SQL existant

Vous pouvez également exécuter le fichier `supabase-projects-table.sql` qui existe déjà :

```bash
# Dans Supabase SQL Editor, chargez le fichier
# Ou copiez son contenu depuis le projet
```

## 🧪 Étape 2 : Vérifier l'installation

### 2.1 Via l'interface Supabase

1. Allez dans **Table Editor** dans votre projet Supabase
2. Vous devriez voir la table `projects` dans la liste
3. Cliquez dessus pour voir sa structure
4. Vérifiez que les colonnes sont présentes :
   - ✓ `id` (UUID)
   - ✓ `title` (VARCHAR)
   - ✓ `description` (TEXT)
   - ✓ `image` (VARCHAR)
   - ✓ `type` (VARCHAR)
   - ✓ `status` (VARCHAR)
   - ✓ `created_at` (TIMESTAMP)
   - ✓ `updated_at` (TIMESTAMP)

### 2.2 Via la console JavaScript

Ouvrez votre navigateur sur le site GAL et testez dans la console (F12) :

```javascript
// Importer les fonctions
import { getProjects, createProject } from './js/storage.js';

// Tester la récupération
const projects = await getProjects();
console.log('Tous les projets:', projects);

// Récupérer uniquement les chantiers
const chantiers = await getProjects('chantiers');
console.log('Chantiers:', chantiers);

// Récupérer uniquement les conceptions
const conceptions = await getProjects('conceptions');
console.log('Conceptions:', conceptions);

// Créer un projet de test
const newProject = await createProject({
    title: 'Test Chantier',
    description: 'Description du test',
    image: 'https://via.placeholder.com/600x400',
    type: 'chantiers',
    status: 'active'
});
console.log('Projet créé:', newProject);
```

## 🎨 Étape 3 : Utiliser l'interface Admin

1. **Connectez-vous** à l'espace admin :
   - URL : `https://votre-site.com/admin/`
   - Email : `admin@gal-lubumbashi.com`
   - Mot de passe : `Admin123!`

2. **Accédez aux sections** :
   - Cliquez sur **🏗️ Chantiers** dans la barre latérale
   - Ou cliquez sur **📐 Conceptions**

3. **Ajoutez un projet** :
   - Cliquez sur **➕ Ajouter un chantier/conception**
   - Remplissez le formulaire
   - Cliquez sur **Enregistrer**

4. **Vérifiez** :
   - Le projet doit apparaître dans la liste
   - Vérifiez dans Supabase Table Editor qu'il est bien enregistré

## 🔐 Étape 4 : Configurer la sécurité (Optionnel)

Par défaut, les politiques RLS permettent l'accès complet. Pour renforcer la sécurité :

### Option 1 : Limiter la modification aux admins uniquement

```sql
-- Supprimer les politiques d'écriture actuelles
DROP POLICY IF EXISTS "Accès public insertion projets" ON projects;
DROP POLICY IF EXISTS "Accès public modification projets" ON projects;
DROP POLICY IF EXISTS "Accès public suppression projets" ON projects;

-- Créer des politiques restreintes (nécessite auth)
CREATE POLICY "Admins peuvent insérer projets" 
    ON projects FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins peuvent modifier projets" 
    ON projects FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins peuvent supprimer projets" 
    ON projects FOR DELETE 
    USING (auth.role() = 'authenticated');
```

### Option 2 : Utiliser un rôle personnalisé

```sql
-- Cette option nécessite de configurer des rôles personnalisés
-- Consultez la documentation Supabase pour plus de détails
```

## 📊 Étape 5 : Sauvegarder et monitorer

### Activer les sauvegardes automatiques

1. Allez dans **Settings** → **Database**
2. Activez **Daily Backups** (disponible sur les plans payants)
3. Ou exportez manuellement vos données régulièrement

### Exporter les données

Dans SQL Editor :

```sql
-- Exporter tous les projets en JSON
SELECT json_agg(row_to_json(projects.*)) 
FROM projects;
```

### Surveiller l'utilisation

1. Allez dans **Settings** → **Database**
2. Vérifiez :
   - Taille de la base de données
   - Nombre de lignes
   - Requêtes par seconde

## ❓ Dépannage

### Erreur "relation projects does not exist"

**Cause** : La table n'a pas été créée
**Solution** : Exécutez le script SQL de l'Étape 1

### Erreur "permission denied"

**Cause** : Les politiques RLS bloquent l'accès
**Solution** : Vérifiez que les politiques sont correctement configurées

### Les projets ne s'affichent pas dans l'admin

**Cause** : Problème de connexion Supabase ou table vide
**Solution** :
1. Vérifiez la configuration dans `js/supabase-init.js`
2. Ouvrez la console du navigateur (F12) et cherchez les erreurs
3. Testez la connexion avec `console.log(supabase)` dans la console

### Erreur lors de la création d'un projet

**Cause** : Champs requis manquants ou format d'image invalide
**Solution** :
1. Vérifiez que tous les champs sont remplis
2. Utilisez une URL d'image valide (commençant par http:// ou https://)
3. Vérifiez le format du champ `type` (doit être exactement 'chantiers' ou 'conceptions')

## 📚 Ressources supplémentaires

- [Documentation Supabase](https://supabase.com/docs)
- [Guide Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Fichier GUIDE_CHANTIERS_CONCEPTIONS.md](./GUIDE_CHANTIERS_CONCEPTIONS.md)
- [Fichier SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## ✅ Checklist finale

Avant de considérer l'initialisation complète, vérifiez :

- [ ] La table `projects` existe dans Supabase
- [ ] Les index sont créés pour optimiser les performances
- [ ] Les politiques RLS sont actives et configurées
- [ ] Le trigger `updated_at` fonctionne
- [ ] Vous pouvez créer un chantier depuis l'admin
- [ ] Vous pouvez créer une conception depuis l'admin
- [ ] Les projets s'affichent correctement dans la liste
- [ ] Vous pouvez modifier un projet existant
- [ ] Vous pouvez supprimer un projet
- [ ] Les données persistent après rechargement de la page

## 🎉 Félicitations !

Votre système de gestion des chantiers et conceptions est maintenant complètement initialisé et opérationnel avec Supabase ! 🚀

---

**Dernière mise à jour** : 2 décembre 2024  
**Version** : 1.0  
**Contact** : Pour toute question, consultez la documentation ou contactez l'équipe de développement.
