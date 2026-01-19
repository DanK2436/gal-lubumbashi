# 📋 Système Administration & Membres - GAL

## 🎯 Vue d'ensemble

Le site GAL dispose de **3 espaces distincts** :

### 1. 🌐 **Espace Public**
- Pages accessibles à tous les visiteurs
- Navigation : Accueil, Vidéos, Formations, Machines, Blog, À propos, Contact
- Logo GAL officiel : `/public/logo-gal-official.jpg`

### 2. 👥 **Espace Membres**
- Accès : `/membres/index.html` (page de connexion/inscription)
- Dashboard : `/membres/pages/dashboard.html`
- Pages disponibles :
  - 📊 Tableau de bord
  - 🏗️ Chantiers
  - 📐 Conceptions
  - 📢 Annonces
  - 💬 Messages

### 3. ⚙️ **Espace Admin**
- Accès : `/admin/login.html`
- Panel : `/admin/index.html`
- Sections disponibles :
  - 📊 Dashboard
  - 🎬 Vidéos
  - 📚 Formations
  - 🛠️ Machines
  - 📝 Blog
  - 📧 Newsletter
  - ✉️ Contacts
  - 👥 Membres

---

## 🔐 Authentification

### Membres
**Fichier** : `/js/auth.js`

**Fonctions principales** :
- `register(name, email, phone, password)` - Inscription
- `login(email, password)` - Connexion
- `logout()` - Déconnexion
- `getCurrentMember()` - Obtenir le membre connecté
- `isAuthenticated()` - Vérifier l'authentification

**Stockage** : `localStorage.getItem('gal_members')`

### Admin
**Fichier** : `/js/pages/admin.js`

**Stockage** : `localStorage.getItem('gal_admin_session')`

---

## 📊 Gestion du Contenu (Admin)

### Vidéos
**Fichier** : `/js/admin.js` - `loadVideosManager()`
- ✅ Ajouter une vidéo
- ✅ Modifier une vidéo
- ✅ Supprimer une vidéo
- **Stockage** : `localStorage.getItem('gal_videos')`

### Formations
**Fichier** : `/js/admin.js` - `loadFormationsManager()`
- ✅ Ajouter une formation
- ✅ Modifier une formation
- ✅ Supprimer une formation
- **Stockage** : `localStorage.getItem('gal_formations')`

### Machines
**Fichier** : `/js/admin.js` - `loadMachinesManager()`
- ✅ Ajouter une machine
- ✅ Modifier une machine
- ✅ Supprimer une machine
- **Stockage** : `localStorage.getItem('gal_machines')`

### Blog
**Fichier** : `/js/admin.js` - `loadBlogManager()`
- ✅ Ajouter un article
- ✅ Modifier un article
- ✅ Supprimer un article
- **Stockage** : `localStorage.getItem('gal_blog_posts')`

---

## 👥 Gestion des Membres (Admin)

**Fichier** : `/js/pages/admin-membres.js`

### Fonctionnalités disponibles

#### 📝 CRUD Membres
- ✅ **Ajouter** un nouveau membre
  - Fonction : `window.adminMembres.showAddMemberModal()`
  - Champs : nom, email, téléphone, mot de passe

- ✅ **Modifier** un membre existant
  - Fonction : `window.adminMembres.editMember(id)`

- ✅ **Supprimer** un membre
  - Fonction : `window.adminMembres.deleteMember(id)`
  - Confirmation requise

#### 💬 Messagerie

##### 1️⃣ Message individuel
- Fonction : `window.adminMembres.showMessageModal(memberId)`
- Types de messages :
  - `conception` - Conception
  - `chantier` - Chantier
  - `general` - Message général
- Champs : Type, Sujet, Message
- Bouton d'action : 💬 sur chaque membre

##### 2️⃣ Annonce générale
- Fonction : `window.adminMembres.sendAnnouncement()`
- Envoi à **TOUS les membres** en une seule fois
- Champs : Sujet, Message
- Bouton : "📢 Envoyer une annonce"

**Stockage des messages** : 
```javascript
localStorage.getItem('gal_member_messages')
```

**Format des messages** :
```javascript
{
  memberId: "12345",           // ID du destinataire (ou absent pour annonces)
  type: "conception",          // Type de message
  subject: "Nouveau projet",   // Sujet
  message: "Contenu...",       // Message
  sentAt: "2025-11-26T...",   // Date d'envoi
  read: false                  // Statut de lecture
}
```

**Annonces** :
```javascript
{
  type: "announcement",        // Type spécial
  subject: "Titre annonce",   
  message: "Contenu...",      
  sentAt: "2025-11-26T...",   
  recipients: ["id1", "id2"]   // Liste des IDs destinataires
}
```

#### 🔍 Filtrage & Recherche
- ✅ Recherche par texte (nom, email, téléphone)
  - Fonction : `window.adminMembres.filterMembers(query)`

- ✅ Filtrage par statut
  - Tous les membres
  - Nouveaux membres (7 derniers jours)
  - Membres actifs
  - Fonction : `window.adminMembres.filterByStatus(status)`

#### 📊 Statistiques
- Nombre total de membres
- Nouveaux membres (7 derniers jours)
- Membres actifs

---

