# Configuration Supabase pour GAL Lubumbashi

Ce guide vous explique comment configurer **Supabase** pour votre projet GAL Lubumbashi.

## 🎯 Pourquoi Supabase ?

Supabase est une alternative open-source à Firebase qui offre :
- ✅ Une base de données PostgreSQL puissante
- ✅ Authentification intégrée
- ✅ Stockage de fichiers
- ✅ API en temps réel
- ✅ Gratuit jusqu'à 500 Mo de base de données et 1 Go de stockage
- ✅ Plus de contrôle et de flexibilité

## 📋 Étapes de configuration

### 1. Créer un compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"**
3. Créez un compte (gratuit) avec votre email ou GitHub

### 2. Créer un nouveau projet

1. Dans le dashboard, cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `gal-lubumbashi` (ou le nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort (notez-le !)
   - **Region** : Choisissez la région la plus proche (ex: `Europe West (London)`)
3. Cliquez sur **"Create new project"**
4. Attendez quelques minutes que le projet soit créé

### 3. Récupérer les clés API

1. Dans votre projet, allez dans **Settings** (icône engrenage) → **API**
2. Vous verrez deux informations importantes :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon/public key** : Une longue clé commençant par `eyJ...`
3. Copiez ces deux valeurs

### 4. Configurer le projet

Ouvrez le fichier `js/supabase-init.js` et remplacez les valeurs :

```javascript
const supabaseConfig = {
    url: "https://xxxxx.supabase.co",          // Collez votre Project URL
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI..." // Collez votre anon key
};
```

### 5. Créer les tables nécessaires

Dans votre projet Supabase, allez dans **SQL Editor** et exécutez ce script :

```sql
-- Table des membres
CREATE TABLE members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Table des réservations de formations
CREATE TABLE formation_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    formation_id UUID REFERENCES formations(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des machines
CREATE TABLE machines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'available',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Table des abonnés à la newsletter
CREATE TABLE newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security (RLS) pour toutes les tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité (permettre la lecture publique, écriture authentifiée)
-- Vous pouvez les ajuster selon vos besoins

-- Membres : lecture publique, modification par l'utilisateur lui-même
CREATE POLICY "Lecture publique des membres" ON members FOR SELECT USING (true);
CREATE POLICY "Les utilisateurs peuvent s'inscrire" ON members FOR INSERT WITH CHECK (true);

-- Formations : lecture publique
CREATE POLICY "Lecture publique des formations" ON formations FOR SELECT USING (true);

-- Réservations de formations : lecture et insertion publiques
CREATE POLICY "Lecture publique des réservations" ON formation_reservations FOR SELECT USING (true);
CREATE POLICY "Insertion publique des réservations" ON formation_reservations FOR INSERT WITH CHECK (true);

-- Machines : lecture publique
CREATE POLICY "Lecture publique des machines" ON machines FOR SELECT USING (true);

-- Réservations de machines : lecture et insertion publiques
CREATE POLICY "Lecture publique des réservations machines" ON machine_reservations FOR SELECT USING (true);
CREATE POLICY "Insertion publique des réservations machines" ON machine_reservations FOR INSERT WITH CHECK (true);

-- Messages de contact : insertion publique
CREATE POLICY "Insertion publique des messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Newsletter : insertion publique
CREATE POLICY "Inscription publique à la newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
```

### 6. Configurer l'authentification (optionnel)

Si vous souhaitez utiliser l'authentification par email :

1. Allez dans **Authentication** → **Providers**
2. Activez **Email** (activé par défaut)
3. Configurez les paramètres d'email si nécessaire

Pour l'authentification sociale (Google, Facebook, etc.) :
1. Activez le provider souhaité
2. Suivez les instructions pour configurer l'app OAuth

### 7. Créer un bucket de stockage (optionnel)

Pour stocker des images ou fichiers :

1. Allez dans **Storage**
2. Cliquez sur **"Create a new bucket"**
3. Nom : `media` ou `uploads`
4. Définissez les permissions (public ou privé)

## 🧪 Tester la configuration

1. Ouvrez votre site web
2. Ouvrez la console du navigateur (F12)
3. Vous devriez voir : `✅ Supabase initialisé avec succès`

## 📚 Utilisation dans le code

### Importer les services

```javascript
import { 
    supabaseLogin, 
    supabaseRegister, 
    supabaseLogout,
    getCollection,
    addDocument,
    updateDocument,
    deleteDocument 
} from './js/supabase-service.js';
```

### Exemples d'utilisation

#### Authentification

```javascript
// Inscription
const user = await supabaseRegister('user@example.com', 'password123');

// Connexion
const user = await supabaseLogin('user@example.com', 'password123');

// Déconnexion
await supabaseLogout();
```

#### Récupérer des données

```javascript
// Récupérer toutes les formations
const formations = await getCollection('formations');

// Récupérer avec options
const formations = await getCollection('formations', {
    orderBy: 'created_at',
    ascending: false,
    limit: 10
});
```

#### Ajouter des données

```javascript
// Ajouter un membre à la newsletter
await addDocument('newsletter_subscribers', {
    email: 'user@example.com'
});

// Ajouter une réservation
await addDocument('formation_reservations', {
    formation_id: 'uuid-de-la-formation',
    name: 'Jean Dupont',
    email: 'jean@example.com',
    phone: '+243 123 456 789'
});
```

#### Mettre à jour et supprimer

```javascript
// Mettre à jour un document
await updateDocument('members', 'uuid-du-membre', {
    status: 'inactive'
});

// Supprimer un document
await deleteDocument('formations', 'uuid-de-la-formation');
```

## 🔒 Sécurité

### Row Level Security (RLS)

Les politiques RLS sont déjà configurées dans le script SQL ci-dessus. Elles permettent :
- Lecture publique pour la plupart des tables
- Insertion publique pour les réservations et messages
- Protection des données sensibles

### Variables d'environnement (recommandé pour la production)

Pour plus de sécurité, stockez vos clés dans des variables d'environnement :

```javascript
const supabaseConfig = {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
};
```

## 📊 Dashboard Supabase

Le dashboard Supabase vous permet de :
- Visualiser et modifier vos données en temps réel
- Gérer les utilisateurs
- Consulter les logs
- Monitorer l'utilisation
- Créer des backups

## 🆘 Dépannage

### Le site ne se connecte pas

1. Vérifiez que vous avez bien copié l'URL et la clé
2. Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
3. Regardez la console du navigateur pour les erreurs

### Erreur "relation does not exist"

Les tables n'ont pas été créées. Exécutez le script SQL dans **SQL Editor**.

### Erreur de permissions

Vérifiez vos politiques RLS dans **Authentication** → **Policies**.

## 📖 Documentation complète

Pour plus d'informations :
- [Documentation Supabase](https://supabase.com/docs)
- [Guide JavaScript](https://supabase.com/docs/reference/javascript/introduction)
- [Guide SQL](https://supabase.com/docs/guides/database)

## 🎉 C'est fait !

Votre projet est maintenant connecté à Supabase et prêt à stocker des données en ligne ! 🚀
