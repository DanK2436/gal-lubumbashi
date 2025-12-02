-- ================================================
-- CONFIGURATION COMPLÈTE SUPABASE POUR GAL
-- Vidéos, Formations, Machines, Articles & Plus
-- ================================================

-- Ce script crée toutes les tables nécessaires ET ajoute des données d'exemple
-- pour que vous puissiez tester immédiatement votre site !

-- ================================
-- 1. CRÉATION DES TABLES
-- ================================

-- Table des vidéos
CREATE TABLE IF NOT EXISTS videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    thumbnail VARCHAR(500),
    duration INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des formations
CREATE TABLE IF NOT EXISTS formations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50),
    duration VARCHAR(100),
    price VARCHAR(100),
    modules TEXT,
    category VARCHAR(100),
    image VARCHAR(500),
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
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'available',
    description TEXT,
    image VARCHAR(500),
    price_range VARCHAR(100),
    specs JSONB,
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
    category VARCHAR(100),
    tags TEXT[],
    image VARCHAR(500),
    status VARCHAR(50) DEFAULT 'published',
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
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations de machines
CREATE TABLE IF NOT EXISTS machine_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    machine_id UUID REFERENCES machines(id) ON DELETE CASCADE,
    machine_name VARCHAR(255),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    reservation_date DATE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des inscriptions aux formations
CREATE TABLE IF NOT EXISTS formation_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    formation_id UUID REFERENCES formations(id) ON DELETE CASCADE,
    formation_title VARCHAR(255),
    level VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
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

-- Table des projets (chantiers & conceptions)
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'chantier' ou 'conception'
    description TEXT,
    image VARCHAR(500),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des messages privés (pour les membres)
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id UUID, -- 'all' pour messages globaux
    subject VARCHAR(255),
    content TEXT,
    sender VARCHAR(255) DEFAULT 'Admin',
    read BOOLEAN DEFAULT FALSE,
    comments JSONB DEFAULT '[]',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des annonces (messages globaux)
CREATE TABLE IF NOT EXISTS announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    sender VARCHAR(255) DEFAULT 'Admin',
    comments JSONB DEFAULT '[]',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Supprimer les anciennes politiques si elles existent
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
DROP POLICY IF EXISTS "Accès public inscriptions insert" ON formation_reservations;
DROP POLICY IF EXISTS "Accès public inscriptions select" ON formation_reservations;
DROP POLICY IF EXISTS "Accès public membres" ON members;
DROP POLICY IF EXISTS "Accès public projects" ON projects;
DROP POLICY IF EXISTS "Accès public messages" ON messages;
DROP POLICY IF EXISTS "Accès public announcements" ON announcements;

-- Créer les nouvelles politiques d'accès public
CREATE POLICY "Accès public vidéos" ON videos FOR ALL USING (true);
CREATE POLICY "Accès public formations" ON formations FOR ALL USING (true);
CREATE POLICY "Accès public machines" ON machines FOR ALL USING (true);
CREATE POLICY "Accès public blog" ON blog_posts FOR ALL USING (true);
CREATE POLICY "Accès public newsletter insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public newsletter select" ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Accès public contacts insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public contacts select" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Accès public reservations insert" ON machine_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public reservations select" ON machine_reservations FOR SELECT USING (true);
CREATE POLICY "Accès public inscriptions insert" ON formation_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public inscriptions select" ON formation_reservations FOR SELECT USING (true);
CREATE POLICY "Accès public membres" ON members FOR ALL USING (true);
CREATE POLICY "Accès public projects" ON projects FOR ALL USING (true);
CREATE POLICY "Accès public messages" ON messages FOR ALL USING (true);
CREATE POLICY "Accès public announcements" ON announcements FOR ALL USING (true);

-- ================================
-- 3. DONNÉES D'EXEMPLE
-- ================================

-- VIDÉOS D'EXEMPLE
INSERT INTO videos (title, description, url, thumbnail, duration, category) VALUES
('Introduction à la soudure', 'Apprenez les bases de la soudure à l''arc', 'https://www.youtube.com/watch?v=WXFnmEvmMOw', 'https://img.youtube.com/vi/WXFnmEvmMOw/maxresdefault.jpg', 480, 'Métallurgie'),
('Installation électrique basique', 'Guide complet pour installation électrique résidentielle', 'https://www.youtube.com/watch?v=fJeRabV5hNU', 'https://img.youtube.com/vi/fJeRabV5hNU/maxresdefault.jpg', 600, 'Électricité'),
('Menuiserie : Fabriquer une table', 'Tutoriel complet de construction d''une table en bois', 'https://www.youtube.com/watch?v=u5uzDxJrCmo', 'https://img.youtube.com/vi/u5uzDxJrCmo/maxresdefault.jpg', 720, 'Menuiserie');

