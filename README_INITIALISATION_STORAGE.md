# 📦 Initialisation du Stockage Supabase - Chantiers et Conceptions

> **TL;DR** : Pour initialiser rapidement le stockage, suivez le fichier [CHECKLIST_INITIALISATION.md](./CHECKLIST_INITIALISATION.md)

## 🎯 Objectif

Ce dossier contient tous les fichiers nécessaires pour initialiser et gérer le système de stockage des **Chantiers** et **Conceptions** dans Supabase pour le projet GAL Lubumbashi.

## 📁 Fichiers d'initialisation

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **[CHECKLIST_INITIALISATION.md](./CHECKLIST_INITIALISATION.md)** | ✅ Checklist étape par étape avec cases à cocher | 🟢 **COMMENCEZ ICI** - Pour initialiser le système |
| **[INITIALISATION_CHANTIERS_CONCEPTIONS.md](./INITIALISATION_CHANTIERS_CONCEPTIONS.md)** | 📖 Guide détaillé complet avec explications | Pour comprendre en profondeur |
| **[supabase-init-projects-complete.sql](./supabase-init-projects-complete.sql)** | 📄 Script SQL complet d'initialisation | À exécuter dans Supabase SQL Editor |
| **[GUIDE_CHANTIERS_CONCEPTIONS.md](./GUIDE_CHANTIERS_CONCEPTIONS.md)** | 📚 Guide d'utilisation quotidienne | Après l'initialisation, pour utiliser le système |
| **[js/test-projects-storage.js](./js/test-projects-storage.js)** | 🧪 Tests automatiques | Pour vérifier que tout fonctionne |

## 🚀 Démarrage rapide

### Option 1 : Suivre la checklist (Recommandé)

```bash
1. Ouvrez CHECKLIST_INITIALISATION.md
2. Suivez les étapes en cochant les cases
3. Exécutez le script SQL dans Supabase
4. Testez depuis l'interface admin
```

### Option 2 : Commandes rapides

**Étape 1 - Vérifier la configuration**

Ouvrez `js/supabase-init.js` et vérifiez que vos clés sont configurées.

**Étape 2 - Exécuter le script SQL**

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Ouvrez SQL Editor
4. Copiez le contenu de `supabase-init-projects-complete.sql`
5. Exécutez-le

**Étape 3 - Tester**

Dans la console du navigateur (F12) :

```javascript
import('./js/test-projects-storage.js').then(m => m.runTests());
```

## 📊 Structure de la table `projects`

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,        -- 'chantiers' ou 'conceptions'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'draft'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔑 Fonctionnalités

### ✅ Ce qui est inclus

- ✅ Table `projects` optimisée pour PostgreSQL
- ✅ Index de performance sur type, status, et dates
- ✅ Trigger automatique pour `updated_at`
- ✅ Row Level Security (RLS) configuré
- ✅ Politiques d'accès public pour développement
- ✅ Fonctions CRUD complètes (Create, Read, Update, Delete)
- ✅ Interface admin pour gérer les projets
- ✅ Tests automatiques
- ✅ Documentation complète

### 🛠️ Fonctions JavaScript disponibles

```javascript
import {
    getProjects,      // Récupérer tous les projets ou par type
    getProjectById,   // Récupérer un projet spécifique
    createProject,    // Créer un nouveau projet
    updateProject,    // Modifier un projet existant
    deleteProject     // Supprimer un projet
} from './js/storage.js';

// Exemples d'utilisation
const allProjects = await getProjects();
const chantiers = await getProjects('chantiers');
const conceptions = await getProjects('conceptions');

const newProject = await createProject({
    title: 'Mon Chantier',
    description: 'Description...',
    image: 'https://...',
    type: 'chantiers',
    status: 'active'
});

await updateProject(projectId, { status: 'completed' });
await deleteProject(projectId);
```

## 🎨 Interface Admin

L'interface admin est accessible via :

- **URL** : `admin/index.html`
- **Email** : `admin@gal-lubumbashi.com`
- **Mot de passe** : `Admin123!`

**Sections disponibles :**

- 🏗️ **Chantiers** - Gérer les chantiers de construction
- 📐 **Conceptions** - Gérer les designs et conceptions

**Actions possibles :**

- ➕ Ajouter un nouveau projet
- ✏️ Modifier un projet existant
- 🗑️ Supprimer un projet
- 👁️ Voir tous les projets dans un tableau

## 🧪 Tests

