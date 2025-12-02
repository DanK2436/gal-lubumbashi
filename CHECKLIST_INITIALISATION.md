# 📋 Checklist d'Initialisation - Chantiers et Conceptions

## ✅ Étapes à suivre pour initialiser le stockage Supabase

### 1️⃣ Vérifier la configuration Supabase

- [ ] Votre compte Supabase est créé sur https://supabase.com
- [ ] Votre projet `gal-lubumbashi` existe
- [ ] Les clés API sont configurées dans `js/supabase-init.js`
  - URL: `https://isshhhysudktvowdzzwc.supabase.co`
  - Clé Anon: Configurée ✅

**Action** : Ouvrir le fichier `js/supabase-init.js` et vérifier

---

### 2️⃣ Exécuter le script SQL d'initialisation

**Méthode recommandée :**

1. Connectez-vous à https://supabase.com/dashboard
2. Sélectionnez le projet `gal-lubumbashi`
3. Cliquez sur **SQL Editor** dans le menu (icône 🔍)
4. Cliquez sur **+ New Query**
5. Ouvrez le fichier `supabase-init-projects-complete.sql` de ce projet
6. Copiez TOUT le contenu du fichier
7. Collez dans l'éditeur SQL de Supabase
8. Cliquez sur **Run** (ou Ctrl+Enter)
9. Vérifiez les messages de confirmation

**Résultat attendu :**
```
✅ Initialisation terminée avec succès !
📊 Table "projects" créée et configurée
🔐 Row Level Security activé
⚡ Index de performance créés
🔄 Trigger updated_at configuré
```

- [ ] Script SQL exécuté avec succès
- [ ] Messages de confirmation affichés

---

### 3️⃣ Vérifier que la table existe

**Dans Supabase Dashboard :**

1. Cliquez sur **Table Editor** dans le menu
2. Cherchez la table `projects` dans la liste
3. Cliquez dessus pour voir sa structure

**Colonnes à vérifier :**
- [ ] `id` (UUID)
- [ ] `title` (VARCHAR)
- [ ] `description` (TEXT)
- [ ] `image` (VARCHAR)
- [ ] `type` (VARCHAR)
- [ ] `status` (VARCHAR)
- [ ] `created_at` (TIMESTAMP)
- [ ] `updated_at` (TIMESTAMP)

---

### 4️⃣ Tester depuis l'interface Admin

1. **Se connecter à l'admin**
   - URL : Ouvrez `admin/index.html` dans votre navigateur
   - Email : `admin@gal-lubumbashi.com`
   - Mot de passe : `Admin123!`

2. **Tester les Chantiers**
   - [ ] Cliquer sur **🏗️ Chantiers** dans le menu
   - [ ] Cliquer sur **➕ Ajouter un chantier**
   - [ ] Remplir le formulaire :
     ```
     Titre: Test Chantier 1
     Description: Ceci est un test
     Image: https://images.unsplash.com/photo-1541888946425-d81bb19240f5
     Statut: Actif
     ```
   - [ ] Cliquer sur **Enregistrer**
   - [ ] Vérifier que le chantier apparaît dans la liste
   - [ ] Modifier le chantier (icône ✏️)
   - [ ] Supprimer le chantier (icône 🗑️)

3. **Tester les Conceptions**
   - [ ] Cliquer sur **📐 Conceptions** dans le menu
   - [ ] Cliquer sur **➕ Ajouter une conception**
   - [ ] Remplir le formulaire :
     ```
     Titre: Test Conception 1
     Description: Ceci est un test
     Image: https://images.unsplash.com/photo-1503387762-592deb58ef4e
     Statut: Actif
     ```
   - [ ] Cliquer sur **Enregistrer**
   - [ ] Vérifier que la conception apparaît dans la liste
   - [ ] Modifier la conception (icône ✏️)
   - [ ] Supprimer la conception (icône 🗑️)

---

### 5️⃣ Exécuter les tests automatiques

**Méthode 1 : Via la console du navigateur**

1. Ouvrez votre site web
2. Appuyez sur F12 pour ouvrir la console
3. Copiez et collez ce code :

```javascript
import('./js/test-projects-storage.js').then(module => {
    module.runTests();
});
```