## 📬 Réception des Messages (Membres)

**Page** : `/membres/pages/messages.html`

### Affichage des messages
Les membres voient les messages :
1. **Messages personnels** : destinés spécifiquement à eux (filtré par `memberId`)
2. **Annonces générales** : type = `announcement` (visibles par tous)

### Filtres disponibles
- Tous les messages
- Par type : Conception, Chantier, Annonces, Général

### Compteurs
- Nombre de messages non lus
- Badge de notification dans la navigation

---

## 🎨 Design & Navigation

### Espace Admin
**Structure** :
```
┌─────────────────────────────────────────┐
│ [Logo] GAL Administration    [User] [Logout] │
├─────────────────────────────────────────┤
│ Dashboard │ Vidéos │ Formations │ ... │
├─────────────────────────────────────────┤
│                                         │
│         CONTENU PRINCIPAL               │
│                                         │
└─────────────────────────────────────────┘
```

- **Header** : Logo à gauche, infos utilisateur à droite
- **Navigation** : Horizontale, au même niveau
- **Contenu** : Zone principale en dessous

### Espace Membre
**Structure** : Identique à l'admin
```
┌─────────────────────────────────────────┐
│ [Logo] Espace Membres    [Avatar] [Logout] │
├─────────────────────────────────────────┤
│ Dashboard │ Chantiers │ Conceptions │ ... │
├─────────────────────────────────────────┤
│                                         │
│         CONTENU PRINCIPAL               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 Flux de Travail

### Scénario 1 : Admin envoie un message à un membre
1. Admin se connecte à `/admin/index.html`
2. Clique sur "👥 Membres"
3. Dans le tableau, clique sur 💬 à côté d'un membre
4. Remplit le formulaire (Type, Sujet, Message)
5. Clique sur "Envoyer"
6. ✅ Message sauvegardé dans `gal_member_messages`

### Scénario 2 : Membre reçoit et lit le message
1. Membre se connecte à `/membres/index.html`
2. Voit un badge de notification sur "💬 Messages"
3. Clique sur "Messages"
4. Voit la liste de ses messages
5. Clique sur un message pour le lire
6. ✅ Message marqué comme lu

### Scénario 3 : Admin envoie une annonce générale
1. Admin dans la section "👥 Membres"
2. Clique sur "📢 Envoyer une annonce"
3. Remplit Sujet et Message
4. Clique sur "Envoyer l'annonce"
5. ✅ Annonce envoyée à TOUS les membres
6. Tous les membres la voient dans leur espace Messages

---

## 📁 Structure des Fichiers

```
GAL_Web/
├── admin/
│   ├── index.html              # Panel admin
│   └── login.html              # Connexion admin
├── membres/
│   ├── index.html              # Connexion/Inscription membre
│   ├── js/
│   │   └── auth.js             # Authentification membre
│   └── pages/
│       ├── dashboard.html      # Tableau de bord membre
│       ├── chantiers.html      # Chantiers
│       ├── conceptions.html    # Conceptions
│       ├── annonces.html       # Annonces
│       └── messages.html       # 💬 Messages des membres
├── js/
│   ├── admin.js                # Gestion contenu (vidéos, formations, etc.)
│   ├── auth.js                 # Auth membres
│   ├── storage.js              # Gestion localStorage
│   └── pages/
│       ├── admin.js            # Logique panel admin
│       └── admin-membres.js    # 👥 Gestion membres + messagerie
└── public/
    └── logo-gal-official.jpg   # Logo officiel
```

---

## ✅ Checklist Fonctionnalités

### Admin peut :
- ✅ Ajouter/modifier/supprimer des vidéos
- ✅ Ajouter/modifier/supprimer des formations
- ✅ Ajouter/modifier/supprimer des machines
- ✅ Ajouter/modifier/supprimer des articles de blog
- ✅ Voir les abonnés newsletter
- ✅ Voir les messages de contact
- ✅ Gérer les membres (CRUD complet)
- ✅ Envoyer des messages individuels aux membres
- ✅ Envoyer des annonces à tous les membres
- ✅ Filtrer et rechercher des membres

### Membres peuvent :
- ✅ S'inscrire
- ✅ Se connecter / Se déconnecter
- ✅ Voir leur tableau de bord
- ✅ Accéder aux chantiers
- ✅ Accéder aux conceptions
- ✅ Voir les annonces
- ✅ Recevoir et lire des messages de l'admin
- ✅ Voir les annonces générales
- ✅ Filtrer leurs messages par type

---

## 🚀 Prochaines Étapes (Optionnelles)

### Améliorations possibles :
1. ✨ Notifications en temps réel (WebSocket)
2. 📎 Pièces jointes dans les messages
3. 🔔 Alertes push pour nouveaux messages
4. 📊 Statistiques d'engagement des membres
5. 🎯 Ciblage avancé pour les annonces
6. 💾 Export des données (CSV, PDF)
7. 🔒 Rôles et permissions granulaires

---

## 📞 Support

Pour toute question ou problème :
- Vérifier les fichiers JavaScript dans `/js/`
- Console navigateur (F12) pour les erreurs
- LocalStorage dans DevTools Application

**Dernière mise à jour** : 26 novembre 2025
