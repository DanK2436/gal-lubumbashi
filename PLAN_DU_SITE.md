<<<<<<< HEAD
# 🗺️ Plan du Site GAL - URLs importantes

## 🏠 Pages Publiques

### Pages principales
| Page | URL | Description |
|------|-----|-------------|
| 🏠 Accueil | `/index.html` | Page d'accueil du site |
| 🎬 Vidéos | `/html/videos.html` | Bibliothèque de vidéos tutoriels |
| 📚 Formations | `/html/formations.html` | Catalogue des formations + inscriptions |
| 🛠️ Machines | `/html/machines.html` | Catalogue machines + réservations |
| 📝 Blog | `/html/blog.html` | Articles et actualités |
| 👥 À propos | `/html/about.html` | Présentation de GAL |
| ✉️ Contact | `/html/contact.html` | Formulaire de contact |
| ❓ FAQ | `/html/faq.html` | Questions fréquentes |
| 🔒 Confidentialité | `/html/privacy.html` | Politique de confidentialité |

---

## 🔐 Espace Administrateur

### Admin - Connexion
- **URL** : `/admin/login.html`
- **Credentials** :
  - Email : `admin@gal-lubumbashi.com`
  - Mot de passe : `Admin123!`

### Admin - Dashboard
| Section | Hash URL | Fonction |
|---------|----------|----------|
| 📊 Dashboard | `/admin/#dashboard` | Vue d'ensemble, statistiques |
| 🎬 Vidéos | `/admin/#videos` | Gérer les vidéos |
| 📚 Formations | `/admin/#formations` | Gérer les formations |
| 🛠️ Machines | `/admin/#machines` | Gérer les machines |
| 📝 Blog | `/admin/#blog` | Gérer les articles |
| 🎓 Inscriptions | `/admin/#inscriptions-formations` | Gérer les demandes de formation |
| 📅 Réservations | `/admin/#reservations` | Gérer les réservations machines |
| 📧 Newsletter | `/admin/#newsletter` | Liste des abonnés |
| ✉️ Contacts | `/admin/#contacts` | Messages de contact |
| 💬 Messages | `/admin/#messages` | Messages privés membres |
| 📢 Annonces | `/admin/#annonces` | Annonces générales |
| 👥 Membres | `/admin/#membres` | Gestion des membres |
| 🏗️ Chantiers | `/admin/#chantiers` | Gestion des chantiers |
| 📐 Conceptions | `/admin/#conceptions` | Gestion des conceptions |

---

## 👤 Espace Membre

### Membre - Connexion
- **URL** : `/membres/login.html`
- **Inscription** : Via admin (création de compte)

### Membre - Dashboard
| Page | URL | Fonction |
|------|-----|----------|
| 📊 Dashboard | `/membres/dashboard.html` | Vue d'ensemble membre |
| 🏗️ Chantiers | `/membres/chantiers.html` | Liste des chantiers |
| 📐 Conceptions | `/membres/conceptions.html` | Liste des conceptions |
| 💬 Messages | `/membres/messages.html` | Messages privés |
| 📢 Annonces | `/membres/annonces.html` | Annonces générales |

---

## 📁 Structure des fichiers clés

### Configuration
```
js/
├── supabase-init.js      ← CONFIGURATION SUPABASE (À MODIFIER)
├── storage.js            ← Fonctions de base de données
├── supabase-service.js   ← Service Supabase
└── admin.js              ← Logique admin CRUD
```

### Pages Admin
```
admin/
├── login.html            ← Connexion admin
└── index.html            ← Dashboard admin
```

### Pages Publiques
```
html/
├── videos.html           ← Page vidéos
├── formations.html       ← Page formations
├── machines.html         ← Page machines
├── blog.html             ← Page blog
└── contact.html          ← Formulaire contact
```

### Scripts de pages
```
js/pages/
├── admin.js              ← Navigation admin
├── videos.js             ← Logique page vidéos
├── formations.js         ← Logique page formations
├── machines.js           ← Logique page machines
├── blog.js               ← Logique page blog
└── home.js               ← Logique page d'accueil
```

---

## 🗄️ Base de données Supabase

