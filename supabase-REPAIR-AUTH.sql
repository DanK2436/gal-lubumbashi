-- ================================================
-- SCRIPT DE RÉPARATION AUTH - GAL LUBUMBASHI
-- À exécuter dans le SQL Editor de Supabase
-- ================================================

-- 1. Activer pgcrypto si non présent
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Réinitialiser le mot de passe de l'admin et s'assurer qu'il a une identité
DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- Récupérer l'ID de l'admin
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@gal-lubumbashi.com';

    IF admin_id IS NOT NULL THEN
        -- Mettre à jour le mot de passe (Admin123!)
        UPDATE auth.users 
        SET encrypted_password = crypt('Admin123!', gen_salt('bf')),
            email_confirmed_at = now(),
            updated_at = now()
        WHERE id = admin_id;

        -- Supprimer l'ancienne identité si elle existe pour éviter les doublons
        DELETE FROM auth.identities WHERE user_id = admin_id;

        -- Créer la nouvelle identité correcte
        INSERT INTO auth.identities (
            id, user_id, identity_data, provider, provider_id, 
            last_sign_in_at, created_at, updated_at
        ) VALUES (
            gen_random_uuid(),
            admin_id,
            format('{"sub":"%s","email":"%s"}', admin_id::text, 'admin@gal-lubumbashi.com')::jsonb,
            'email',
            admin_id::text,
            now(), now(), now()
        );

        RAISE NOTICE '✅ Compte Admin réparé avec succès !';
        RAISE NOTICE 'Email: admin@gal-lubumbashi.com';
        RAISE NOTICE 'Pass: Admin123!';
    ELSE
        RAISE NOTICE '❌ Utilisateur admin@gal-lubumbashi.com non trouvé. Veuillez exécuter supabase-FINAL-SETUP.sql d''abord.';
    END IF;
END $$;
