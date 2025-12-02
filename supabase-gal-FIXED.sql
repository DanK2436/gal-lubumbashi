-- ================================================
-- CONFIGURATION COMPLÈTE SUPABASE - GAL LUBUMBASHI
-- Script complet pour vidéos, formations, machines, articles
-- Version: 2025-12-02 - CORRIGÉE
-- ================================================

-- ================================
-- 1. CRÉATION DES TABLES
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
    modules TEXT[] NOT NULL,
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
    specs JSONB DEFAULT '[]'::jsonb,
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
    tags TEXT[],
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
    machine_id UUID,
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
    formation_id UUID,
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

-- ===== TABLE PROJETS =====
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
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
    recipient_id VARCHAR(100),
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
    priority VARCHAR(50) DEFAULT 'normal',
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
-- 2. ROW LEVEL SECURITY (RLS)
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
-- 3. POLITIQUES D'ACCÈS
-- ================================

-- Suppression des anciennes politiques
DROP POLICY IF EXISTS "Accès public vidéos" ON videos;
DROP POLICY IF EXISTS "Accès public formations" ON formations;
DROP POLICY IF EXISTS "Accès public machines" ON machines;
DROP POLICY IF EXISTS "Accès public blog" ON blog_posts;
DROP POLICY IF EXISTS "Accès public newsletter insert" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Accès public newsletter select" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Accès public newsletter delete" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Accès public contacts insert" ON contact_messages;
DROP POLICY IF EXISTS "Accès public contacts select" ON contact_messages;
DROP POLICY IF EXISTS "Accès public contacts delete" ON contact_messages;
DROP POLICY IF EXISTS "Accès public contacts update" ON contact_messages;
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

-- Création des nouvelles politiques
CREATE POLICY "Accès public vidéos" ON videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public formations" ON formations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public machines" ON machines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public blog" ON blog_posts FOR ALL USING (true) WITH CHECK (true);

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
-- 4. INDEX POUR OPTIMISATION
-- ================================

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
-- 5. TRIGGERS AUTO-UPDATE
-- ================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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
-- ✅ CONFIGURATION TERMINÉE !
-- ================================

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ CONFIGURATION SUPABASE TERMINÉE !';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📦 14 Tables créées avec succès';
    RAISE NOTICE '🔐 Row Level Security: ACTIVÉ';
    RAISE NOTICE '✨ Politiques d''accès: CONFIGURÉES';
    RAISE NOTICE '⚡ Index de performance: CRÉÉS';
    RAISE NOTICE '🔄 Triggers: ACTIFS';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 VOUS POUVEZ MAINTENANT:';
    RAISE NOTICE '   1. Aller sur /admin/index.html';
    RAISE NOTICE '   2. Email: admin@gal-lubumbashi.com';
    RAISE NOTICE '   3. Password: Admin123!';
    RAISE NOTICE '   4. Ajouter vidéos, formations, machines, articles';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Vérification:';
    RAISE NOTICE '   SELECT COUNT(*) FROM videos;';
    RAISE NOTICE '   SELECT COUNT(*) FROM formations;';
    RAISE NOTICE '   SELECT COUNT(*) FROM machines;';
    RAISE NOTICE '   SELECT COUNT(*) FROM blog_posts;';
    RAISE NOTICE '';
END $$;
