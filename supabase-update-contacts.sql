-- Ajout de la colonne phone à la table contact_messages
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
