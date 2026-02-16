-- ================================================
-- SCRIPT DE SYNCHRONISATION DES MEMBRES VERS AUTH
-- Ce script crée des comptes de connexion (Auth) pour 
-- tous les membres de la table 'members' qui n'en ont pas encore.
-- ================================================

DO $$
DECLARE
    m RECORD;
    new_auth_id UUID;
    encrypted_pw TEXT;
BEGIN
    RAISE NOTICE 'Début de la synchronisation des membres...';

    -- 1. Ajouter la colonne manquante si nécessaire
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'auth_user_id'
    ) THEN
        ALTER TABLE public.members ADD COLUMN auth_user_id UUID;
        RAISE NOTICE 'Colonne auth_user_id ajoutée à la table members.';
    END IF;

    -- Activer pgcrypto si nécessaire
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    FOR m IN SELECT id, email, password, name, phone FROM public.members LOOP
        
        -- Vérifier si l'utilisateur existe déjà dans auth.users
        SELECT id INTO new_auth_id FROM auth.users WHERE email = m.email;

        IF new_auth_id IS NULL THEN
            -- Créer un nouvel ID
            new_auth_id := gen_random_uuid();
            encrypted_pw := crypt(m.password, gen_salt('bf'));

            -- 1. Insérer dans auth.users
            INSERT INTO auth.users (
                instance_id, id, aud, role, email, encrypted_password, 
                email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
                created_at, updated_at, confirmation_token, recovery_token, 
                email_change_token_new, email_change
            ) VALUES (
                '00000000-0000-0000-0000-000000000000',
                new_auth_id,
                'authenticated',
                'authenticated',
                m.email,
                encrypted_pw,
                now(),
                '{"provider":"email","providers":["email"]}',
                format('{"name":"%s"}', m.name)::jsonb,
                now(), now(), '', '', '', ''
            );

            -- 2. Insérer dans auth.identities (requis pour le login par email)
            INSERT INTO auth.identities (
                id, user_id, identity_data, provider, provider_id, 
                last_sign_in_at, created_at, updated_at
            ) VALUES (
                gen_random_uuid(),
                new_auth_id,
                format('{"sub":"%s","email":"%s"}', new_auth_id::text, m.email)::jsonb,
                'email',
                new_auth_id::text,
                now(), now(), now()
            );

            RAISE NOTICE 'Compte Auth créé pour : %', m.email;
        ELSE
            -- Si l'utilisateur existe déjà, on s'assure juste que le mot de passe est synchronisé avec celui de la table members
            UPDATE auth.users 
            SET encrypted_password = crypt(m.password, gen_salt('bf')),
                updated_at = now()
            WHERE id = new_auth_id;
            
            RAISE NOTICE 'Compte Auth mis à jour pour : %', m.email;
        END IF;

        -- Mettre à jour la table members avec l'ID auth
        UPDATE public.members 
        SET auth_user_id = new_auth_id 
        WHERE id = m.id;

    END LOOP;

    RAISE NOTICE 'Synchronisation terminée !';
END $$;
