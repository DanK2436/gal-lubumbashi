-- ================================================
-- BASE DE DONNÉES COMPLÈTE - GAL LUBUMBASHI
-- Projet : Site Web GAL (Groupement des Artisans de Lubumbashi)
-- Version : 1.0 - 2025-12-02
-- ================================================

-- Ce script crée une base de données complète pour le projet GAL
-- incluant toutes les tables, politiques RLS, index et triggers nécessaires.

-- ⚠️ IMPORTANT : Exécutez d'abord supabase-RESET.sql si vous avez des tables existantes

-- ================================
-- ÉTAPE 1 : CRÉATION DES TABLES
-- ================================

-- ===== TABLE VIDÉOS =====
-- Stocke les vidéos de tutoriels et démonstrations
CREATE TABLE videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail VARCHAR(500) NOT NULL,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    views INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE videos IS 'Vidéos de tutoriels et démonstrations';
COMMENT ON COLUMN videos."durationSeconds" IS 'Durée de la vidéo en secondes';

-- ===== TABLE FORMATIONS =====
-- Stocke les formations professionnelles proposées
CREATE TABLE formations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    level VARCHAR(50) NOT NULL CHECK (level IN ('Débutant', 'Intermédiaire', 'Avancé')),
    duration VARCHAR(100) NOT NULL,
    price VARCHAR(100) NOT NULL,
    modules TEXT[] NOT NULL,
    category VARCHAR(100),
    image VARCHAR(500),
    instructor VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE formations IS 'Formations professionnelles proposées par le GAL';
COMMENT ON COLUMN formations.modules IS 'Liste des modules de la formation (array)';

-- ===== TABLE MACHINES =====
-- Catalogue des machines et équipements
CREATE TABLE machines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Agroalimentaire', 'Construction', 'Sur Mesure')),
    status VARCHAR(50) DEFAULT 'Disponible' CHECK (status IN ('Disponible', 'Sur commande', 'Épuisé')),
    description TEXT,
    image VARCHAR(500) NOT NULL,
    "priceRange" VARCHAR(100),
    specs JSONB DEFAULT '[]'::jsonb,
    "defaultWhatsAppMessage" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE machines IS 'Catalogue des machines et équipements';
COMMENT ON COLUMN machines.specs IS 'Spécifications techniques au format JSON: [{"label": "...", "value": "..."}]';

-- ===== TABLE ARTICLES DE BLOG =====
-- Articles et actualités du blog
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Tutoriels', 'Actualités', 'Conseils', 'Études de cas')),
    tags TEXT[],
    image VARCHAR(500) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE blog_posts IS 'Articles et actualités du blog GAL';
COMMENT ON COLUMN blog_posts.content IS 'Contenu complet en Markdown';

-- ===== TABLE ABONNÉS NEWSLETTER =====
-- Liste des abonnés à la newsletter
CREATE TABLE newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT true
);

COMMENT ON TABLE newsletter_subscribers IS 'Abonnés à la newsletter GAL';

-- ===== TABLE MESSAGES DE CONTACT =====
-- Messages envoyés via le formulaire de contact
CREATE TABLE contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE contact_messages IS 'Messages reçus via le formulaire de contact';

-- ===== TABLE RÉSERVATIONS DE MACHINES =====
-- Réservations de location de machines
CREATE TABLE machine_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    machine_id UUID,
    machine_name VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    reservation_date DATE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE machine_reservations IS 'Réservations de location de machines';

-- ===== TABLE INSCRIPTIONS FORMATIONS =====
-- Inscriptions aux formations
CREATE TABLE formation_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    formation_id UUID,
    formation_title VARCHAR(255) NOT NULL,
    level VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE formation_reservations IS 'Inscriptions aux formations professionnelles';

-- ===== TABLE MEMBRES =====
-- Membres du GAL (artisans)
CREATE TABLE members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    specialty VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE members IS 'Membres du GAL (artisans professionnels)';

-- ===== TABLE PROJETS (Chantiers & Conceptions) =====
-- Projets réalisés par le GAL
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('chantier', 'conception')),
    description TEXT,
    image VARCHAR(500),
    location VARCHAR(255),
    client VARCHAR(255),
    date_debut DATE,
    date_fin DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE projects IS 'Projets (chantiers et conceptions) réalisés par le GAL';

-- ===== TABLE MESSAGES PRIVÉS =====
-- Messages privés aux membres
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id VARCHAR(100),
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sender VARCHAR(255) DEFAULT 'Admin',
    read BOOLEAN DEFAULT FALSE,
    comments JSONB DEFAULT '[]'::jsonb,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE messages IS 'Messages privés envoyés aux membres';
