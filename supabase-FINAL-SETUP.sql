-- ========================================================
-- CONFIGURATION FINALE SUPER-SÉCURISÉE - STOCKAGE & ADMIN
-- Ce script évite les erreurs de permission et les doublons
-- ========================================================

-- 1. CONFIGURATION DU STOCKAGE (STORAGE)
-- Crée le bucket 'uploads' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Suppression propre des anciennes politiques (si elles existent)
-- On utilise DROP POLICY qui est la commande standard autorisée
DROP POLICY IF EXISTS "Accès public en lecture" ON storage.objects;
DROP POLICY IF EXISTS "Téléversement public" ON storage.objects;
DROP POLICY IF EXISTS "Modification et suppression publique" ON storage.objects;

-- Création des nouvelles politiques de sécurité pour le stockage
CREATE POLICY "Accès public en lecture" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Téléversement public" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Modification et suppression publique" ON storage.objects FOR ALL USING (bucket_id = 'uploads');


-- 2. CRÉATION DU COMPTE ADMIN DANS SUPABASE AUTH
-- Utilisation d'un bloc DO pour vérifier l'existence avant d'insérer
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
    -- On vérifie par l'email si l'admin existe déjà
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@gal-lubumbashi.com') THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, recovery_sent_at, last_sign_in_at, 
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
            confirmation_token, email_change, email_change_token_new, recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            new_user_id,
            'authenticated',
            'authenticated',
            'admin@gal-lubumbashi.com',
            crypt('Admin123!', gen_salt('bf')),
            now(), now(), now(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            now(), now(),
            '', '', '', ''
        );
        RAISE NOTICE '✅ Utilisateur Admin créé dans auth.users';

        -- AJOUT DE L'IDENTITÉ (Crucial pour le login)
        INSERT INTO auth.identities (
            id, user_id, identity_data, provider, provider_id, 
            last_sign_in_at, created_at, updated_at
        ) VALUES (
            gen_random_uuid(),
            new_user_id,
            format('{"sub":"%s","email":"%s"}', new_user_id::text, 'admin@gal-lubumbashi.com')::jsonb,
            'email',
            new_user_id::text, -- provider_id est l''ID de l''utilisateur pour le provider email
            now(), now(), now()
        );
        RAISE NOTICE '✅ Identité Admin créée dans auth.identities';
    ELSE
        RAISE NOTICE 'ℹ️ L''utilisateur admin existe déjà dans auth.users';
    END IF;
END $$;


-- 3. AJOUT DANS LA TABLE DES MEMBRES DU SITE
-- On vérifie aussi l'existence ici
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.members WHERE email = 'admin@gal-lubumbashi.com') THEN
        INSERT INTO public.members (
            email, name, phone, password, company, specialty, status
        ) VALUES (
            'admin@gal-lubumbashi.com',
            'Administrateur GAL',
            '+243 000 000 000',
            'Admin123!',
            'GAL Lubumbashi',
            'Administration',
            'active'
        );
        RAISE NOTICE '✅ Utilisateur Admin ajouté à la table public.members';
    ELSE
        RAISE NOTICE 'ℹ️ L''utilisateur admin existe déjà dans public.members';
    END IF;
END $$;