### Tables principales
| Table | Description | Exemple d'utilisation |
|-------|-------------|----------------------|
| `videos` | Stocke les vidéos | Ajout via Admin > Vidéos |
| `formations` | Catalogue formations | Admin > Formations |
| `machines` | Catalogue machines | Admin > Machines |
| `blog_posts` | Articles de blog | Admin > Blog |
| `newsletter_subscribers` | Abonnés newsletter | Inscription sur le site |
| `contact_messages` | Messages contact | Formulaire de contact |
| `formation_reservations` | Inscriptions formations | Page formations publique |
| `machine_reservations` | Réservations machines | Page machines publique |
| `members` | Comptes membres | Admin > Membres |
| `projects` | Chantiers & conceptions | Admin > Chantiers/Conceptions |
| `messages` | Messages privés | Admin > Messages |
| `announcements` | Annonces générales | Admin > Annonces |

---

## 🔄 Flux de données

### Ajout de contenu (Admin → Public)

```
1. Admin se connecte
      ↓
2. Admin > [Section] > "+ Ajouter"
      ↓
3. Formulaire rempli + Enregistrer
      ↓
4. Donnée enregistrée dans Supabase
      ↓
5. ✅ Contenu visible instantanément sur la page publique
```

### Réservation/Inscription (Public → Admin)

```
1. Visiteur sur page publique (formations/machines)
      ↓
2. Clic "Réserver"
      ↓
3. Formulaire rempli + Confirmer
      ↓
4. Donnée enregistrée dans Supabase
      ↓
5. ✅ Admin voit la demande dans son dashboard
```

---

## 📊 Navigation rapide - Raccourcis

### Pour tester rapidement

1. **Page vidéos** : `/html/videos.html`
2. **Ajouter vidéo** : `/admin/#videos` → Cliquer "+ Ajouter une vidéo"
3. **Voir formations** : `/html/formations.html`
4. **Gérer inscriptions** : `/admin/#inscriptions-formations`
5. **Dashboard admin** : `/admin/#dashboard`

### Workflow complet test

```bash
1. Configuration initiale
   → Modifier js/supabase-init.js
   → Exécuter supabase-setup-complete.sql

2. Connexion admin
   → /admin/login.html
   → admin@gal-lubumbashi.com / Admin123!

3. Ajouter contenu de test
   → Admin > Vidéos > + Ajouter
   → Admin > Formations > + Ajouter
   → Admin > Machines > + Ajouter
   → Admin > Blog > + Ajouter

4. Vérifier pages publiques
   → /html/videos.html ✅
   → /html/formations.html ✅
   → /html/machines.html ✅
   → /html/blog.html ✅
```

---

## 📱 URLs de développement vs Production

### Développement local
```
http://localhost:3000/admin/
http://localhost:3000/html/videos.html
```

### Production GitHub Pages
```
https://VOTRE_USERNAME.github.io/REPO_NAME/admin/
https://VOTRE_USERNAME.github.io/REPO_NAME/html/videos.html
```

---

## 🎯 Points d'entrée principaux

### Pour l'administrateur
1. **Connexion** : `/admin/login.html`
2. **Gestion quotidienne** : `/admin/#dashboard`
3. **Ajout rapide vidéo** : `/admin/#videos`

### Pour les visiteurs
1. **Découvrir** : `/index.html`
2. **Apprendre** : `/html/videos.html`
3. **Se former** : `/html/formations.html`
4. **Louer matériel** : `/html/machines.html`
5. **S'informer** : `/html/blog.html`

### Pour les membres
1. **Connexion** : `/membres/login.html`
2. **Tableau de bord** : `/membres/dashboard.html`
3. **Voir projets** : `/membres/chantiers.html`

---

## 🔑 Informations de connexion par défaut

### Admin
```
URL      : /admin/login.html
Email    : admin@gal-lubumbashi.com
Password : Admin123!
```

### Membre (après création via admin)
```
URL      : /membres/login.html
Email    : (défini lors de la création)
Password : (défini lors de la création)
```

---

## 📋 Checklist de mise en production

- [ ] Configuration Supabase complète (`js/supabase-init.js`)
- [ ] Script SQL exécuté (`supabase-setup-complete.sql`)
- [ ] Test de toutes les pages publiques
- [ ] Test de l'interface admin
- [ ] Ajout d'au moins 3 vidéos
- [ ] Ajout d'au moins 2 formations
- [ ] Ajout d'au moins 2 machines
- [ ] Publication d'au moins 1 article
- [ ] Test du formulaire de contact
- [ ] Test de l'inscription newsletter
- [ ] Test de la réservation formation
- [ ] Test de la réservation machine
- [ ] Vérification responsive (mobile/tablet)
- [ ] Changement du mot de passe admin (recommandé)

---

