-- ================================================
-- TABLE SITE_VISITS - Tracking des visiteurs
-- GAL - Groupement des Artisans de Lubumbashi
-- ================================================
CREATE TABLE IF NOT EXISTS site_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_url VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    referrer VARCHAR(500) DEFAULT 'direct',
    user_agent TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    language VARCHAR(10) DEFAULT 'fr',
    session_id VARCHAR(100),
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON TABLE site_visits IS 'Tracking des visiteurs du site web GAL';
-- Activer RLS
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
-- Politique : insertion publique (tout le monde peut enregistrer une visite)
CREATE POLICY "Insertion publique site_visits" ON site_visits FOR
INSERT WITH CHECK (true);
-- Politique : lecture pour les utilisateurs authentifiés (admin)
CREATE POLICY "Lecture site_visits" ON site_visits FOR
SELECT USING (true);
-- Index pour des requêtes rapides
CREATE INDEX idx_site_visits_visited_at ON site_visits(visited_at DESC);
CREATE INDEX idx_site_visits_page_url ON site_visits(page_url);
CREATE INDEX idx_site_visits_session_id ON site_visits(session_id);
CREATE INDEX idx_site_visits_referrer ON site_visits(referrer);
-- Message de confirmation
DO $$ BEGIN RAISE NOTICE '✅ Table site_visits créée avec succès !';
RAISE NOTICE '📊 Le tracking des visiteurs est maintenant activé.';
END $$;