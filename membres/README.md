<<<<<<< HEAD
# Espace Membres GAL

## Vue d'ensemble

L'espace membres GAL est une plateforme dédiée aux membres du Groupement des Artisans de Lubumbashi. Elle permet aux membres inscrits d'accéder à des informations exclusives sur les chantiers, les conceptions et les annonces.

## Structure du dossier

```
membres/
├── index.html                  # Page de connexion/inscription
├── dashboard.html              # Tableau de bord principal
├── js/
│   ├── auth.js                # Gestion de l'authentification
│   ├── dashboard.js           # Logique du tableau de bord
│   └── pages/
│       ├── chantiers.js       # Gestion page chantiers
│       ├── conceptions.js     # Gestion page conceptions
│       └── annonces.js        # Gestion page annonces
└── pages/
    ├── chantiers.html         # Page des chantiers
    ├── conceptions.html       # Page des conceptions
    └── annonces.html          # Page des annonces
```

## Fonctionnalités

### 1. Authentification

**Inscription**
- Nom complet
- Numéro de téléphone
- Adresse email
- Mot de passe (minimum 6 caractères)
- Confirmation du mot de passe

**Connexion**
- Adresse email
- Mot de passe
- Option "Se souvenir de moi"

### 2. Tableau de bord

Le tableau de bord affiche :
- Statistiques en temps réel (chantiers, conceptions, annonces)
- Derniers chantiers publiés
- Dernières annonces
- Nouvelles conceptions

### 3. Chantiers

Page dédiée aux opportunités de chantiers :
- Liste complète des chantiers disponibles
- Filtrage par statut (actif, en attente, terminé)
- Recherche par mots-clés
- Détails complets de chaque chantier
- Possibilité de postuler directement

**Informations affichées :**
- Titre du chantier
- Description
- Localisation
- Date de début
- Budget (si disponible)
- Durée estimée
- Contact
- Statut

### 4. Conceptions

Galerie des nouvelles conceptions et projets :
- Grille visuelle des conceptions
- Filtrage par catégorie (architecture, design, prototype, autre)
- Recherche par mots-clés
- Images des projets
- Descriptions détaillées

### 5. Annonces

Centre d'information pour les membres :
- Liste chronologique des annonces
- Filtrage par priorité (haute, normale, basse)
- Messages importants de l'administration
- Notifications et alertes

**Niveaux de priorité :**
- 🔴 **Haute** : Annonces urgentes et critiques
- 🔵 **Normale** : Informations importantes
- ⚪ **Basse** : Informations générales

## Administration

L'espace membres est connecté au tableau de bord admin (`/admin`) qui permet de :
- Gérer les membres inscrits
- Publier de nouveaux chantiers
- Ajouter des conceptions
- Créer des annonces
- Modérer le contenu

## Stockage des données

**Actuellement** : Les données sont stockées dans le localStorage du navigateur pour le développement.

**Production** : Les données doivent être stockées dans une base de données (MongoDB ou PostgreSQL) via l'API backend.

### Structures de données

