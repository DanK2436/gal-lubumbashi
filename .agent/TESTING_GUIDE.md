<<<<<<< HEAD
# 🧪 Guide de Test - GAL Web

## 1. Test du Chatbot Intelligent

### Tests de base
- [ ] Ouvrir le chatbot en cliquant sur le bouton rouge en bas à droite
- [ ] Vérifier que le message d'accueil s'affiche avec l'heure appropriée
- [ ] Fermer et rouvrir le chatbot

### Tests conversationnels

#### Salutations
```
Vous: Bonjour
Bot: Devrait répondre avec un message de bienvenue personnalisé
```

```
Vous: Salut
Bot: Devrait répondre différemment (variations)
```

#### Informations GAL
```
Vous: Qui êtes-vous ?
Bot: Devrait présenter GAL avec détails
```

```
Vous: C'est quoi GAL ?
Bot: Devrait expliquer l'organisation
```

#### Formations
```
Vous: Quelles formations proposez-vous ?
Bot: Devrait lister les formations disponibles
```

```
Vous: Je veux apprendre la soudure
Bot: Devrait mentionner les formations
```

#### Machines
```
Vous: Avez-vous des machines ?
Bot: Devrait parler de location/vente d'équipements
```

```
Vous: Je veux louer du matériel
Bot: Devrait expliquer les services
```

#### Adhésion
```
Vous: Comment devenir membre ?
Bot: Devrait expliquer le processus d'adhésion
```

```
Vous: Rejoindre GAL
Bot: Devrait donner les avantages et la procédure
```

#### Contact
```
Vous: Comment vous contacter ?
Bot: Devrait afficher téléphone, email, WhatsApp
```

```
Vous: Numéro de téléphone
Bot: Devrait donner les coordonnées
```

#### Prix
```
Vous: Combien ça coûte ?
Bot: Devrait orienter vers un contact personnalisé
```

```
Vous: Quel est le prix des formations ?
Bot: Devrait suggérer de contacter pour devis
```

#### Au revoir
```
Vous: Merci
Bot: Devrait répondre poliment
```

```
Vous: Au revoir
Bot: Devrait saluer
```

### Tests techniques
- [ ] Vérifier le délai de réponse (500-1500ms, aléatoire)
- [ ] Vérifier l'indicateur de frappe (3 points animés)
- [ ] Vérifier que les réponses varient à chaque fois
- [ ] Vérifier le scroll automatique
- [ ] Tester avec des messages longs
- [ ] Tester la touche ESC (devrait fermer)

---

## 2. Test de Navigation SPA

### Pages à tester
- [ ] **Accueil** (`/` ou `#home`)
  - Hero section avec parallaxe
  - Stats animés
  - Cards de services cliquables

- [ ] **Vidéos** (`#videos`)
  - Chargement des vidéos
  - Filtres par catégorie
  - Modal de lecture vidéo
  - Fermeture avec ESC

- [ ] **Formations** (`#formations`)
  - Affichage des formations
  - Détails (durée, prix, modules)
  - Bouton "Réserver"

- [ ] **Machines** (`#machines`)
  - Catalogue machines
  - Images
  - Bouton "Fiche Technique" → WhatsApp

- [ ] **Blog** (`#blog`)
  - Articles affichés
  - Newsletter form
  - Modal article

- [ ] **FAQ** (`#faq`)
  - Accordéon fonctionnel
  - Recherche
  - Filtres par catégorie
  - Un seul item ouvert à la fois

- [ ] **À propos** (`#a-propos`)
  - Contenu affiché
  - Images chargées

- [ ] **Contact** (`#contact`)
  - Formulaire fonctionnel
  - Validation
  - Message de succès
  - Boutons WhatsApp

- [ ] **Confidentialité** (`#privacy`)
  - Contenu affiché
  - Liens internes

### Navigation
- [ ] Cliquer sur les liens du menu
- [ ] Vérifier que l'URL change (#page)
- [ ] Vérifier que le contenu se charge
- [ ] Bouton retour du navigateur
- [ ] Bouton avant du navigateur
- [ ] Refresh de la page (F5)

---

## 3. Test des Fonctionnalités

### WhatsApp
- [ ] Bouton flottant WhatsApp
- [ ] Boutons WhatsApp dans les pages
- [ ] Liens WhatsApp préremplis
- [ ] Ouverture dans nouvel onglet

### Formulaires
- [ ] **Contact**
  - Remplir tous les champs
  - Soumettre
  - Vérifier le toast de succès
  - Vérifier que le form se reset

- [ ] **Newsletter** (page blog)
  - Entrer un email
  - Soumettre
  - Vérifier le toast de succès

### Recherche et Filtres
- [ ] **FAQ** - Recherche par mot-clé
- [ ] **FAQ** - Filtres par catégorie
- [ ] **Vidéos** - Filtres par catégorie

