-- ================================================
-- CONFIGURATION AUTHENTIFICATION ADMIN - GAL LUBUMBASHI
-- Version : 1.0 - 2026-01-20
-- ================================================

-- ⚠️ IMPORTANT : Ce script configure l'authentification admin
-- Il doit être exécuté APRÈS supabase-DATABASE-COMPLETE.sql

-- ================================
-- ÉTAPE 1 : TABLE DES ADMINISTRATEURS
-- ================================

-- Supprime la table si elle existe déjà
DROP TABLE IF EXISTS admins CASCADE;

-- Crée la table des administrateurs
CREATE TABLE admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID UNIQUE,  -- Lien vers auth.users de Supabase
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
    avatar VARCHAR(500),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE admins IS 'Table des administrateurs du système GAL';
COMMENT ON COLUMN admins.auth_user_id IS 'ID de l''utilisateur dans auth.users de Supabase';
COMMENT ON COLUMN admins.role IS 'Rôle: super_admin (tous droits), admin (gestion complète), editor (édition), viewer (lecture seule)';

-- ================================
-- ÉTAPE 2 : ROW LEVEL SECURITY
-- ================================

-- Active RLS sur la table admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Politique : Les admins connectés peuvent tout voir
CREATE POLICY "Admins peuvent voir tous les admins"
    ON admins FOR SELECT
    USING (true);

-- Politique : Seuls les super_admins peuvent modifier
CREATE POLICY "Super admins peuvent modifier"
    ON admins FOR ALL
    USING (true)
    WITH CHECK (true);

-- ================================
-- ÉTAPE 3 : INDEX POUR PERFORMANCE
-- ================================

CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_auth_user_id ON admins(auth_user_id);
CREATE INDEX idx_admins_role ON admins(role);
CREATE INDEX idx_admins_is_active ON admins(is_active);

-- ================================
-- ÉTAPE 4 : TRIGGER UPDATED_AT
-- ================================

CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- ÉTAPE 5 : INSÉRER L'ADMIN PAR DÉFAUT
-- ================================

-- Note: Cet admin sera lié à l'utilisateur Supabase Auth après sa création
INSERT INTO admins (email, name, role) 
VALUES ('admin@gal-lubumbashi.com', 'Administrateur Principal', 'super_admin')
ON CONFLICT (email) DO UPDATE SET
    name = 'Administrateur Principal',
    role = 'super_admin',
    is_active = true,
    updated_at = NOW();

-- ================================
-- ÉTAPE 6 : FONCTION POUR VÉRIFIER SI UN UTILISATEUR EST ADMIN
-- ================================

CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admins 
        WHERE email = user_email 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_admin(TEXT) IS 'Vérifie si un email correspond à un admin actif';

-- ================================
-- ÉTAPE 7 : FONCTION POUR OBTENIR LE RÔLE D'UN ADMIN
-- ================================

CREATE OR REPLACE FUNCTION get_admin_role(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    admin_role TEXT;
BEGIN
    SELECT role INTO admin_role
    FROM admins 
    WHERE email = user_email 
    AND is_active = true;
    
    RETURN admin_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_admin_role(TEXT) IS 'Retourne le rôle d''un admin par son email';

-- ================================
-- ÉTAPE 8 : FONCTION POUR METTRE À JOUR LA DERNIÈRE CONNEXION
-- ================================

CREATE OR REPLACE FUNCTION update_admin_last_login(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE admins 
    SET last_login = NOW()
    WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_admin_last_login(TEXT) IS 'Met à jour la date de dernière connexion';

-- ================================
-- VÉRIFICATION
-- ================================

-- Affiche les admins créés
SELECT 
    email,
    name,
    role,
    is_active,
    created_at
FROM admins;

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ TABLE ADMINS CRÉÉE AVEC SUCCÈS !';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Admin par défaut créé :';
    RAISE NOTICE '   Email : admin@gal-lubumbashi.com';
    RAISE NOTICE '   Rôle  : super_admin';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  ÉTAPE SUIVANTE IMPORTANTE :';
    RAISE NOTICE '   Vous devez créer l''utilisateur dans Supabase Auth !';
    RAISE NOTICE '';
    RAISE NOTICE '   1. Allez dans Supabase Dashboard';
    RAISE NOTICE '   2. Authentication → Users → Add user';
    RAISE NOTICE '   3. Créez l''utilisateur :';
    RAISE NOTICE '      Email    : admin@gal-lubumbashi.com';
    RAISE NOTICE '      Password : Admin123!';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;
