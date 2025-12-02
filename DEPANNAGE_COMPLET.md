# 🔧 GUIDE DE DÉPANNAGE COMPLET - Ajout Vidéos, Formations, Machines, Articles

## ❌ Problème Actuel
- Les boutons d'ajout dans l'admin ne fonctionnent pas
- Rien ne s'enregistre dans Supabase
- Le script SQL génère des erreurs

---

## 🎯 DIAGNOSTIC EN 3 ÉTAPES

### ÉTAPE 1 : Vérifier ce qui existe dans Supabase

**Action:** Exécutez le fichier `supabase-verification.sql` dans Supabase SQL Editor

Cela va vous montrer :
- Quelles tables existent déjà
- Quelles colonnes elles ont
- S'il y a des données

**Résultats possibles:**

#### Cas A : Les tables n'existent PAS
```
Table videos: N'EXISTE PAS
Table formations: N'EXISTE PAS
...
```
→ **Passez à l'ÉTAPE 2A**

#### Cas B : Les tables existent MAIS ont de mauvaises colonnes
```
videos existe avec colonnes:
- duration (au lieu de durationSeconds)
- ...
```
→ **Passez à l'ÉTAPE 2B**

#### Cas C : Les tables existent et sont bonnes
```
Videos: 0 enregistrements
Formations: 0 enregistrements
...
```
→ **Passez à l'ÉTAPE 3** (problème dans le code JavaScript)

---

### ÉTAPE 2A : Créer les tables (SI ELLES N'EXISTENT PAS)

Exécutez ce script dans Supabase :

```sql
-- TABLE VIDÉOS
CREATE TABLE videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail VARCHAR(500) NOT NULL,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE FORMATIONS  
CREATE TABLE formations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    level VARCHAR(50) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price VARCHAR(100) NOT NULL,
    modules TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE MACHINES
CREATE TABLE machines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Disponible',
    image VARCHAR(500) NOT NULL,
    "priceRange" VARCHAR(100),
    specs JSONB DEFAULT '[]'::jsonb,
    "defaultWhatsAppMessage" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE BLOG
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[],
    image VARCHAR(500) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ACTIVER RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- POLitIQUES D'ACCÈS
CREATE POLICY "Accès public vidéos" ON videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public formations" ON formations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public machines" ON machines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public blog" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
```

Puis passez à l'ÉTAPE 3.

---

### ÉTAPE 2B : Corriger les colonnes (SI LES TABLES EXISTENT MAIS SONT MAUVAISES)

**Si les tables existent mais ont de mauvaises colonnes**, exécutez :

```sql
-- SUPPRIMER LES ANCIENNES TABLES (⚠️ PERTE DE DONNÉES!)
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS formations CASCADE;
DROP TABLE IF EXISTS machines CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
```

Puis exécutez le script de l'ÉTAPE 2A.

---

### ÉTAPE 3 : Tester l'ajout dans Supabase directement

Ouvrez la console du navigateur (F12) pendant que vous testez l'ajout d'une vidéo.

#### Test A : Ajouter directement dans Supabase (pour vérifier que ça marche)

```sql
INSERT INTO videos (title, category, url, thumbnail, "durationSeconds") 
VALUES (
    'Test Manuel',
    'Électricité',
    'https://youtube.com/test',
    'https://via.placeholder.com/300',
    120
);

SELECT * FROM videos;
```

**Si ça marche:** Le problème est dans le code JavaScript  
**Si ça ne marche PAS:** Le problème est dans les politiques RLS

---

### ÉTAPE 4 : Vérifier les politiques RLS

```sql
-- Voir les politiques existantes
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('videos', 'formations', 'machines', 'blog_posts');
```

**Si aucune politique n'existe**, exécutez :