### Animations
- [ ] Hover effects sur les cards
- [ ] Transitions de page
- [ ] Parallaxe sur homepage (mouvement souris)
- [ ] Accordion ouverture/fermeture
- [ ] Modal open/close

---

## 4. Test Mobile (Responsive)

### Menu Mobile
- [ ] Hamburger menu apparaît sur petit écran
- [ ] Clic ouvre le menu
- [ ] Liens fonctionnent
- [ ] Fermeture du menu après clic

### Pages
- [ ] Accueil responsive
- [ ] Vidéos en grille responsive
- [ ] Formations empilées correctement
- [ ] Contact form lisible
- [ ] Chatbot adapté mobile

### Touch
- [ ] Scroll fluide
- [ ] Boutons cliquables
- [ ] Modal vidéo fonctionne
- [ ] FAQ accordion au touch

---

## 5. Test de Performance

### Chargement
- [ ] Page d'accueil charge rapidement
- [ ] Navigation entre pages fluide
- [ ] Pas de rechargement complet
- [ ] Images chargent progressivement

### Console Navigateur
- [ ] Ouvrir DevTools (F12)
- [ ] Onglet Console
- [ ] Vérifier aucune erreur rouge
- [ ] Vérifier les logs d'initialisation

### Network
- [ ] Vérifier les requêtes
- [ ] Pas de 404
- [ ] Scripts chargés correctement

---

## 6. Test Cross-Browser

### Navigateurs à tester
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (si Mac/iOS)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Vérifications
- [ ] Layout correct
- [ ] Fonctionnalités opérationnelles
- [ ] Pas d'erreurs console
- [ ] Performance acceptable

---

## 🐛 Bugs à signaler

### Template de bug
```
Page: [nom de la page]
Action: [ce que vous avez fait]
Résultat attendu: [ce qui devrait se passer]
Résultat obtenu: [ce qui s'est passé]
Navigateur: [Chrome/Firefox/etc.]
Console errors: [copier les erreurs si présentes]
```

---

## ✅ Checklist finale

- [ ] Toutes les pages se chargent
- [ ] Navigation SPA fonctionne
- [ ] Chatbot répond intelligemment
- [ ] Formulaires fonctionnent
- [ ] WhatsApp fonctionne
- [ ] Responsive mobile OK
- [ ] Aucune erreur console
- [ ] Performance acceptable

---

**Instructions**: Cochez les cases au fur et à mesure. Si un test échoue, notez-le dans la section bugs.
=======
# 🧪 Guide de Test - GAL Web

## 1. Test du Chatbot Intelligent

### Tests de base
- [ ] Ouvrir le chatbot en cliquant sur le bouton rouge en bas à droite
- [ ] Vérifier que le message d'accueil s'affiche avec l'heure appropriée
- [ ] Fermer et rouvrir le chatbot

### Tests conversationnels

#### Salutations
```
Vous: Bonjour
Bot: Devrait répondre avec un message de bienvenue personnalisé
```

```
Vous: Salut
Bot: Devrait répondre différemment (variations)
```

#### Informations GAL
```
Vous: Qui êtes-vous ?
Bot: Devrait présenter GAL avec détails
```

```
Vous: C'est quoi GAL ?
Bot: Devrait expliquer l'organisation
```

#### Formations
```
Vous: Quelles formations proposez-vous ?
Bot: Devrait lister les formations disponibles
```

```
Vous: Je veux apprendre la soudure
Bot: Devrait mentionner les formations
```

#### Machines
```
Vous: Avez-vous des machines ?
Bot: Devrait parler de location/vente d'équipements
```

```
Vous: Je veux louer du matériel
Bot: Devrait expliquer les services
```

#### Adhésion
```
Vous: Comment devenir membre ?
Bot: Devrait expliquer le processus d'adhésion
```

```
Vous: Rejoindre GAL
Bot: Devrait donner les avantages et la procédure
```

#### Contact
```
Vous: Comment vous contacter ?
Bot: Devrait afficher téléphone, email, WhatsApp
```

```
Vous: Numéro de téléphone
Bot: Devrait donner les coordonnées
```

#### Prix
```
Vous: Combien ça coûte ?
Bot: Devrait orienter vers un contact personnalisé
```

```
Vous: Quel est le prix des formations ?
Bot: Devrait suggérer de contacter pour devis
```

#### Au revoir
```
Vous: Merci
Bot: Devrait répondre poliment
```

```
Vous: Au revoir
Bot: Devrait saluer
```

### Tests techniques
- [ ] Vérifier le délai de réponse (500-1500ms, aléatoire)
- [ ] Vérifier l'indicateur de frappe (3 points animés)
- [ ] Vérifier que les réponses varient à chaque fois
- [ ] Vérifier le scroll automatique
- [ ] Tester avec des messages longs
- [ ] Tester la touche ESC (devrait fermer)

