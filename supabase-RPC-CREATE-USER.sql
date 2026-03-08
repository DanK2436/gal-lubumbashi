-- ================================================
-- FONCTION RPC POUR CRÉER DES UTILISATEURS AUTH
-- Version : 1.1 - 2026-02-15
-- ================================================

-- Activer l'extension pour le hachage des mots de passe
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fonction de création d'utilisateur sécurisée
-- Cette fonction insère directement dans auth.users
-- ATTENTION : Doit être exécutée avec des privilèges élevés (Superuser)
CREATE OR REPLACE FUNCTION create_user_command(
  email text,
  password text,
  user_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER -- Exécute avec les droits du créateur de la fonction
SET search_path = public -- Sécurité: restreindre le search_path
AS $$
DECLARE
  user_id uuid;
  encrypted_pw text;
BEGIN
  -- Génère un nouvel ID
  user_id := gen_random_uuid();
  
  -- Hache le mot de passe (Bcrypt)
  encrypted_pw := crypt(password, gen_salt('bf'));

  -- Insertion dans la table auth.users de Supabase
  -- Note: instance_id est généralement '00000000-0000-0000-0000-000000000000' par défaut
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_id,
    'authenticated',
    'authenticated',
    email,
    encrypted_pw,
    now(), -- Confirme l'email automatiquement
    '{"provider":"email","providers":["email"]}',
    user_metadata,
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Création d'une identité (souvent requise pour le login)
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    user_id,
    format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb,
    'email',
    user_id::text, -- Pour le provider 'email', provider_id est l'ID de l'utilisateur
    now(),
    now(),
    now()
  );

  RETURN user_id;
END;
$$;

-- Fonction pour mettre à jour le mot de passe d'un utilisateur Auth
CREATE OR REPLACE FUNCTION update_user_password_command(
  target_email text,
  new_password text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE auth.users
  SET encrypted_password = crypt(new_password, gen_salt('bf')),
      updated_at = now()
  WHERE email = target_email;
END;
$$;

COMMENT ON FUNCTION create_user_command IS 'Crée un utilisateur Supabase Auth directement depuis SQL. Usage réservé aux Admins.';
COMMENT ON FUNCTION update_user_password_command IS 'Met à jour le mot de passe d''un utilisateur Auth. Usage réservé aux Admins.';

-- Accorder l'exécution
GRANT EXECUTE ON FUNCTION create_user_command TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_command TO service_role;
GRANT EXECUTE ON FUNCTION update_user_password_command TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_password_command TO service_role;
