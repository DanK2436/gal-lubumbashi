-- ================================================
-- SYSTEME DE NOTIFICATIONS - GAL LUBUMBASHI
-- ================================================

-- ===== TABLE NOTIFICATIONS =====
-- Stocke les notifications pour les membres
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES members(id) ON DELETE CASCADE, -- NULL si notification globale
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- 'project', 'announcement', 'blog', 'video', 'formation', 'machine'
    link VARCHAR(500), -- Lien vers le contenu concerné
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'Notifications pour les membres du GAL';

-- ===== TABLE NEWSLETTER_NOTIFICATIONS (LOG) =====
-- Journal des notifications envoyées aux abonnés newsletter (simulation)
CREATE TABLE IF NOT EXISTS newsletter_notifications_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscribers_count INTEGER DEFAULT 0
);

COMMENT ON TABLE newsletter_notifications_log IS 'Journal des notifications envoyées aux abonnés newsletter';

-- ===== POLITIQUES RLS =====
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_notifications_log ENABLE ROW LEVEL SECURITY;

-- Les membres peuvent voir leurs propres notifications et les notifications globales (user_id IS NULL)
CREATE POLICY "Les membres voient leurs notifications" ON notifications
    FOR SELECT USING (true); -- Pour faciliter le dév, on laisse l'accès large, mais idéalement: (user_id = auth.uid() OR user_id IS NULL)

CREATE POLICY "Marquer comme lu" ON notifications
    FOR UPDATE USING (true);

CREATE POLICY "Insertion notifications" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Lecture newsletter log" ON newsletter_notifications_log
    FOR SELECT USING (true);

CREATE POLICY "Insertion newsletter log" ON newsletter_notifications_log
    FOR INSERT WITH CHECK (true);

-- ===== INDEX =====
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