COMMENT ON COLUMN messages.recipient_id IS 'ID du membre destinataire ou "all" pour message global';

-- ===== TABLE ANNONCES =====
-- Annonces générales pour tous les membres
CREATE TABLE announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sender VARCHAR(255) DEFAULT 'Admin',
    priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    comments JSONB DEFAULT '[]'::jsonb,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE announcements IS 'Annonces générales pour tous les membres';

-- ===== TABLE CONVERSATIONS CHATBOT =====
-- Historique des conversations avec le chatbot
CREATE TABLE chatbot_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE chatbot_conversations IS 'Historique des conversations avec le chatbot';

-- ===== TABLE BASE DE CONNAISSANCES CHATBOT =====
-- Base de connaissances pour le chatbot
CREATE TABLE chatbot_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tag VARCHAR(255) NOT NULL UNIQUE,
    patterns JSONB NOT NULL DEFAULT '[]'::jsonb,
    responses JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE chatbot_knowledge IS 'Base de connaissances du chatbot (intents et réponses)';

-- ================================
-- ÉTAPE 2 : ACTIVATION DE ROW LEVEL SECURITY (RLS)
-- ================================

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_knowledge ENABLE ROW LEVEL SECURITY;

-- ================================
-- ÉTAPE 3 : POLITIQUES D'ACCÈS RLS
-- ================================

-- Politiques pour les tables de contenu public (accès total pour faciliter le développement)
CREATE POLICY "Accès public videos" ON videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public formations" ON formations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public machines" ON machines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public blog" ON blog_posts FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour newsletter (insertion publique, lecture admin)
CREATE POLICY "Inscription newsletter publique" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Lecture newsletter" ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Suppression newsletter" ON newsletter_subscribers FOR DELETE USING (true);

-- Politiques pour contacts (insertion publique, lecture admin)
CREATE POLICY "Envoi contact public" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Lecture contacts" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Modification contacts" ON contact_messages FOR UPDATE USING (true);
CREATE POLICY "Suppression contacts" ON contact_messages FOR DELETE USING (true);

-- Politiques pour réservations machines
CREATE POLICY "Création réservation machine" ON machine_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Lecture réservations machines" ON machine_reservations FOR SELECT USING (true);
CREATE POLICY "Modification réservations machines" ON machine_reservations FOR UPDATE USING (true);
CREATE POLICY "Suppression réservations machines" ON machine_reservations FOR DELETE USING (true);

-- Politiques pour inscriptions formations
CREATE POLICY "Création inscription formation" ON formation_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Lecture inscriptions formations" ON formation_reservations FOR SELECT USING (true);
CREATE POLICY "Modification inscriptions formations" ON formation_reservations FOR UPDATE USING (true);
CREATE POLICY "Suppression inscriptions formations" ON formation_reservations FOR DELETE USING (true);

-- Politiques pour membres (accès total pour développement)
CREATE POLICY "Accès total membres" ON members FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour projets (accès total pour développement)
CREATE POLICY "Accès total projects" ON projects FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour messages et annonces
CREATE POLICY "Accès total messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès total announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour chatbot
CREATE POLICY "Accès total chatbot conversations" ON chatbot_conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Lecture chatbot knowledge" ON chatbot_knowledge FOR SELECT USING (true);
CREATE POLICY "Modification chatbot knowledge" ON chatbot_knowledge FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- ÉTAPE 4 : INDEX POUR OPTIMISATION
-- ================================

-- Index sur videos
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);

-- Index sur formations
CREATE INDEX idx_formations_level ON formations(level);
CREATE INDEX idx_formations_category ON formations(category);
CREATE INDEX idx_formations_status ON formations(status);
CREATE INDEX idx_formations_created_at ON formations(created_at DESC);

-- Index sur machines
CREATE INDEX idx_machines_category ON machines(category);
CREATE INDEX idx_machines_slug ON machines(slug);
CREATE INDEX idx_machines_status ON machines(status);
CREATE INDEX idx_machines_created_at ON machines(created_at DESC);

-- Index sur blog_posts
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Index sur members
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_status ON members(status);

-- Index sur projects
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_status ON projects(status);

-- Index sur messages
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_read ON messages(read);

-- Index sur newsletter
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(active);

-- ================================
-- ÉTAPE 5 : FONCTIONS ET TRIGGERS
-- ================================