```sql
-- Supprimer les anciennes
DROP POLICY IF EXISTS "Accès public vidéos" ON videos;
DROP POLICY IF EXISTS "Accès public formations" ON formations;
DROP POLICY IF EXISTS "Accès public machines" ON machines;
DROP POLICY IF EXISTS "Accès public blog" ON blog_posts;

-- Créer les nouvelles
CREATE POLICY "Accès public vidéos" ON videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public formations" ON formations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public machines" ON machines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès public blog" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
```

---

## 🔍 DIAGNOSTIC JAVASCRIPT (Console Navigateur)

### 1. Ouvrir la Console

1. Allez sur `/admin/index.html`
2. Appuyez sur **F12**
3. Allez dans l'onglet **Console**

### 2. Tester l'ajout d'une vidéo

1. Cliquez sur "Vidéos" dans le menu
2. Cliquez sur "+ Ajouter une vidéo"
3. Remplissez le formulaire :
   - Titre: Test
   - Catégorie: Électricité
   - URL: https://youtube.com/test
   - Thumbnail: https://via.placeholder.com/300
   - Durée: 120
4. Cliquez sur "Enregistrer"
5. **REGARDEZ LA CONSOLE**

### 3. Erreurs possibles dans la console

#### Erreur A : "Supabase n'est pas configured configuré"
```
❌ ERREUR : Supabase n'est pas configuré !
```
**Solution :** Vérifier `js/supabase-init.js` - les clés sont-elles correctes ?

#### Erreur B : "new row violates row-level security policy"
```
Error: new row violates row-level security policy for table "videos"
```
**Solution :** Exécuter le script de politiques RLS (ÉTAPE 4 ci-dessus)

#### Erreur C : "column durationSeconds does not exist"
```
Error: column "durationSeconds" does not exist
```
**Solution :** Mauvaise structure de table. Exécuter ÉTAPE 2B (supprimer et recréer)

#### Erreur D : "null value in column"
```
Error: null value in column "..." violates not-null constraint
```
**Solution :** Un champ requis n'est pas rempli. Vérifier le formulaire.

---

## ✅ CHECKLIST DE VÉRIFICATION

Cochez au fur et à mesure :

### Supabase

- [ ] Projet Supabase créé
- [ ] URL et clé anon récupérées
- [ ] Tables `videos`, `formations`, `machines`, `blog_posts` existent
- [ ] RLS activé sur toutes les tables
- [ ] Politiques d'accès créées (FOR ALL USING true)

### Code

- [ ] Fichier `js/supabase-init.js` contient les bonnes clés
- [ ] Console navigateur ne montre pas d'erreurs
- [ ] Test d'insertion manuelle dans Supabase fonctionne

### Tests

- [ ] Ajout vidéo dans admin fonctionne
- [ ] Vidéo visible dans Table Editor Supabase
- [ ] Vidéo visible sur `/html/videos.html`
- [ ] Pareil pour formations, machines, articles

---

## 🚀 SCRIPT RAPIDE : TOUT CORRIGER D'UN COUP

Si vous voulez **tout réinitialiser et repartir de zéro** :

```sql
-- ⚠️ ATTENTION : CECI SUPPRIME TOUTES LES DONNÉES !

-- 1. SUPPRIMER TOUT
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS formations CASCADE;
DROP TABLE IF EXISTS machines CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS machine_reservations CASCADE;
DROP TABLE IF EXISTS formation_reservations CASCADE;

-- 2. CRÉER LES TABLES
-- [Copier le contenu de l'ÉTAPE 2A ici]

-- 3. VÉRIFIER
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('videos', 'formations', 'machines', 'blog_posts');
```

---

## 📞 AIDE SUPPLÉMENTAIRE

### Pour m'aider à vous aider, donnez-moi :

1. **Le résultat de** `supabase-verification.sql`
2. **Les erreurs dans la console** (F12) quand vous essayez d'ajouter
3. **Une capture d'écran** de Table Editor Supabase

Avec ces 3 éléments, je pourrai identifier le problème exact !

---

**Fichier créé le :** 2025-12-02  
**Version :** 1.0
