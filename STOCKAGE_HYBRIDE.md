# 🔄 Système de Stockage Hybride (Supabase + LocalStorage)

## 📖 Vue d'ensemble

Le fichier `js/storage.js` a été mis à jour pour supporter **deux modes de stockage** :

### ✅ Mode Supabase (Recommandé)
- Données stockées dans le cloud Supabase
- Synchronisation en temps réel entre appareils
- Sauvegardes automatiques
- Scalable et sécurisé

### ⚠️ Mode LocalStorage (Fallback)
- Données stockées localement dans le navigateur
- Pas de synchronisation entre appareils
- Données temporaires (peuvent être effacées)
- Fonctionne sans configuration backend

## 🎯 Comment ça marche ?

Le système détecte automatiquement si Supabase est configuré :

```javascript
// Dans storage.js
const isSupabaseActive = () => !!supabase;

if (isSupabaseActive()) {
    // Utilise Supabase
    return await getCollection('formations');
} else {
    // Utilise localStorage
    const data = localStorage.getItem(STORAGE_KEYS.FORMATIONS);
    return data ? JSON.parse(data) : [];
}
```

### Avantages de cette approche

1. **Pas de configuration obligatoire** : Le site fonctionne immédiatement avec localStorage
2. **Migration facile** : Configurez Supabase quand vous êtes prêt
3. **Compatibilité** : Le code des pages n'a pas besoin d'être modifié
4. **Flexibilité** : Vous pouvez basculer entre les deux à tout moment

## 📊 Fonctions intégrées avec Supabase

### ✅ Formations
- `getFormations()` - Récupère toutes les formations
- `createFormation(data)` - Crée une nouvelle formation
- `updateFormation(id, data)` - Met à jour une formation
- `deleteFormation(id)` - Supprime une formation

### ✅ Machines
- `getMachines()` - Récupère toutes les machines
- `createMachine(data)` - Crée une nouvelle machine
- `updateMachine(id, data)` - Met à jour une machine
- `deleteMachine(id)` - Supprime une machine

### ✅ Newsletter
- `getNewsletterSubscribers()` - Récupère les abonnés
- `addNewsletterSubscriber(email)` - Ajoute un abonné
- `removeNewsletterSubscriber(email)` - Supprime un abonné

### ✅ Contacts
- `saveContact(data)` - Enregistre un message de contact
- `getContacts()` - Récupère tous les messages

### ✅ Réservations de machines
- `getReservations()` - Récupère les réservations
- `saveReservation(data)` - Enregistre une réservation
- `updateReservationStatus(id, status)` - Met à jour le statut

### ✅ Inscriptions aux formations
- `getFormationRegistrations()` - Récupère les inscriptions
- `saveFormationRegistration(data)` - Enregistre une inscription
- `updateFormationRegistrationStatus(id, status)` - Met à jour le statut

### ✅ Membres
- `getMembers()` - Récupère tous les membres
- `getMemberByEmail(email)` - Trouve un membre par email
- `createMember(data)` - Crée un nouveau membre
- `updateMember(id, data)` - Met à jour un membre
- `deleteMember(id)` - Supprime un membre

### ⚠️ LocalStorage seulement (pour l'instant)
Ces fonctions utilisent seulement localStorage :
- Vidéos (`getVideos()`, etc.)
- Blog (`getBlogPosts()`, etc.)
- Authentification (`login()`, `logout()`)
- Chatbot (`getChatbotHistory()`)
- Langue (`getLanguage()`, `setLanguage()`)

## 🚀 Configuration Supabase

### Étape 1 : Créer les tables

Connectez-vous à votre projet Supabase et exécutez ce SQL :

```sql
-- Table des formations
CREATE TABLE formations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE,
    capacity INTEGER,
    instructor VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des machines
CREATE TABLE machines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    slug VARCHAR(255),
    status VARCHAR(50) DEFAULT 'available',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des abonnés newsletter
CREATE TABLE newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des messages de contact
CREATE TABLE contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations de machines
CREATE TABLE machine_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    machine_id UUID REFERENCES machines(id),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des inscriptions aux formations
CREATE TABLE formation_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    formation_id UUID REFERENCES formations(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des membres
CREATE TABLE members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    password VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès public
CREATE POLICY "Accès public" ON formations FOR ALL USING (true);
CREATE POLICY "Accès public" ON machines FOR ALL USING (true);
CREATE POLICY "Insertion publique newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Lecture publique newsletter" ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Insertion publique contacts" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertion publique réservations" ON machine_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Lecture publique réservations" ON machine_reservations FOR SELECT USING (true);
CREATE POLICY "Insertion publique formations" ON formation_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Lecture publique inscriptions" ON formation_reservations FOR SELECT USING (true);
CREATE POLICY "Accès public membres" ON members FOR ALL USING (true);
```

### Étape 2 : Configurer les clés

Les clés sont déjà configurées dans `js/supabase-init.js` ! ✅

### Étape 3 : Tester

1. Ouvrez votre site
2. Ouvrez la console (F12)
3. Vous devriez voir : `✅ Supabase initialisé avec succès`
4. Essayez d'ajouter un abonné à la newsletter
5. Vérifiez dans Supabase Dashboard que les données sont bien enregistrées

## 🔧 Migration des données existantes (optionnel)

Si vous avez des données dans localStorage que vous voulez migrer vers Supabase :

### Option 1 : Export/Import manuel

1. **Exporter depuis localStorage** :
```javascript
// Dans la console du navigateur
const formations = JSON.parse(localStorage.getItem('gal_formations'));
console.log(JSON.stringify(formations, null, 2));
```

2. **Importer dans Supabase** :
```sql
-- Dans Supabase SQL Editor
INSERT INTO formations (title, description, date, capacity) VALUES
('Couture Niveau 1', 'Description...', '2024-01-15', 20),
('Informatique de base', 'Description...', '2024-02-20', 15);
```

### Option 2 : Script automatique (à créer si besoin)

## 🎯 Statut actuel

✅ **Configuré avec Supabase** :
- Formations
- Machines
- Newsletter
- Contacts
- Réservations machines
- Inscriptions formations
- Membres

⚠️ **Encore en localStorage** :
- Vidéos
- Blog
- Auth (admin)
- Chatbot
- Pages statiques

Ces fonctions peuvent être migrées vers Supabase plus tard si nécessaire.

## 📚 Documentation complète

Pour plus d'informations sur Supabase :
- `SUPABASE_SETUP.md` - Configuration complète
- `DEPLOIEMENT_RAPIDE_SUPABASE.md` - Guide rapide
- `MIGRATION_FIREBASE_SUPABASE.md` - Contexte de la migration

## 🎉 C'est tout !

Votre site utilise maintenant **automatiquement Supabase** pour stocker les données importantes, avec un fallback sur localStorage si Supabase n'est pas disponible. Aucune autre modification de code n'est nécessaire ! 🚀
