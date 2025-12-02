# ⚡ Configuration Rapide - Supabase GAL

## 🎯 Problème
Impossible d'ajouter des vidéos, formations, machines et articles même en local.

## ✅ Solution en 3 étapes

### 1️⃣ Exécuter le script SQL

1. Ouvrez [Supabase Dashboard](https://supabase.com/dashboard)
2. Votre projet → **SQL Editor** → **+ New Query**
3. Copiez **TOUT** le contenu de `supabase-gal-complete.sql`
4. Collez et cliquez **RUN** (ou Ctrl+Enter)

### 2️⃣ Vérifier la configuration

Exécutez cette requête pour vérifier :
```sql
SELECT * FROM gal_tables_summary;
```

Vous devriez voir 14 tables listées.

### 3️⃣ Tester l'ajout de contenu

1. Allez sur `/admin/index.html`
2. Connectez-vous :
   - Email: `admin@gal-lubumbashi.com`
   - Password: `Admin123!`
3. Testez d'ajouter :
   - Une vidéo (section "Vidéos")
   - Une formation (section "Formations")
   - Une machine (section "Machines")
   - Un article (section "Blog")

---

## 📦 Ce qui est créé

Le script crée et configure automatiquement :

- ✅ **14 tables** avec les bonnes structures
- ✅ **Politiques RLS** pour l'accès public
- ✅ **Index de performance**
- ✅ **Triggers automatiques** pour updated_at
- ✅ **Vue de résumé** pour monitoring

---

## 🔧 Tables principales

| Table | Description | Champs clés |
|-------|-------------|-------------|
| `videos` | Vidéos YouTube/autres | title, category, url, thumbnail, durationSeconds |
| `formations` | Formations professionnelles | title, level, duration, price, modules (array) |
| `machines` | Catalogue machines | name, category, status, priceRange, specs (JSON) |
| `blog_posts` | Articles de blog | title, slug, content, author, category, tags (array) |

---

## ❗ Points importants

### Structure des données

**Vidéos** - `durationSeconds` en entier (secondes)
```javascript
{
  title: "Ma vidéo",
  category: "Électricité",
  url: "https://youtube.com/...",
  thumbnail: "https://...",
  durationSeconds: 480  // 8 minutes
}
```

**Formations** - `modules` en array
```javascript
{
  title: "Soudure TIG",
  level: "Intermédiaire",
  duration: "4 semaines",
  price: "200 USD",
  modules: ["Module 1", "Module 2", "Module 3"]
}
```

**Machines** - `specs` en JSON
```javascript
{
  name: "Batteuse à maïs",
  category: "Agroalimentaire",
  status: "Disponible",
  priceRange: "1500-2000 USD",
  specs: [
    {"label": "Capacité", "value": "500 kg/h"},
    {"label": "Moteur", "value": "5.5 HP"}
  ]
}
```

**Blog** - `tags` en array
```javascript
{
  title: "Mon article",
  slug: "mon-article",  // généré auto
  content: "Contenu complet...",
  excerpt: "Résumé court...",
  author: "Jean Doe",
  category: "Tutoriels",
  tags: ["soudure", "débutant", "sécurité"]
}
```

---

## 🧪 Test rapide

```sql
-- Vérifier que tout fonctionne
SELECT 
  'videos' as table_name, COUNT(*) 
FROM videos
UNION ALL
SELECT 'formations', COUNT(*) FROM formations
UNION ALL 
SELECT 'machines', COUNT(*) FROM machines
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts;
```

---

## 🔌 Vérification connexion Supabase

Dans `js/supabase-init.js`, assurez-vous d'avoir :

```javascript
const supabaseConfig = {
    url: "https://votre-projet.supabase.co",  // ✅ Votre URL
    anonKey: "eyJhbGc..."  // ✅ Votre clé anon
};
```

Trouvez ces valeurs dans :
**Supabase Dashboard** → **Settings** → **API**

---

## ❌ Dépannage rapide

### Erreur : "relation videos does not exist"
➜ Le script SQL n'a pas été exécuté. Réexécutez-le.

### Erreur : "column durationSeconds does not exist"
➜ Mauvaise structure de table. Supprimez et recréez :
```sql
DROP TABLE IF EXISTS videos CASCADE;
-- Puis réexécutez tout le script
```

### Erreur : "new row violates row-level security policy"
➜ Les politiques RLS ne sont pas correctes. Réexécutez le script.

### Rien ne s'affiche dans l'admin
➜ Ouvrez la console (F12), regardez les erreurs JavaScript

---

## ✅ Checklist

- [ ] Script SQL exécuté sans erreur
- [ ] `SELECT * FROM gal_tables_summary;` fonctionne
- [ ] Clés Supabase dans `js/supabase-init.js`
- [ ] Connexion admin réussie
- [ ] Ajout vidéo ✓
- [ ] Ajout formation ✓
- [ ] Ajout machine ✓
- [ ] Ajout article ✓

---

## 📚 Documentation complète

Pour plus de détails, consultez `CONFIGURATION_SUPABASE.md`

---

**Créé le :** 2025-12-02  
**Fichier SQL :** `supabase-gal-complete.sql`
