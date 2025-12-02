-- ================================================
-- SCRIPT DE VÉRIFICATION - Voir ce qui existe déjà
-- ================================================

-- Exécutez ce script AVANT tout pour voir ce qui existe déjà dans votre Supabase

-- 1. Lister toutes les tables existantes
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Vérifier les colonnes de chaque table si elles existent

-- VIDEOS
SELECT 
    'videos' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'videos'
ORDER BY ordinal_position;

-- FORMATIONS
SELECT 
    'formations' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'formations'
ORDER BY ordinal_position;

-- MACHINES
SELECT 
    'machines' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'machines'
ORDER BY ordinal_position;

-- BLOG_POSTS
SELECT 
    'blog_posts' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'blog_posts'
ORDER BY ordinal_position;

-- 3. Vérifier les politiques RLS existantes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Compter les enregistrements existants (si les tables existent)
DO $$
BEGIN
    -- Vidéos
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'videos') THEN
        RAISE NOTICE 'Videos: % enregistrements', (SELECT COUNT(*) FROM videos);
    ELSE
        RAISE NOTICE 'Table videos: N''EXISTE PAS';
    END IF;

    -- Formations
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formations') THEN
        RAISE NOTICE 'Formations: % enregistrements', (SELECT COUNT(*) FROM formations);
    ELSE
        RAISE NOTICE 'Table formations: N''EXISTE PAS';
    END IF;

    -- Machines
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'machines') THEN
        RAISE NOTICE 'Machines: % enregistrements', (SELECT COUNT(*) FROM machines);
    ELSE
        RAISE NOTICE 'Table machines: N''EXISTE PAS';
    END IF;

    -- Blog Posts
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts') THEN
        RAISE NOTICE 'Blog Posts: % enregistrements', (SELECT COUNT(*) FROM blog_posts);
    ELSE
        RAISE NOTICE 'Table blog_posts: N''EXISTE PAS';
    END IF;
END $$;
