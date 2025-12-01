-- Table des messages privés aux membres
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id UUID REFERENCES members(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    comments JSONB DEFAULT '[]'::jsonb,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des annonces générales
CREATE TABLE IF NOT EXISTS announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    comments JSONB DEFAULT '[]'::jsonb,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des conversations du chatbot
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255), -- Peut être null pour les utilisateurs anonymes
    messages JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de messages {role: 'user'|'assistant', content: '...', timestamp: '...'}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Accès public messages" ON messages;
DROP POLICY IF EXISTS "Accès public annonces" ON announcements;
DROP POLICY IF EXISTS "Accès public chatbot" ON chatbot_conversations;

-- Créer les politiques d'accès public
CREATE POLICY "Accès public messages" ON messages FOR ALL USING (true);
CREATE POLICY "Accès public annonces" ON announcements FOR ALL USING (true);
CREATE POLICY "Accès public chatbot" ON chatbot_conversations FOR ALL USING (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_sent_at ON announcements(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_user_id ON chatbot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_updated_at ON chatbot_conversations(updated_at DESC);