**Document créé le : 2 décembre 2025**  
**Version : 1.0**  
**Site : GAL - Groupement des Artisans de Lubumbashi**
=======
# 🗺️ Plan du Site GAL - URLs importantes

## 🏠 Pages Publiques

### Pages principales
| Page | URL | Description |
|------|-----|-------------|
| 🏠 Accueil | `/index.html` | Page d'accueil du site |
| 🎬 Vidéos | `/html/videos.html` | Bibliothèque de vidéos tutoriels |
| 📚 Formations | `/html/formations.html` | Catalogue des formations + inscriptions |
| 🛠️ Machines | `/html/machines.html` | Catalogue machines + réservations |
| 📝 Blog | `/html/blog.html` | Articles et actualités |
| 👥 À propos | `/html/about.html` | Présentation de GAL |
| ✉️ Contact | `/html/contact.html` | Formulaire de contact |
| ❓ FAQ | `/html/faq.html` | Questions fréquentes |
| 🔒 Confidentialité | `/html/privacy.html` | Politique de confidentialité |

---

## 🔐 Espace Administrateur

### Admin - Connexion
- **URL** : `/admin/login.html`
- **Credentials** :
  - Email : `admin@gal-lubumbashi.com`
  - Mot de passe : `Admin123!`

### Admin - Dashboard
| Section | Hash URL | Fonction |
|---------|----------|----------|
| 📊 Dashboard | `/admin/#dashboard` | Vue d'ensemble, statistiques |
| 🎬 Vidéos | `/admin/#videos` | Gérer les vidéos |
| 📚 Formations | `/admin/#formations` | Gérer les formations |
| 🛠️ Machines | `/admin/#machines` | Gérer les machines |
| 📝 Blog | `/admin/#blog` | Gérer les articles |
| 🎓 Inscriptions | `/admin/#inscriptions-formations` | Gérer les demandes de formation |
| 📅 Réservations | `/admin/#reservations` | Gérer les réservations machines |
| 📧 Newsletter | `/admin/#newsletter` | Liste des abonnés |
| ✉️ Contacts | `/admin/#contacts` | Messages de contact |
| 💬 Messages | `/admin/#messages` | Messages privés membres |
| 📢 Annonces | `/admin/#annonces` | Annonces générales |
| 👥 Membres | `/admin/#membres` | Gestion des membres |
| 🏗️ Chantiers | `/admin/#chantiers` | Gestion des chantiers |
| 📐 Conceptions | `/admin/#conceptions` | Gestion des conceptions |

---

## 👤 Espace Membre

### Membre - Connexion
- **URL** : `/membres/login.html`
- **Inscription** : Via admin (création de compte)

### Membre - Dashboard
| Page | URL | Fonction |
|------|-----|----------|
| 📊 Dashboard | `/membres/dashboard.html` | Vue d'ensemble membre |
| 🏗️ Chantiers | `/membres/chantiers.html` | Liste des chantiers |
| 📐 Conceptions | `/membres/conceptions.html` | Liste des conceptions |
| 💬 Messages | `/membres/messages.html` | Messages privés |
| 📢 Annonces | `/membres/annonces.html` | Annonces générales |

---

## 📁 Structure des fichiers clés

### Configuration
```
js/
├── supabase-init.js      ← CONFIGURATION SUPABASE (À MODIFIER)
├── storage.js            ← Fonctions de base de données
├── supabase-service.js   ← Service Supabase
└── admin.js              ← Logique admin CRUD
```

### Pages Admin
```
admin/
├── login.html            ← Connexion admin
└── index.html            ← Dashboard admin
```

### Pages Publiques
```
html/
├── videos.html           ← Page vidéos
├── formations.html       ← Page formations
├── machines.html         ← Page machines
├── blog.html             ← Page blog
└── contact.html          ← Formulaire contact
```

### Scripts de pages
```
js/pages/
├── admin.js              ← Navigation admin
├── videos.js             ← Logique page vidéos
├── formations.js         ← Logique page formations
├── machines.js           ← Logique page machines
├── blog.js               ← Logique page blog
└── home.js               ← Logique page d'accueil
```

---

## 🗄️ Base de données Supabase