---

## 2. Test de Navigation SPA

### Pages à tester
- [ ] **Accueil** (`/` ou `#home`)
  - Hero section avec parallaxe
  - Stats animés
  - Cards de services cliquables

- [ ] **Vidéos** (`#videos`)
  - Chargement des vidéos
  - Filtres par catégorie
  - Modal de lecture vidéo
  - Fermeture avec ESC

- [ ] **Formations** (`#formations`)
  - Affichage des formations
  - Détails (durée, prix, modules)
  - Bouton "Réserver"

- [ ] **Machines** (`#machines`)
  - Catalogue machines
  - Images
  - Bouton "Fiche Technique" → WhatsApp

- [ ] **Blog** (`#blog`)
  - Articles affichés
  - Newsletter form
  - Modal article

- [ ] **FAQ** (`#faq`)
  - Accordéon fonctionnel
  - Recherche
  - Filtres par catégorie
  - Un seul item ouvert à la fois

- [ ] **À propos** (`#a-propos`)
  - Contenu affiché
  - Images chargées

- [ ] **Contact** (`#contact`)
  - Formulaire fonctionnel
  - Validation
  - Message de succès
  - Boutons WhatsApp

- [ ] **Confidentialité** (`#privacy`)
  - Contenu affiché
  - Liens internes

### Navigation
- [ ] Cliquer sur les liens du menu
- [ ] Vérifier que l'URL change (#page)
- [ ] Vérifier que le contenu se charge
- [ ] Bouton retour du navigateur
- [ ] Bouton avant du navigateur
- [ ] Refresh de la page (F5)

---

## 3. Test des Fonctionnalités

### WhatsApp
- [ ] Bouton flottant WhatsApp
- [ ] Boutons WhatsApp dans les pages
- [ ] Liens WhatsApp préremplis
- [ ] Ouverture dans nouvel onglet

### Formulaires
- [ ] **Contact**
  - Remplir tous les champs
  - Soumettre
  - Vérifier le toast de succès
  - Vérifier que le form se reset

- [ ] **Newsletter** (page blog)
  - Entrer un email
  - Soumettre
  - Vérifier le toast de succès

### Recherche et Filtres
- [ ] **FAQ** - Recherche par mot-clé
- [ ] **FAQ** - Filtres par catégorie
- [ ] **Vidéos** - Filtres par catégorie

### Animations
- [ ] Hover effects sur les cards
- [ ] Transitions de page
- [ ] Parallaxe sur homepage (mouvement souris)
- [ ] Accordion ouverture/fermeture
- [ ] Modal open/close

---

## 4. Test Mobile (Responsive)

### Menu Mobile
- [ ] Hamburger menu apparaît sur petit écran
- [ ] Clic ouvre le menu
- [ ] Liens fonctionnent
- [ ] Fermeture du menu après clic

### Pages
- [ ] Accueil responsive
- [ ] Vidéos en grille responsive
- [ ] Formations empilées correctement
- [ ] Contact form lisible
- [ ] Chatbot adapté mobile

### Touch
- [ ] Scroll fluide
- [ ] Boutons cliquables
- [ ] Modal vidéo fonctionne
- [ ] FAQ accordion au touch

---

## 5. Test de Performance

### Chargement
- [ ] Page d'accueil charge rapidement
- [ ] Navigation entre pages fluide
- [ ] Pas de rechargement complet
- [ ] Images chargent progressivement

### Console Navigateur
- [ ] Ouvrir DevTools (F12)
- [ ] Onglet Console
- [ ] Vérifier aucune erreur rouge
- [ ] Vérifier les logs d'initialisation

### Network
- [ ] Vérifier les requêtes
- [ ] Pas de 404
- [ ] Scripts chargés correctement

---

## 6. Test Cross-Browser

### Navigateurs à tester
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (si Mac/iOS)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Vérifications
- [ ] Layout correct
- [ ] Fonctionnalités opérationnelles
- [ ] Pas d'erreurs console
- [ ] Performance acceptable

---

## 🐛 Bugs à signaler

### Template de bug
```
Page: [nom de la page]
Action: [ce que vous avez fait]
Résultat attendu: [ce qui devrait se passer]
Résultat obtenu: [ce qui s'est passé]
Navigateur: [Chrome/Firefox/etc.]
Console errors: [copier les erreurs si présentes]
```

---

## ✅ Checklist finale

- [ ] Toutes les pages se chargent
- [ ] Navigation SPA fonctionne
- [ ] Chatbot répond intelligemment
- [ ] Formulaires fonctionnent
- [ ] WhatsApp fonctionne
- [ ] Responsive mobile OK
- [ ] Aucune erreur console
- [ ] Performance acceptable

---

**Instructions**: Cochez les cases au fur et à mesure. Si un test échoue, notez-le dans la section bugs.
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