**Membre**
```json
{
  "id": "unique_id",
  "name": "Nom Complet",
  "email": "email@example.com",
  "phone": "+243 XXX XXX XXX",
  "password": "hashed_password",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Chantier**
```json
{
  "id": "unique_id",
  "title": "Titre du chantier",
  "description": "Description détaillée",
  "location": "Lubumbashi, Katanga",
  "date": "2024-01-15",
  "budget": "10000 USD",
  "duration": "3 mois",
  "status": "actif|en_attente|termine",
  "contact": "Nom du contact",
  "requirements": "Exigences spécifiques",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Conception**
```json
{
  "id": "unique_id",
  "title": "Titre de la conception",
  "description": "Description du projet",
  "category": "architecture|design|prototype|autre",
  "image": "/path/to/image.jpg",
  "date": "2024-01-01",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Annonce**
```json
{
  "id": "unique_id",
  "title": "Titre de l'annonce",
  "message": "Contenu du message",
  "priority": "haute|normale|basse",
  "author": "Nom de l'auteur",
  "date": "2024-01-01T00:00:00.000Z"
}
```

## Sécurité

### Implémentation actuelle (développement)
- Stockage en localStorage (non sécurisé)
- Mot de passe en clair (à ne PAS utiliser en production)

### Recommandations pour la production
1. **Hashing des mots de passe** : Utiliser bcrypt ou argon2
2. **Tokens JWT** : Pour l'authentification
3. **HTTPS** : Obligatoire pour toutes les communications
4. **Validation côté serveur** : Ne jamais faire confiance au client
5. **Rate limiting** : Limiter les tentatives de connexion
6. **Sessions sécurisées** : Utiliser des cookies httpOnly et secure

## Accès

- **URL de connexion** : `http://127.0.0.1:5503/membres/`
- **Après connexion** : Redirection automatique vers `/membres/dashboard.html`
- **Protection** : Les pages membres vérifient l'authentification et redirigent vers la connexion si nécessaire

## Développement futur

### Fonctionnalités à ajouter
1. **Profil membre** : Modification des informations personnelles
2. **Notifications** : Système d'alertes pour les nouvelles annonces
3. **Messagerie** : Communication entre membres et admin
4. **Favoris** : Sauvegarder des chantiers ou conceptions
5. **Candidatures** : Historique des candidatures aux chantiers
6. **Documents** : Téléchargement de resources pour membres
7. **Événements** : Calendrier des événements GAL

### Améliorations techniques
1. **API REST** : Backend complet avec Express.js
2. **Base de données** : MongoDB ou PostgreSQL
3. **Upload de fichiers** : Pour les images et documents
4. **Emails** : Notifications par email
5. **Pagination** : Pour les grandes listes
6. **Cache** : Amélioration des performances

## Support

Pour toute question ou problème concernant l'espace membres, contactez l'administration GAL :
- Email : admin@gal-lubumbashi.com
- WhatsApp : +243 979 022 998
=======
# Espace Membres GAL

## Vue d'ensemble

L'espace membres GAL est une plateforme dédiée aux membres du Groupement des Artisans de Lubumbashi. Elle permet aux membres inscrits d'accéder à des informations exclusives sur les chantiers, les conceptions et les annonces.

## Structure du dossier

```
membres/
├── index.html                  # Page de connexion/inscription
├── dashboard.html              # Tableau de bord principal
├── js/
│   ├── auth.js                # Gestion de l'authentification
│   ├── dashboard.js           # Logique du tableau de bord
│   └── pages/
│       ├── chantiers.js       # Gestion page chantiers
│       ├── conceptions.js     # Gestion page conceptions
│       └── annonces.js        # Gestion page annonces
└── pages/
    ├── chantiers.html         # Page des chantiers
    ├── conceptions.html       # Page des conceptions
    └── annonces.html          # Page des annonces
```

## Fonctionnalités

### 1. Authentification

**Inscription**
- Nom complet
- Numéro de téléphone
- Adresse email
- Mot de passe (minimum 6 caractères)
- Confirmation du mot de passe

**Connexion**
- Adresse email
- Mot de passe
- Option "Se souvenir de moi"

### 2. Tableau de bord

Le tableau de bord affiche :
- Statistiques en temps réel (chantiers, conceptions, annonces)
- Derniers chantiers publiés
- Dernières annonces
- Nouvelles conceptions

### 3. Chantiers

Page dédiée aux opportunités de chantiers :
- Liste complète des chantiers disponibles
- Filtrage par statut (actif, en attente, terminé)
- Recherche par mots-clés
- Détails complets de chaque chantier
- Possibilité de postuler directement

**Informations affichées :**
- Titre du chantier
- Description
- Localisation
- Date de début
- Budget (si disponible)
- Durée estimée
- Contact
- Statut

### 4. Conceptions

Galerie des nouvelles conceptions et projets :
- Grille visuelle des conceptions
- Filtrage par catégorie (architecture, design, prototype, autre)
- Recherche par mots-clés
- Images des projets
- Descriptions détaillées

### 5. Annonces

Centre d'information pour les membres :
- Liste chronologique des annonces
- Filtrage par priorité (haute, normale, basse)
- Messages importants de l'administration
- Notifications et alertes

**Niveaux de priorité :**
- 🔴 **Haute** : Annonces urgentes et critiques
- 🔵 **Normale** : Informations importantes
- ⚪ **Basse** : Informations générales

## Administration

L'espace membres est connecté au tableau de bord admin (`/admin`) qui permet de :
- Gérer les membres inscrits
- Publier de nouveaux chantiers
- Ajouter des conceptions
- Créer des annonces
- Modérer le contenu

## Stockage des données

**Actuellement** : Les données sont stockées dans le localStorage du navigateur pour le développement.

**Production** : Les données doivent être stockées dans une base de données (MongoDB ou PostgreSQL) via l'API backend.

### Structures de données

**Membre**
```json
{
  "id": "unique_id",
  "name": "Nom Complet",
  "email": "email@example.com",
  "phone": "+243 XXX XXX XXX",
  "password": "hashed_password",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Chantier**
```json
{
  "id": "unique_id",
  "title": "Titre du chantier",
  "description": "Description détaillée",
  "location": "Lubumbashi, Katanga",
  "date": "2024-01-15",
  "budget": "10000 USD",
  "duration": "3 mois",
  "status": "actif|en_attente|termine",
  "contact": "Nom du contact",
  "requirements": "Exigences spécifiques",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Conception**
```json
{
  "id": "unique_id",
  "title": "Titre de la conception",
  "description": "Description du projet",
  "category": "architecture|design|prototype|autre",
  "image": "/path/to/image.jpg",
  "date": "2024-01-01",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Annonce**
```json
{
  "id": "unique_id",
  "title": "Titre de l'annonce",
  "message": "Contenu du message",
  "priority": "haute|normale|basse",
  "author": "Nom de l'auteur",
  "date": "2024-01-01T00:00:00.000Z"
}
```

## Sécurité

### Implémentation actuelle (développement)
- Stockage en localStorage (non sécurisé)
- Mot de passe en clair (à ne PAS utiliser en production)

### Recommandations pour la production
1. **Hashing des mots de passe** : Utiliser bcrypt ou argon2
2. **Tokens JWT** : Pour l'authentification
3. **HTTPS** : Obligatoire pour toutes les communications
4. **Validation côté serveur** : Ne jamais faire confiance au client
5. **Rate limiting** : Limiter les tentatives de connexion
6. **Sessions sécurisées** : Utiliser des cookies httpOnly et secure

## Accès

- **URL de connexion** : `http://127.0.0.1:5503/membres/`
- **Après connexion** : Redirection automatique vers `/membres/dashboard.html`
- **Protection** : Les pages membres vérifient l'authentification et redirigent vers la connexion si nécessaire

## Développement futur

### Fonctionnalités à ajouter
1. **Profil membre** : Modification des informations personnelles
2. **Notifications** : Système d'alertes pour les nouvelles annonces
3. **Messagerie** : Communication entre membres et admin
4. **Favoris** : Sauvegarder des chantiers ou conceptions
5. **Candidatures** : Historique des candidatures aux chantiers
6. **Documents** : Téléchargement de resources pour membres
7. **Événements** : Calendrier des événements GAL

### Améliorations techniques
1. **API REST** : Backend complet avec Express.js
2. **Base de données** : MongoDB ou PostgreSQL
3. **Upload de fichiers** : Pour les images et documents
4. **Emails** : Notifications par email
5. **Pagination** : Pour les grandes listes
6. **Cache** : Amélioration des performances

## Support

Pour toute question ou problème concernant l'espace membres, contactez l'administration GAL :
- Email : admin@gal-lubumbashi.com
- WhatsApp : +243 979 022 998
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
