-- ================================================================
-- 🏗️ SCRIPT D'INITIALISATION COMPLÈTE - CHANTIERS & CONCEPTIONS
-- GAL - Groupement des Artisans de Lubumbashi
-- Version: 2.0
-- Date: 2024-12-02
-- ================================================================
-- 
-- Ce script crée la table 'projects' pour stocker les chantiers
-- et les conceptions avec toutes les optimisations nécessaires.
--
-- INSTRUCTIONS :
-- 1. Connectez-vous à votre dashboard Supabase
-- 2. Allez dans SQL Editor
-- 3. Créez une nouvelle requête
-- 4. Collez ce script complet
-- 5. Cliquez sur "Run" ou appuyez sur Ctrl+Enter
--
-- ================================================================

-- ================================================================
-- ÉTAPE 1 : SUPPRESSION (Seulement si vous voulez recommencer)
-- ================================================================
-- ATTENTION : Décommentez UNIQUEMENT si vous voulez supprimer 
-- toutes les données existantes et repartir de zéro

-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ================================================================
-- ÉTAPE 2 : CRÉATION DE LA TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS projects (
    -- Identifiant unique (généré automatiquement)
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Informations du projet
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500) NOT NULL,
    
    -- Classification
    type VARCHAR(50) NOT NULL CHECK (type IN ('chantiers', 'conceptions')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'draft')),
    
    -- Horodatage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- ÉTAPE 3 : COMMENTAIRES ET DOCUMENTATION
-- ================================================================

COMMENT ON TABLE projects IS 'Table principale pour stocker les chantiers et conceptions du GAL Lubumbashi';
COMMENT ON COLUMN projects.id IS 'Identifiant unique UUID du projet';
COMMENT ON COLUMN projects.title IS 'Titre du projet (requis)';
COMMENT ON COLUMN projects.description IS 'Description complète du projet (requis)';
COMMENT ON COLUMN projects.image IS 'URL de l''image du projet (requis)';
COMMENT ON COLUMN projects.type IS 'Type de projet: "chantiers" pour les chantiers de construction, "conceptions" pour les designs';
COMMENT ON COLUMN projects.status IS 'Statut du projet: "active" (en cours), "completed" (terminé), "draft" (brouillon)';
COMMENT ON COLUMN projects.created_at IS 'Date et heure de création du projet';
COMMENT ON COLUMN projects.updated_at IS 'Date et heure de dernière modification (mise à jour automatique)';

-- ================================================================
-- ÉTAPE 4 : INDEX POUR OPTIMISATION DES PERFORMANCES
-- ================================================================

-- Index sur le type pour filtrage rapide (chantiers vs conceptions)
CREATE INDEX IF NOT EXISTS idx_projects_type 
    ON projects(type);

-- Index sur le statut pour filtrage rapide
CREATE INDEX IF NOT EXISTS idx_projects_status 
    ON projects(status);

-- Index sur created_at pour tri chronologique rapide
CREATE INDEX IF NOT EXISTS idx_projects_created_at 
    ON projects(created_at DESC);

-- Index composite pour requêtes combinées (type + statut)
CREATE INDEX IF NOT EXISTS idx_projects_type_status 
    ON projects(type, status);

-- Index composite pour requêtes combinées (type + date)
CREATE INDEX IF NOT EXISTS idx_projects_type_created 
    ON projects(type, created_at DESC);

-- ================================================================
-- ÉTAPE 5 : TRIGGER POUR MISE À JOUR AUTOMATIQUE DU TIMESTAMP
-- ================================================================

-- Créer ou remplacer la fonction de mise à jour
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;

-- Créer le nouveau trigger
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- ÉTAPE 6 : SÉCURITÉ - ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Activer Row Level Security sur la table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Accès public lecture projets" ON projects;
DROP POLICY IF EXISTS "Accès public insertion projets" ON projects;
DROP POLICY IF EXISTS "Accès public modification projets" ON projects;
DROP POLICY IF EXISTS "Accès public suppression projets" ON projects;
DROP POLICY IF EXISTS "Accès public projets" ON projects;
DROP POLICY IF EXISTS "Lecture publique projets" ON projects;
DROP POLICY IF EXISTS "Insertion publique projets" ON projects;
DROP POLICY IF EXISTS "Modification publique projets" ON projects;
DROP POLICY IF EXISTS "Suppression publique projets" ON projects;

-- ================================================================
-- OPTION A : POLITIQUES D'ACCÈS PUBLIC (Par défaut - recommandé pour débuter)
-- ================================================================
-- Ces politiques permettent un accès complet à tous
-- Idéal pour le développement et les sites publics simples

CREATE POLICY "Lecture publique projets" 
    ON projects FOR SELECT 
    USING (true);