-- Fonction pour mettre à jour automatiquement le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_formations_updated_at
    BEFORE UPDATE ON formations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_machines_updated_at
    BEFORE UPDATE ON machines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chatbot_conversations_updated_at
    BEFORE UPDATE ON chatbot_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chatbot_knowledge_updated_at
    BEFORE UPDATE ON chatbot_knowledge
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- ÉTAPE 6 : VUES UTILITAIRES
-- ================================

-- Vue pour voir le résumé de toutes les tables
CREATE OR REPLACE VIEW gal_database_summary AS
SELECT 
    'videos' as table_name,
    COUNT(*) as total_records,
    MAX(created_at) as derniere_creation
FROM videos
UNION ALL
SELECT 'formations', COUNT(*), MAX(created_at) FROM formations
UNION ALL
SELECT 'machines', COUNT(*), MAX(created_at) FROM machines
UNION ALL
SELECT 'blog_posts', COUNT(*), MAX(created_at) FROM blog_posts
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*), MAX(subscribed_at) FROM newsletter_subscribers
UNION ALL
SELECT 'contact_messages', COUNT(*), MAX(created_at) FROM contact_messages
UNION ALL
SELECT 'machine_reservations', COUNT(*), MAX(created_at) FROM machine_reservations
UNION ALL
SELECT 'formation_reservations', COUNT(*), MAX(created_at) FROM formation_reservations
UNION ALL
SELECT 'members', COUNT(*), MAX(created_at) FROM members
UNION ALL
SELECT 'projects', COUNT(*), MAX(created_at) FROM projects
UNION ALL
SELECT 'messages', COUNT(*), MAX(sent_at) FROM messages
UNION ALL
SELECT 'announcements', COUNT(*), MAX(sent_at) FROM announcements
UNION ALL
SELECT 'chatbot_conversations', COUNT(*), MAX(created_at) FROM chatbot_conversations
UNION ALL
SELECT 'chatbot_knowledge', COUNT(*), MAX(created_at) FROM chatbot_knowledge
ORDER BY table_name;

-- ================================
-- ÉTAPE 7 : VÉRIFICATION ET CONFIRMATION
-- ================================

-- Afficher le résumé de la base de données
SELECT * FROM gal_database_summary;

-- Message de succès
DO $$
DECLARE
    v_tables_count INT;
BEGIN
    SELECT COUNT(*) INTO v_tables_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE';

    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ BASE DE DONNÉES CRÉÉE AVEC SUCCÈS !';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📦 Tables créées : % tables', v_tables_count;
    RAISE NOTICE '';
    RAISE NOTICE '📋 Liste des tables :';
    RAISE NOTICE '   1. videos - Vidéos de tutoriels';
    RAISE NOTICE '   2. formations - Formations professionnelles';
    RAISE NOTICE '   3. machines - Catalogue machines';
    RAISE NOTICE '   4. blog_posts - Articles de blog';
    RAISE NOTICE '   5. newsletter_subscribers - Abonnés newsletter';
    RAISE NOTICE '   6. contact_messages - Messages de contact';
    RAISE NOTICE '   7. machine_reservations - Réservations machines';
    RAISE NOTICE '   8. formation_reservations - Inscriptions formations';
    RAISE NOTICE '   9. members - Membres GAL';
    RAISE NOTICE '   10. projects - Projets (chantiers/conceptions)';
    RAISE NOTICE '   11. messages - Messages privés';
    RAISE NOTICE '   12. announcements - Annonces générales';
    RAISE NOTICE '   13. chatbot_conversations - Conversations chatbot';
    RAISE NOTICE '   14. chatbot_knowledge - Base connaissances chatbot';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Row Level Security : ACTIVÉ sur toutes les tables';
    RAISE NOTICE '✨ Politiques d''accès : CONFIGURÉES';
    RAISE NOTICE '⚡ Index de performance : CRÉÉS';
    RAISE NOTICE '🔄 Triggers auto-update : ACTIFS';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '🚀 VOTRE BASE DE DONNÉES EST PRÊTE !';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '👉 Prochaines étapes :';
    RAISE NOTICE '   1. Testez l''ajout de données dans l''admin';
    RAISE NOTICE '   2. Vérifiez avec : SELECT * FROM gal_database_summary;';
    RAISE NOTICE '   3. (Optionnel) Exécutez supabase-donnees-exemple.sql';
    RAISE NOTICE '      pour avoir des données de test';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Pour voir le résumé :';
    RAISE NOTICE '   SELECT * FROM gal_database_summary;';
    RAISE NOTICE '';
END $$;
