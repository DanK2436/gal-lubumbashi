-- ================================================
-- SCRIPT DE RÉINITIALISATION COMPLÈTE - SUPABASE
-- ⚠️ ATTENTION : CE SCRIPT SUPPRIME TOUT !
-- Version : CORRIGÉE (Plus d'erreur "relation does not exist")
-- ================================================

-- Ce script supprime TOUTES les tables, vues, fonctions et politiques.
-- Le mot-clé CASCADE supprime automatiquement les triggers et index associés.

-- 1. SUPPRESSION DES VUES
DROP VIEW IF EXISTS gal_tables_summary CASCADE;
DROP VIEW IF EXISTS gal_database_summary CASCADE;
DROP VIEW IF EXISTS data_summary CASCADE;

-- 2. SUPPRESSION DES TABLES (et de leurs dépendances)
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS formations CASCADE;
DROP TABLE IF EXISTS machines CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS machine_reservations CASCADE;
DROP TABLE IF EXISTS formation_reservations CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS chatbot_conversations CASCADE;
DROP TABLE IF EXISTS chatbot_knowledge CASCADE;

-- Suppression des anciennes tables potentielles
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS inscriptions CASCADE;

-- 3. SUPPRESSION DES FONCTIONS
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 4. MESSAGE DE CONFIRMATION
DO $$
BEGIN
    RAISE NOTICE '✅ TOUT A ÉTÉ SUPPRIMÉ AVEC SUCCÈS !';
    RAISE NOTICE '👉 Vous pouvez maintenant exécuter supabase-DATABASE-COMPLETE.sql';
END $$;