CREATE POLICY "Insertion publique projets" 
    ON projects FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Modification publique projets" 
    ON projects FOR UPDATE 
    USING (true);

CREATE POLICY "Suppression publique projets" 
    ON projects FOR DELETE 
    USING (true);

-- ================================================================
-- OPTION B : POLITIQUES SÉCURISÉES (Commentées par défaut)
-- ================================================================
-- Décommentez cette section si vous voulez restreindre l'accès
-- en écriture uniquement aux utilisateurs authentifiés
-- N'oubliez pas de commenter l'OPTION A si vous activez l'OPTION B

/*
-- Lecture publique pour tous
CREATE POLICY "Lecture publique projets" 
    ON projects FOR SELECT 
    USING (true);

-- Écriture uniquement pour les utilisateurs authentifiés
CREATE POLICY "Insertion admin projets" 
    ON projects FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Modification admin projets" 
    ON projects FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Suppression admin projets" 
    ON projects FOR DELETE 
    USING (auth.role() = 'authenticated');
*/

-- ================================================================
-- ÉTAPE 7 : DONNÉES DE DÉMONSTRATION (Optionnel)
-- ================================================================
-- Décommentez cette section pour ajouter des données de test

/*
-- Exemples de CHANTIERS
INSERT INTO projects (title, description, image, type, status) VALUES
(
    'Construction Centre Communautaire de Kampemba',
    'Projet de construction d''un nouveau centre communautaire moderne pour les artisans du quartier Kampemba. Le centre comprendra des ateliers, une salle de formation et un espace d''exposition.',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    'chantiers',
    'active'
),
(
    'Rénovation Atelier de Soudure Moderne',
    'Modernisation complète de l''atelier de soudure avec installation de nouveaux équipements, amélioration de la ventilation et création d''un espace de stockage sécurisé.',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    'chantiers',
    'completed'
),
(
    'Extension Atelier Menuiserie',
    'Agrandissement de 300m² de l''atelier de menuiserie principal avec ajout d''une zone de finition et d''un showroom pour les clients.',
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800',
    'chantiers',
    'active'
);

-- Exemples de CONCEPTIONS
INSERT INTO projects (title, description, image, type, status) VALUES
(
    'Design Nouveau Centre de Formation GAL',
    'Conception architecturale complète du futur centre de formation du GAL, incluant salles de classe modernes, laboratoires techniques et espaces de coworking.',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
    'conceptions',
    'active'
),
(
    'Plans Extension Zone Industrielle',
    'Étude et plans détaillés pour l''extension de 500m² de la zone industrielle, comprenant la répartition optimale des espaces et les flux de travail.',
    'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=800',
    'conceptions',
    'draft'
),
(
    'Réaménagement Espace Accueil',
    'Projet de design intérieur pour le réaménagement complet de l''espace d''accueil du siège du GAL, avec un style moderne et accueillant.',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'conceptions',
    'completed'
);
*/

-- ================================================================
-- ÉTAPE 8 : VÉRIFICATIONS ET STATISTIQUES
-- ================================================================

-- Afficher la structure de la table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- Afficher les index créés
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'projects';

-- Afficher les triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'projects';

-- Compter les projets par type et statut
SELECT 
    type,
    status,
    COUNT(*) as nombre
FROM projects
GROUP BY type, status
ORDER BY type, status;

-- Afficher un résumé global
SELECT 
    COUNT(*) as total_projets,
    COUNT(CASE WHEN type = 'chantiers' THEN 1 END) as total_chantiers,
    COUNT(CASE WHEN type = 'conceptions' THEN 1 END) as total_conceptions,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as total_actifs,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as total_completes,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as total_brouillons
FROM projects;

-- Afficher les 5 derniers projets créés
SELECT 
    id,
    title,
    type,
    status,
    created_at
FROM projects
ORDER BY created_at DESC
LIMIT 5;

-- ================================================================
-- ✅ INITIALISATION TERMINÉE
-- ================================================================
-- 
-- La table 'projects' est maintenant prête à l'emploi !
-- 
-- Prochaines étapes :
-- 1. Testez la création d'un projet depuis l'interface admin
-- 2. Vérifiez que les données apparaissent dans Table Editor
-- 3. Consultez le fichier INITIALISATION_CHANTIERS_CONCEPTIONS.md
--    pour plus d'instructions détaillées
--
-- ================================================================

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Initialisation terminée avec succès !';
    RAISE NOTICE '📊 Table "projects" créée et configurée';
    RAISE NOTICE '🔐 Row Level Security activé';
    RAISE NOTICE '⚡ Index de performance créés';
    RAISE NOTICE '🔄 Trigger updated_at configuré';
    RAISE NOTICE '';
    RAISE NOTICE '📖 Consultez INITIALISATION_CHANTIERS_CONCEPTIONS.md pour la suite';
END $$;
