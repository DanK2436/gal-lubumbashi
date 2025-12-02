# Guide d'utilisation : Chantiers et Conceptions

## 📋 Vue d'ensemble

L'espace admin de GAL permet maintenant de gérer deux types de projets :
- **Chantiers** (🏗️) : Projets de construction en cours ou terminés
- **Conceptions** (📐) : Designs et conceptions architecturales

Toutes les données sont stockées dans **Supabase**, garantissant une persistance fiable et accessible depuis n'importe quel appareil.

## 🗄️ Configuration Supabase

### Étape 1 : Créer la table `projects`

Connectez-vous à votre tableau de bord Supabase et exécutez le script SQL suivant (déjà disponible dans `supabase-projects-table.sql`) :

```sql
-- Table des projets (chantiers et conceptions)
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    type VARCHAR(50) NOT NULL, -- 'chantiers' ou 'conceptions'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'draft'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Créer la politique d'accès public
CREATE POLICY "Accès public projets" ON projects FOR ALL USING (true);
```

### Étape 2 : Vérifier la configuration Supabase

Assurez-vous que vos clés Supabase sont correctement configurées dans `js/supabase-init.js` :

```javascript
const SUPABASE_URL = 'VOTRE_URL_SUPABASE';
const SUPABASE_KEY = 'VOTRE_CLE_ANON_SUPABASE';
```

## 🚀 Utilisation dans l'espace admin

### Accéder aux sections

1. Connectez-vous à l'espace admin : `https://votre-site.com/admin/`
2. Dans la barre latérale, cliquez sur :
   - **🏗️ Chantiers** pour gérer les chantiers
   - **📐 Conceptions** pour gérer les conceptions

### Ajouter un nouveau projet

1. Cliquez sur le bouton **"➕ Ajouter un chantier"** ou **"➕ Ajouter une conception"**
2. Remplissez le formulaire :
   - **Titre** : Nom du projet (requis)
   - **Description** : Description détaillée du projet (requis)
   - **URL de l'image** : Lien vers une image du projet (requis)
   - **Statut** : 
     - `Actif` : Projet en cours
     - `Terminé` : Projet complété
     - `Brouillon` : Projet non publié
3. Cliquez sur **"Enregistrer"**

### Modifier un projet existant

1. Dans le tableau, cliquez sur l'icône **✏️** à côté du projet
2. Modifiez les informations souhaitées
3. Cliquez sur **"Enregistrer"**

### Supprimer un projet

1. Cliquez sur l'icône **🗑️** à côté du projet
2. Confirmez la suppression

## 📊 Structure des données

Chaque projet dans Supabase contient les champs suivants :

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Identifiant unique (généré automatiquement) |
| `title` | String | Titre du projet |
| `description` | Text | Description complète |
| `image` | String | URL de l'image |
| `type` | String | `'chantiers'` ou `'conceptions'` |
| `status` | String | `'active'`, `'completed'`, ou `'draft'` |
| `created_at` | Timestamp | Date de création (auto) |
| `updated_at` | Timestamp | Date de modification (auto) |

## 🔧 Fonctions JavaScript disponibles

Les fonctions suivantes sont disponibles dans `js/storage.js` :

```javascript
// Récupérer tous les projets (ou par type)
await getProjects()           // Tous les projets
await getProjects('chantiers') // Seulement les chantiers
await getProjects('conceptions') // Seulement les conceptions

// Récupérer un projet par ID
await getProjectById(id)

// Créer un nouveau projet
await createProject({
  title: 'Mon projet',
  description: 'Description du projet',
  image: 'https://...',
  type: 'chantiers', // ou 'conceptions'
  status: 'active'
})

// Mettre à jour un projet
await updateProject(id, {
  title: 'Nouveau titre',
  status: 'completed'
})

// Supprimer un projet
await deleteProject(id)
```

## 🎨 Interface utilisateur

L'interface admin affiche les projets dans un tableau avec :
- **Image miniature** (60x40px)
- **Titre** du projet
- **Description** (tronquée à 50 caractères)
- **Date de création**
- **Actions** (Modifier / Supprimer)

## ✅ Vérification

Pour vérifier que tout fonctionne correctement :

1. Ajoutez un chantier de test
2. Vérifiez qu'il apparaît dans la liste
3. Modifiez-le
4. Vérifiez les modifications dans Supabase
5. Supprimez-le

## 🐛 Dépannage

### Les projets ne s'affichent pas

1. Vérifiez que la table `projects` existe dans Supabase
2. Vérifiez que les politiques RLS sont correctement configurées
3. Ouvrez la console du navigateur (F12) pour voir les erreurs

### Erreur lors de la création

1. Vérifiez que tous les champs requis sont remplis
2. Vérifiez que l'URL de l'image est valide
3. Vérifiez la connexion à Supabase dans la console

### Image non affichée

1. Vérifiez que l'URL de l'image est accessible publiquement
2. Utilisez des services d'hébergement d'images comme Imgur, Cloudinary, ou Supabase Storage

## 📝 Notes importantes

- Les projets sont stockés **uniquement** dans Supabase (pas de localStorage)
- Les modifications sont **immédiates** et **synchronisées** entre tous les appareils
- Les images doivent être hébergées en ligne (URL publique)
- Pour utiliser Supabase Storage pour les images, consultez la documentation Supabase

## 🔐 Sécurité

- Seuls les administrateurs connectés peuvent accéder à ces fonctionnalités
- Les politiques RLS de Supabase permettent l'accès public en lecture
- Pour une sécurité renforcée, modifiez les politiques RLS selon vos besoins

---

**Dernière mise à jour** : 2 décembre 2024
