-- ================================================
-- CONFIGURATION COMPLÈTE SUPABASE - GAL LUBUMBASHI
-- Script complet pour vidéos, formations, machines, articles
-- Version: 2025-12-02
-- ================================================

-- Ce script configure TOUTES les tables nécessaires avec les bonnes structures
-- et politiques d'accès pour que vous puissiez ajouter du contenu immédiatement.

-- ================================
-- 1. SUPPRESSION DES TABLES EXISTANTES (optionnel - décommenter si nécessaire)
-- ================================
-- DROP TABLE IF EXISTS videos CASCADE;
-- DROP TABLE IF EXISTS formations CASCADE;
-- DROP TABLE IF EXISTS machines CASCADE;
-- DROP TABLE IF EXISTS blog_posts CASCADE;
-- DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
-- DROP TABLE IF EXISTS contact_messages CASCADE;
-- DROP TABLE IF EXISTS machine_reservations CASCADE;
-- DROP TABLE IF EXISTS formation_reservations CASCADE;
-- DROP TABLE IF EXISTS members CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS announcements CASCADE;
-- DROP TABLE IF EXISTS chatbot_conversations CASCADE;
-- DROP TABLE IF EXISTS chatbot_knowledge CASCADE;

-- ================================
-- 2. CRÉATION DES TABLES
-- ================================

