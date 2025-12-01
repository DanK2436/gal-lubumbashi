# 🚀 Déploiement Rapide avec Supabase

Guide ultra-rapide pour déployer GAL Lubumbashi avec Supabase en **moins de 10 minutes**.

## ⚡ Étapes Express

### 1. Créer le projet Supabase (2 min)

1. Allez sur https://supabase.com
2. **"New Project"** → Nom: `gal-lubumbashi`
3. Choisissez un mot de passe fort et une région proche
4. Attendez la création (1-2 min)

### 2. Configurer les clés (1 min)

1. **Settings** → **API**
2. Copiez **Project URL** et **anon public key**
3. Collez dans `js/supabase-init.js` :

```javascript
const supabaseConfig = {
    url: "COLLEZ_ICI_VOTRE_URL",
    anonKey: "COLLEZ_ICI_VOTRE_CLÉ"
};
```

### 3. Créer les tables (2 min)

1. **SQL Editor** → **New query**
2. Copiez-collez ce script et cliquez **Run** :

```sql
-- Tables principales
CREATE TABLE members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE formations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE,
    capacity INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE formation_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    formation_id UUID REFERENCES formations(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Politiques (accès public)
CREATE POLICY "Accès public" ON members FOR ALL USING (true);
CREATE POLICY "Accès public" ON formations FOR ALL USING (true);
CREATE POLICY "Accès public" ON formation_reservations FOR ALL USING (true);
CREATE POLICY "Accès public" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
```

### 4. Tester (1 min)

1. Ouvrez votre site
2. Appuyez sur **F12** (console)
3. Vous devriez voir : `✅ Supabase initialisé avec succès`

## 🎯 Optionnel : Ajouter des données de test

Dans **SQL Editor**, ajoutez quelques formations :

```sql
INSERT INTO formations (title, description, date, capacity) VALUES
('Couture Niveau 1', 'Initiation à la couture', NOW() + INTERVAL '7 days', 15),
('Informatique de base', 'Bases de l''ordinateur et internet', NOW() + INTERVAL '14 days', 20),
('Électricité domestique', 'Installation électrique résidentielle', NOW() + INTERVAL '21 days', 12);
```

## ✅ C'est tout !

Votre site est maintenant connecté à Supabase ! 🎉

### Prochaines étapes

- Consultez `SUPABASE_SETUP.md` pour la documentation complète
- Personnalisez les politiques de sécurité si nécessaire
- Configurez l'authentification par email dans **Authentication** → **Providers**

## 🆘 Problème ?

- **Console d'erreur** : Vérifiez que l'URL et la clé sont exactes
- **Tables manquantes** : Assurez-vous d'avoir exécuté tout le script SQL
- **Permissions** : Les politiques RLS sont configurées pour un accès public par défaut

---

📚 Documentation complète : voir `SUPABASE_SETUP.md`
