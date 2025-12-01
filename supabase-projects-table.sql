-- Table des projets (chantiers et conceptions)
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    type VARCHAR(50) NOT NULL, -- 'chantiers' ou 'conceptions'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'draft'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Supprimer l'ancienne politique si elle existe
DROP POLICY IF EXISTS "Accès public projets" ON projects;

-- Créer la politique d'accès public
CREATE POLICY "Accès public projets" ON projects FOR ALL USING (true);