-- FORMATIONS D'EXEMPLE
INSERT INTO formations (title, description, level, duration, price, modules, category, image) VALUES
('Formation Soudure TIG', 'Formation professionnelle en soudure TIG pour débutants et intermédiaires', 'Intermédiaire', '4 semaines', '200 USD', E'Introduction à la soudure TIG\nÉquipement et sécurité\nTechniques de base\nPratique intensive\nCertification', 'Métallurgie', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600'),
('Électricité Industrielle', 'Maîtrisez les installations électriques industrielles', 'Avancé', '6 semaines', '350 USD', E'Normes électriques\nSchémas électriques\nInstallations triphasées\nDépannage\nSécurité électrique', 'Électricité', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600'),
('Menuiserie Moderne', 'Techniques modernes de menuiserie et ébénisterie', 'Débutant', '3 semaines', '150 USD', E'Outils et matériaux\nMesures et tracés\nAssemblages\nFinitions\nProjets pratiques', 'Menuiserie', 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600');

-- MACHINES D'EXEMPLE
INSERT INTO machines (name, category, status, description, image, price_range, specs, slug) VALUES
('Machine à Décortiquer le Maïs', 'Agroalimentaire', 'Disponible', 'Machine professionnelle pour décortiquer le maïs, haute capacité', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600', '1500-2000 USD', '[{"label":"Capacité","value":"500 kg/h"},{"label":"Moteur","value":"5.5 HP"},{"label":"Garantie","value":"12 mois"}]', 'machine-decortiquer-mais'),
('Bétonneuse 200L', 'Construction', 'Disponible', 'Bétonneuse robuste idéale pour chantiers de construction', 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600', '800-1200 USD', '[{"label":"Capacité","value":"200 litres"},{"label":"Moteur","value":"2.2 kW"},{"label":"Poids","value":"95 kg"}]', 'betonneuse-200l'),
('Tour à Métaux Professionnel', 'Sur Mesure', 'Sur commande', 'Tour à métaux de précision pour travaux sur mesure', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600', 'Sur devis', '[{"label":"Type","value":"Tour conventionnel"},{"label":"Distance entre pointes","value":"1000 mm"},{"label":"Diamètre tournage","value":"400 mm"}]', 'tour-metaux-pro');

-- ARTICLES DE BLOG D'EXEMPLE
INSERT INTO blog_posts (title, slug, content, excerpt, author, category, tags, image) VALUES
('10 Conseils pour débuter en soudure', '10-conseils-soudure-debutant', 
E'## Introduction\n\nLa soudure est un métier passionnant qui demande précision et pratique.\n\n## Les 10 Conseils\n\n1. **Sécurité d''abord** - Toujours porter un équipement de protection\n2. **Choisir le bon équipement** - Investissez dans du matériel de qualité\n3. **Pratiquer régulièrement** - La pratique fait la perfection\n4. **Comprendre les métaux** - Chaque métal a ses spécificités\n5. **Maîtriser la température** - Le réglage est crucial\n6. **Nettoyer les surfaces** - Un travail propre est essentiel\n7. **Choisir le bon procédé** - TIG, MIG, à l''arc...\n8. **Respecter les normes** - Les standards de sécurité sont importants\n9. **Apprendre des erreurs** - Chaque erreur est une leçon\n10. **Se former continuellement** - Le métier évolue constamment',
'Découvrez les conseils essentiels pour bien débuter dans le monde de la soudure professionnelle.',
'Jean Kabamba', 'Tutoriels', ARRAY['soudure', 'débutant', 'conseils', 'métallurgie'], 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800'),

('Les nouvelles machines 2025', 'nouvelles-machines-2025',
E'## Innovations 2025\n\nCette année marque un tournant dans l''industrie des machines agricoles et industrielles.\n\n## Principales nouveautés\n\n- **Automatisation accrue** - Les machines deviennent plus intelligentes\n- **Économie d''énergie** - Moteurs plus efficaces\n- **Maintenance simplifiée** - Conception modulaire\n- **Prix compétitifs** - Meilleur rapport qualité-prix',
'Tour d''horizon des innovations en matière de machines industrielles pour 2025.',
'Marie Tshisekedi', 'Actualités', ARRAY['machines', 'innovation', '2025'], 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800'),

('Comment choisir sa machine agricole', 'choisir-machine-agricole',
E'## Guide d''achat\n\nChoisir la bonne machine agricole est crucial pour la rentabilité de votre exploitation.\n\n## Critères de sélection\n\n1. **Besoins réels** - Évaluez votre production\n2. **Budget** - Définissez votre enveloppe\n3. **Capacité** - Adaptez à votre volume\n4. **Maintenance** - Disponibilité des pièces\n5. **Garantie** - Protection de votre investissement',
'Guide complet pour sélectionner la machine agricole adaptée à vos besoins.',
'Paul Mwamba', 'Conseils', ARRAY['agriculture', 'machines', 'guide'], 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800');

-- ================================
-- 4. VÉRIFICATION
-- ================================

-- Créer une vue pour vérifier les données
CREATE OR REPLACE VIEW data_summary AS
SELECT 
    'videos' as table_name, 
    COUNT(*) as count 
FROM videos
UNION ALL
SELECT 'formations', COUNT(*) FROM formations
UNION ALL
SELECT 'machines', COUNT(*) FROM machines
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts;

-- ================================
-- FIN DU SCRIPT
-- ================================

-- Afficher un résumé
SELECT * FROM data_summary ORDER BY table_name;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Configuration Supabase terminée avec succès !';
    RAISE NOTICE '📊 Tables créées : videos, formations, machines, blog_posts, et plus';
    RAISE NOTICE '🎯 Données d''exemple ajoutées pour test';
    RAISE NOTICE '🔐 RLS activé avec politiques d''accès public';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Votre site GAL est prêt à l''emploi !';
    RAISE NOTICE '👉 Connectez-vous à /admin/login.html pour gérer le contenu';
END $$;