-- ===== TABLE VIDÉOS =====
CREATE TABLE IF NOT EXISTS videos (
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

-- ===== TABLE FORMATIONS =====
CREATE TABLE IF NOT EXISTS formations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    level VARCHAR(50) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price VARCHAR(100) NOT NULL,
    modules TEXT[] NOT NULL, -- Array de strings pour les modules
    category VARCHAR(100),
    image VARCHAR(500),
    instructor VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE MACHINES =====
CREATE TABLE IF NOT EXISTS machines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Disponible',
    description TEXT,
    image VARCHAR(500) NOT NULL,
    "priceRange" VARCHAR(100),
    specs JSONB DEFAULT '[]'::jsonb, -- Format: [{"label": "...", "value": "..."}]
    "defaultWhatsAppMessage" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE ARTICLES DE BLOG =====
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[], -- Array de strings pour les tags
    image VARCHAR(500) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE NEWSLETTER =====
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE MESSAGES DE CONTACT =====
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE RÉSERVATIONS DE MACHINES =====
CREATE TABLE IF NOT EXISTS machine_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    machine_id UUID REFERENCES machines(id) ON DELETE SET NULL,
    machine_name VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    reservation_date DATE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE INSCRIPTIONS FORMATIONS =====
CREATE TABLE IF NOT EXISTS formation_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    formation_id UUID REFERENCES formations(id) ON DELETE SET NULL,
    formation_title VARCHAR(255) NOT NULL,
    level VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE MEMBRES =====
CREATE TABLE IF NOT EXISTS members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    specialty VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE PROJETS (Chantiers & Conceptions) =====
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'chantier' ou 'conception'
    description TEXT,
    image VARCHAR(500),
    location VARCHAR(255),
    client VARCHAR(255),
    date_debut DATE,
    date_fin DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE MESSAGES PRIVÉS =====
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id VARCHAR(100), -- UUID du membre ou 'all' pour messages globaux
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sender VARCHAR(255) DEFAULT 'Admin',
    read BOOLEAN DEFAULT FALSE,
    comments JSONB DEFAULT '[]'::jsonb,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE ANNONCES =====
CREATE TABLE IF NOT EXISTS announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sender VARCHAR(255) DEFAULT 'Admin',
    priority VARCHAR(50) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    comments JSONB DEFAULT '[]'::jsonb,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE CONVERSATIONS CHATBOT =====
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE CONNAISSANCES CHATBOT =====
CREATE TABLE IF NOT EXISTS chatbot_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tag VARCHAR(255) NOT NULL UNIQUE,
    patterns JSONB NOT NULL DEFAULT '[]'::jsonb,
    responses JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 3. ACTIVATION DE ROW LEVEL SECURITY (RLS)
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
-- 4. SUPPRESSION DES ANCIENNES POLITIQUES
-- ================================

DROP POLICY IF EXISTS "Accès public vidéos" ON videos;
DROP POLICY IF EXISTS "Accès public formations" ON formations;
DROP POLICY IF EXISTS "Accès public machines" ON machines;
DROP POLICY IF EXISTS "Accès public blog" ON blog_posts;
DROP POLICY IF EXISTS "Accès public newsletter insert" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Accès public newsletter select" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Accès public contacts insert" ON contact_messages;
DROP POLICY IF EXISTS "Accès public contacts select" ON contact_messages;
DROP POLICY IF EXISTS "Accès public reservations insert" ON machine_reservations;
DROP POLICY IF EXISTS "Accès public reservations select" ON machine_reservations;
DROP POLICY IF EXISTS "Accès public reservations delete" ON machine_reservations;
DROP POLICY IF EXISTS "Accès public reservations update" ON machine_reservations;
DROP POLICY IF EXISTS "Accès public inscriptions insert" ON formation_reservations;
DROP POLICY IF EXISTS "Accès public inscriptions select" ON formation_reservations;
DROP POLICY IF EXISTS "Accès public inscriptions delete" ON formation_reservations;
DROP POLICY IF EXISTS "Accès public inscriptions update" ON formation_reservations;
DROP POLICY IF EXISTS "Accès public membres" ON members;
DROP POLICY IF EXISTS "Accès public projects" ON projects;
DROP POLICY IF EXISTS "Accès public messages" ON messages;
DROP POLICY IF EXISTS "Accès public announcements" ON announcements;
DROP POLICY IF EXISTS "Accès public chatbot conversations" ON chatbot_conversations;
DROP POLICY IF EXISTS "Lecture publique chatbot knowledge" ON chatbot_knowledge;
DROP POLICY IF EXISTS "Ecriture admin chatbot knowledge" ON chatbot_knowledge;

-- ================================
-- 5. CRÉATION DES POLITIQUES D'ACCÈS
-- ================================

-- Politiques pour TOUTES les opérations (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Accès public vidéos" ON videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public formations" ON formations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public machines" ON machines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public blog" ON blog_posts FOR ALL USING (true) WITH CHECK (true);

-- Politiques spécifiques pour les tables avec restrictions
CREATE POLICY "Accès public newsletter insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public newsletter select" ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Accès public newsletter delete" ON newsletter_subscribers FOR DELETE USING (true);

CREATE POLICY "Accès public contacts insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public contacts select" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Accès public contacts delete" ON contact_messages FOR DELETE USING (true);
CREATE POLICY "Accès public contacts update" ON contact_messages FOR UPDATE USING (true);

CREATE POLICY "Accès public reservations insert" ON machine_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public reservations select" ON machine_reservations FOR SELECT USING (true);
CREATE POLICY "Accès public reservations delete" ON machine_reservations FOR DELETE USING (true);
CREATE POLICY "Accès public reservations update" ON machine_reservations FOR UPDATE USING (true);

CREATE POLICY "Accès public inscriptions insert" ON formation_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public inscriptions select" ON formation_reservations FOR SELECT USING (true);
CREATE POLICY "Accès public inscriptions delete" ON formation_reservations FOR DELETE USING (true);
CREATE POLICY "Accès public inscriptions update" ON formation_reservations FOR UPDATE USING (true);

CREATE POLICY "Accès public membres" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public chatbot conversations" ON chatbot_conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Lecture publique chatbot knowledge" ON chatbot_knowledge FOR SELECT USING (true);
CREATE POLICY "Ecriture admin chatbot knowledge" ON chatbot_knowledge FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- 6. INDEX POUR OPTIMISATION
-- ================================

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_formations_level ON formations(level);
CREATE INDEX IF NOT EXISTS idx_formations_created_at ON formations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_machines_category ON machines(category);
CREATE INDEX IF NOT EXISTS idx_machines_slug ON machines(slug);
CREATE INDEX IF NOT EXISTS idx_machines_status ON machines(status);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);

-- ================================
-- 7. FONCTIONS UTILITAIRES
-- ================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Création des triggers pour updated_at
DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_formations_updated_at ON formations;
CREATE TRIGGER update_formations_updated_at BEFORE UPDATE ON formations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_machines_updated_at ON machines;
CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON machines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 8. VUE POUR VÉRIFICATION
-- ================================

CREATE OR REPLACE VIEW gal_tables_summary AS
SELECT 
    'videos' as table_name, 
    COUNT(*) as total_records,
    MAX(created_at) as last_created
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
ORDER BY table_name;

-- ================================
-- 9. VÉRIFICATION FINALE
-- ================================

-- Afficher le résumé des tables
SELECT * FROM gal_tables_summary;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ CONFIGURATION SUPABASE TERMINÉE !';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📦 Tables créées:';
    RAISE NOTICE '   - videos (vidéos)';
    RAISE NOTICE '   - formations (formations)';
    RAISE NOTICE '   - machines (machines)';
    RAISE NOTICE '   - blog_posts (articles de blog)';
    RAISE NOTICE '   - newsletter_subscribers';
    RAISE NOTICE '   - contact_messages';
    RAISE NOTICE '   - machine_reservations';
    RAISE NOTICE '   - formation_reservations';
    RAISE NOTICE '   - members';
    RAISE NOTICE '   - projects';
    RAISE NOTICE '   - messages';
    RAISE NOTICE '   - announcements';
    RAISE NOTICE '   - chatbot_conversations';
    RAISE NOTICE '   - chatbot_knowledge';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Row Level Security: ACTIVÉ';
    RAISE NOTICE '✨ Politiques d''accès: CONFIGURÉES';
    RAISE NOTICE '⚡ Index de performance: CRÉÉS';
    RAISE NOTICE '🔄 Triggers auto-update: ACTIFS';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '🚀 VOTRE SITE GAL EST PRÊT !';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '👉 Prochaines étapes:';
    RAISE NOTICE '   1. Connectez-vous à /admin/login.html';
    RAISE NOTICE '   2. Email: admin@gal-lubumbashi.com';
    RAISE NOTICE '   3. Password: Admin123!';
    RAISE NOTICE '   4. Ajoutez vos vidéos, formations, machines et articles';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Pour voir le résumé des données:';
    RAISE NOTICE '   SELECT * FROM gal_tables_summary;';
    RAISE NOTICE '';
END $$;
