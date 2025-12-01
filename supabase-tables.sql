-- Script SQL SAFE pour Supabase
-- Ce script vérifie d'abord si les tables existent avant de les créer

-- Table des formations
CREATE TABLE IF NOT EXISTS formations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE,
    capacity INTEGER,
    instructor VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des machines
CREATE TABLE IF NOT EXISTS machines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    slug VARCHAR(255),
    status VARCHAR(50) DEFAULT 'available',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des abonnés newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations de machines
CREATE TABLE IF NOT EXISTS machine_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    machine_id UUID REFERENCES machines(id),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des inscriptions aux formations
CREATE TABLE IF NOT EXISTS formation_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    formation_id UUID REFERENCES formations(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des membres
CREATE TABLE IF NOT EXISTS members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    password VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des vidéos
CREATE TABLE IF NOT EXISTS videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    thumbnail VARCHAR(500),
    duration INTEGER,
    views INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de blog
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author VARCHAR(255),
    image VARCHAR(500),
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security (ne fait rien si déjà activé)
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Accès public" ON formations;
DROP POLICY IF EXISTS "Accès public" ON machines;
DROP POLICY IF EXISTS "Insertion publique newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Lecture publique newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Insertion publique contacts" ON contact_messages;
DROP POLICY IF EXISTS "Insertion publique réservations" ON machine_reservations;
DROP POLICY IF EXISTS "Lecture publique réservations" ON machine_reservations;
DROP POLICY IF EXISTS "Insertion publique formations" ON formation_reservations;
DROP POLICY IF EXISTS "Lecture publique inscriptions" ON formation_reservations;
DROP POLICY IF EXISTS "Accès public membres" ON members;
DROP POLICY IF EXISTS "Accès public vidéos" ON videos;
DROP POLICY IF EXISTS "Accès public blog" ON blog_posts;

-- Créer les politiques d'accès public
CREATE POLICY "Accès public formations" ON formations FOR ALL USING (true);
CREATE POLICY "Accès public machines" ON machines FOR ALL USING (true);
CREATE POLICY "Accès public newsletter insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public newsletter select" ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Accès public contacts insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public contacts select" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Accès public reservations insert" ON machine_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public reservations select" ON machine_reservations FOR SELECT USING (true);
CREATE POLICY "Accès public inscriptions insert" ON formation_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public inscriptions select" ON formation_reservations FOR SELECT USING (true);
CREATE POLICY "Accès public membres" ON members FOR ALL USING (true);
CREATE POLICY "Accès public vidéos" ON videos FOR ALL USING (true);
CREATE POLICY "Accès public blog" ON blog_posts FOR ALL USING (true);