### Exécuter les tests automatiques

**Méthode 1 : Console du navigateur**

```javascript
import('./js/test-projects-storage.js').then(module => {
    module.runTests();
});
```

**Méthode 2 : Fichier HTML de test**

Créez un fichier `test-projects.html` :

```html
<!DOCTYPE html>
<html>
<head><title>Test Projects</title></head>
<body>
    <h1>Tests en cours...</h1>
    <p>Ouvrez la console (F12)</p>
    <script type="module" src="./js/test-projects-storage.js"></script>
</body>
</html>
```

### Tests manuels

1. Créez un chantier depuis l'admin
2. Vérifiez qu'il apparaît dans Supabase Table Editor
3. Modifiez-le depuis l'admin
4. Vérifiez que `updated_at` a changé dans Supabase
5. Supprimez-le
6. Vérifiez qu'il a disparu

## 🔐 Sécurité

### Configuration actuelle (Développement)

- 🟢 **Lecture** : Publique (tous)
- 🟢 **Écriture** : Publique (tous)

Cette configuration est OK pour le développement mais **doit être renforcée en production**.

### Configuration recommandée (Production)

Modifiez les politiques RLS pour :

- 🟢 **Lecture** : Publique (visiteurs peuvent voir)
- 🔴 **Écriture** : Authentifiée uniquement (admins peuvent modifier)

Voir section "Étape 4" dans [INITIALISATION_CHANTIERS_CONCEPTIONS.md](./INITIALISATION_CHANTIERS_CONCEPTIONS.md)

## 📈 Optimisations incluses

### Index de performance

```sql
-- Filtrage par type
CREATE INDEX idx_projects_type ON projects(type);

-- Filtrage par statut
CREATE INDEX idx_projects_status ON projects(status);

-- Tri par date
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Requêtes combinées
CREATE INDEX idx_projects_type_status ON projects(type, status);
CREATE INDEX idx_projects_type_created ON projects(type, created_at DESC);
```

### Trigger automatique

Le champ `updated_at` se met à jour automatiquement à chaque modification grâce à un trigger PostgreSQL.

## 🐛 Dépannage

| Problème | Solution |
|----------|----------|
| ❌ "relation projects does not exist" | Exécutez le script SQL d'initialisation |
| ❌ "permission denied" | Vérifiez les politiques RLS dans Supabase |
| ❌ Les projets ne s'affichent pas | Vérifiez la configuration Supabase dans `js/supabase-init.js` |
| ❌ Erreur lors de la création | Vérifiez que tous les champs requis sont remplis |
| ❌ Image ne s'affiche pas | L'URL doit être publique et commencer par http:// ou https:// |

Pour plus de détails, voir [INITIALISATION_CHANTIERS_CONCEPTIONS.md](./INITIALISATION_CHANTIERS_CONCEPTIONS.md) section "Dépannage".

## 📚 Documentation Supabase

- [Documentation officielle](https://supabase.com/docs)
- [Guide PostgreSQL](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Guide JavaScript](https://supabase.com/docs/reference/javascript/introduction)

## 🎯 Prochaines étapes

Après l'initialisation :

1. ✅ Testez la création de quelques projets
2. ✅ Vérifiez que tout fonctionne
3. 📝 Lisez [GUIDE_CHANTIERS_CONCEPTIONS.md](./GUIDE_CHANTIERS_CONCEPTIONS.md) pour l'utilisation quotidienne
4. 🔐 Renforcez la sécurité avant la mise en production
5. 💾 Configurez les sauvegardes régulières dans Supabase

## 📞 Support

Pour toute question :

1. Consultez d'abord la documentation ci-dessus
2. Vérifiez la console du navigateur (F12) pour les erreurs
3. Consultez les logs Supabase dans le dashboard
4. Exécutez les tests automatiques pour diagnostiquer

## ✅ Validation

Pour confirmer que tout est correctement initialisé, vérifiez :

- [ ] La table `projects` existe dans Supabase
- [ ] Vous pouvez créer un projet depuis l'admin
- [ ] Le projet apparaît dans Supabase Table Editor
- [ ] Vous pouvez modifier et supprimer des projets
- [ ] Les tests automatiques passent tous ✅
- [ ] Le champ `updated_at` se met à jour automatiquement

---

**Version** : 2.0  
**Date** : 2 décembre 2024  
**Projet** : GAL Lubumbashi  
**Auteur** : Documentation générée pour l'initialisation Supabase