### Tables principales
| Table | Description | Exemple d'utilisation |
|-------|-------------|----------------------|
| `videos` | Stocke les vidéos | Ajout via Admin > Vidéos |
| `formations` | Catalogue formations | Admin > Formations |
| `machines` | Catalogue machines | Admin > Machines |
| `blog_posts` | Articles de blog | Admin > Blog |
| `newsletter_subscribers` | Abonnés newsletter | Inscription sur le site |
| `contact_messages` | Messages contact | Formulaire de contact |
| `formation_reservations` | Inscriptions formations | Page formations publique |
| `machine_reservations` | Réservations machines | Page machines publique |
| `members` | Comptes membres | Admin > Membres |
| `projects` | Chantiers & conceptions | Admin > Chantiers/Conceptions |
| `messages` | Messages privés | Admin > Messages |
| `announcements` | Annonces générales | Admin > Annonces |

---

## 🔄 Flux de données

### Ajout de contenu (Admin → Public)

```
1. Admin se connecte
      ↓
2. Admin > [Section] > "+ Ajouter"
      ↓
3. Formulaire rempli + Enregistrer
      ↓
4. Donnée enregistrée dans Supabase
      ↓
5. ✅ Contenu visible instantanément sur la page publique
```

### Réservation/Inscription (Public → Admin)

```
1. Visiteur sur page publique (formations/machines)
      ↓
2. Clic "Réserver"
      ↓
3. Formulaire rempli + Confirmer
      ↓
4. Donnée enregistrée dans Supabase
      ↓
5. ✅ Admin voit la demande dans son dashboard
```

---

## 📊 Navigation rapide - Raccourcis

### Pour tester rapidement

1. **Page vidéos** : `/html/videos.html`
2. **Ajouter vidéo** : `/admin/#videos` → Cliquer "+ Ajouter une vidéo"
3. **Voir formations** : `/html/formations.html`
4. **Gérer inscriptions** : `/admin/#inscriptions-formations`
5. **Dashboard admin** : `/admin/#dashboard`

### Workflow complet test

```bash
1. Configuration initiale
   → Modifier js/supabase-init.js
   → Exécuter supabase-setup-complete.sql

2. Connexion admin
   → /admin/login.html
   → admin@gal-lubumbashi.com / Admin123!

3. Ajouter contenu de test
   → Admin > Vidéos > + Ajouter
   → Admin > Formations > + Ajouter
   → Admin > Machines > + Ajouter
   → Admin > Blog > + Ajouter

4. Vérifier pages publiques
   → /html/videos.html ✅
   → /html/formations.html ✅
   → /html/machines.html ✅
   → /html/blog.html ✅
```

---

## 📱 URLs de développement vs Production

### Développement local
```
http://localhost:3000/admin/
http://localhost:3000/html/videos.html
```

### Production GitHub Pages
```
https://VOTRE_USERNAME.github.io/REPO_NAME/admin/
https://VOTRE_USERNAME.github.io/REPO_NAME/html/videos.html
```

---

## 🎯 Points d'entrée principaux

### Pour l'administrateur
1. **Connexion** : `/admin/login.html`
2. **Gestion quotidienne** : `/admin/#dashboard`
3. **Ajout rapide vidéo** : `/admin/#videos`

### Pour les visiteurs
1. **Découvrir** : `/index.html`
2. **Apprendre** : `/html/videos.html`
3. **Se former** : `/html/formations.html`
4. **Louer matériel** : `/html/machines.html`
5. **S'informer** : `/html/blog.html`

### Pour les membres
1. **Connexion** : `/membres/login.html`
2. **Tableau de bord** : `/membres/dashboard.html`
3. **Voir projets** : `/membres/chantiers.html`

---

## 🔑 Informations de connexion par défaut

### Admin
```
URL      : /admin/login.html
Email    : admin@gal-lubumbashi.com
Password : Admin123!
```

### Membre (après création via admin)
```
URL      : /membres/login.html
Email    : (défini lors de la création)
Password : (défini lors de la création)
```

---

## 📋 Checklist de mise en production

- [ ] Configuration Supabase complète (`js/supabase-init.js`)
- [ ] Script SQL exécuté (`supabase-setup-complete.sql`)
- [ ] Test de toutes les pages publiques
- [ ] Test de l'interface admin
- [ ] Ajout d'au moins 3 vidéos
- [ ] Ajout d'au moins 2 formations
- [ ] Ajout d'au moins 2 machines
- [ ] Publication d'au moins 1 article
- [ ] Test du formulaire de contact
- [ ] Test de l'inscription newsletter
- [ ] Test de la réservation formation
- [ ] Test de la réservation machine
- [ ] Vérification responsive (mobile/tablet)
- [ ] Changement du mot de passe admin (recommandé)

---

**Document créé le : 2 décembre 2025**  
**Version : 1.0**  
**Site : GAL - Groupement des Artisans de Lubumbashi**
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