4. Appuyez sur Entrée
5. Observez les résultats des tests

**Résultat attendu :**
- [ ] Tous les tests affichent ✅
- [ ] Aucun test n'affiche ❌

**Méthode 2 : Utiliser le fichier de test directement**

Ouvrez le fichier `js/test-projects-storage.js` et suivez les instructions en haut.

---

### 6️⃣ Vérifier dans Supabase

1. Retournez dans **Table Editor** → **projects**
2. Vérifiez que vous voyez les projets créés
3. Cliquez sur une ligne pour voir tous les détails
4. Vérifiez que `created_at` et `updated_at` sont correctement remplis

- [ ] Les projets sont visibles dans Supabase
- [ ] Les dates sont correctes
- [ ] Le champ `type` contient 'chantiers' ou 'conceptions'

---

### 7️⃣ Ajouter des données de démonstration (Optionnel)

Si vous voulez ajouter des exemples de projets :

1. Dans Supabase **SQL Editor**
2. Créez une nouvelle requête
3. Décommentez la section "DONNÉES DE DÉMONSTRATION" dans le fichier `supabase-init-projects-complete.sql`
4. Copiez uniquement la partie des INSERT INTO
5. Exécutez

- [ ] Données de démonstration ajoutées (si souhaité)

---

### 8️⃣ Configurer la sécurité (Optionnel mais recommandé pour production)

**Actuellement** : Accès public complet (OK pour développement)

**Pour la production**, considérez de restreindre l'accès en écriture :

1. Dans Supabase, allez dans **Authentication** → **Policies**
2. Trouvez la table `projects`
3. Modifiez les politiques selon vos besoins
4. Voir le fichier `INITIALISATION_CHANTIERS_CONCEPTIONS.md` section "Étape 4"

- [ ] Politiques de sécurité examinées
- [ ] Sécurité renforcée si nécessaire

---

## 🎯 Validation finale

Cochez toutes les cases ci-dessous pour confirmer que tout fonctionne :

- [ ] La table `projects` existe dans Supabase
- [ ] Je peux créer un chantier depuis l'admin
- [ ] Je peux créer une conception depuis l'admin
- [ ] Les projets apparaissent dans la liste admin
- [ ] Je peux modifier un projet
- [ ] Je peux supprimer un projet
- [ ] Les données persistent après rechargement de la page
- [ ] Les données sont visibles dans Supabase Table Editor
- [ ] Le champ `updated_at` se met à jour automatiquement lors d'une modification
- [ ] Les tests automatiques passent tous ✅

---

## 🐛 En cas de problème

### Erreur "relation projects does not exist"
➡️ La table n'a pas été créée → Retournez à l'étape 2️⃣

### Erreur "permission denied"
➡️ Problème de politiques RLS → Vérifiez l'étape 8️⃣

### Les projets ne s'affichent pas dans l'admin
➡️ Ouvrez la console (F12) et cherchez les erreurs  
➡️ Vérifiez que Supabase est bien configuré dans `js/supabase-init.js`

### Erreur lors de la création
➡️ Vérifiez que tous les champs sont remplis  
➡️ L'URL de l'image doit commencer par http:// ou https://

---

## 📚 Documentation complète

Pour plus de détails, consultez :

- 📖 [INITIALISATION_CHANTIERS_CONCEPTIONS.md](./INITIALISATION_CHANTIERS_CONCEPTIONS.md) - Guide complet détaillé
- 📖 [GUIDE_CHANTIERS_CONCEPTIONS.md](./GUIDE_CHANTIERS_CONCEPTIONS.md) - Guide d'utilisation
- 📖 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Configuration générale Supabase
- 🔧 [supabase-init-projects-complete.sql](./supabase-init-projects-complete.sql) - Script SQL complet
- 🧪 [js/test-projects-storage.js](./js/test-projects-storage.js) - Tests automatiques

---

## ✅ Confirmation d'initialisation

Une fois toutes les étapes complétées, signez ci-dessous :

```
Initialisé par : _____________________
Date : _____________________
Statut : ☐ Développement  ☐ Production

Notes :
_________________________________________________
_________________________________________________
_________________________________________________
```

---

**Date de création** : 2 décembre 2024  
**Version** : 1.0
