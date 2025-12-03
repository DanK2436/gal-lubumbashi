-- ================================================
-- DONNÉES D'ENTRAÎNEMENT CHATBOT - GAL LUBUMBASHI
-- Projet : Site Web GAL
-- Description : Population de la table chatbot_knowledge avec des données riches
-- ================================================

-- Vider la table existante pour éviter les doublons
TRUNCATE TABLE chatbot_knowledge;

-- Insertion des données
INSERT INTO chatbot_knowledge (tag, patterns, responses) VALUES
(
    'salutation',
    '["bonjour", "bonsoir", "salut", "hello", "hi", "hey", "coucou", "yo", "bon matin", "bonne après-midi"]',
    '["Bonjour ! 👋 Je suis Dan Kande, votre assistant virtuel GAL. Comment puis-je vous aider aujourd''hui ?", "Salut ! Ravi de vous voir. 😊 Que puis-je faire pour vous ?", "Bonjour ! Bienvenue chez GAL. Je suis à votre écoute. 🤝"]'
),
(
    'aurevoir',
    '["au revoir", "bye", "à bientôt", "ciao", "à plus", "tchao", "bonne journée", "bonne soirée", "adieu"]',
    '["Au revoir ! 👋 Ce fut un plaisir d''échanger avec vous. À bientôt !", "Bonne journée ! N''hésitez pas à revenir si vous avez d''autres questions. 🌟", "À très bientôt chez GAL ! Prenez soin de vous. 🚀"]'
),
(
    'merci',
    '["merci", "thank you", "thanks", "cimer", "super", "cool", "génial", "top", "parfait", "excellent", "merci beaucoup"]',
    '["Avec grand plaisir ! 🤝 N''hésitez pas si vous avez d''autres questions.", "Je suis là pour ça ! 😊", "Ravi d''avoir pu vous aider ! ✅", "À votre service ! ⚙️"]'
),
(
    'presentation_gal',
    '["qui êtes vous", "c''est quoi gal", "présentation", "à propos", "qu''est-ce que gal", "que faites vous", "votre mission", "qui est gal"]',
    '["Le Groupement des Artisans de Lubumbashi (GAL) est une association professionnelle regroupant plus de 150 artisans qualifiés. 🛠️ Nous accompagnons nos membres dans leur développement professionnel à travers la formation, l''accès aux machines et le réseautage.", "GAL est votre partenaire pour l''excellence artisanale à Lubumbashi. Nous offrons formations, machines et opportunités d''affaires. 💼", "Nous sommes une communauté d''artisans passionnés dédiés à l''innovation et à la qualité locale. 🇨🇩"]'
),
(
    'adhesion',
    '["devenir membre", "adhésion", "adhérer", "rejoindre", "inscription", "m''inscrire", "comment entrer", "faire partie", "rejoindre le groupe"]',
    '["Pour devenir membre de GAL, vous devez être un artisan actif dans la région de Lubumbashi. 👷‍♂️ Contactez-nous via le formulaire de contact ou WhatsApp pour démarrer le processus.", "Rejoignez notre communauté ! L''adhésion se fait sur dossier. Écrivez-nous sur WhatsApp pour plus de détails. 📝", "C''est simple : contactez-nous, présentez votre activité, et nous vous guiderons pour l''adhésion. Bienvenue future membre ! 🤝"]'
),
(
    'cout_adhesion',
    '["prix adhésion", "coût membre", "tarif inscription", "combien payer", "cotisation", "montant adhésion", "c''est payant"]',
    '["La cotisation annuelle est de 50 USD. 💵 Ce montant vous donne accès à tous nos services : formations réduites, machines à prix préférentiel et réseau.", "L''adhésion coûte 50$ par an. Un investissement vite rentabilisé grâce à nos tarifs membres ! 📈"]'
),
(
    'formations_info',
    '["formation", "apprendre", "cours", "enseignement", "certificat", "diplôme", "quelles formations", "liste formations"]',
    '["Nous proposons des formations certifiantes en électricité, soudure, menuiserie, plomberie, mécanique et gestion. 🎓 Consultez notre page ''Formations'' pour le catalogue complet.", "Nos formations sont pratiques et adaptées au marché local. 🛠️ Vous obtenez un certificat reconnu à la fin de chaque module.", "Développez vos compétences avec nos experts ! Visitez la section Formations du site pour choisir votre parcours. 🚀"]'
),
(
    'inscription_formation',
    '["suivre formation", "inscrire formation", "participer formation", "comment apprendre", "m''inscrire cours", "date formation"]',
    '["Pour vous inscrire à une formation, choisissez celle qui vous intéresse sur notre site et contactez-nous pour réserver votre place. 📅", "Les inscriptions se font directement auprès de notre secrétariat ou via WhatsApp. Dites-nous quelle formation vous intéresse ! ✍️"]'
),
(
    'machines_info',
    '["machine", "équipement", "outil", "matériel", "catalogue", "quelles machines", "inventaire"]',
    '["Nous fabriquons et vendons des machines adaptées aux besoins locaux : batteuses, presses à briques, moulins, etc. ⚙️ Découvrez notre catalogue sur la page ''Machines''.", "Nos machines sont robustes et conçues à Lubumbashi. 🇨🇩 Visitez la page Machines pour voir nos modèles disponibles.", "Besoin d''équipement ? Nous avons ce qu''il vous faut. Consultez notre catalogue en ligne ! 🚜"]'
),
(
    'achat_machine',
    '["acheter machine", "achat", "commander", "prix machine", "comment payer", "acheter", "commande", "paiement"]',
    '["Pour acheter une machine, contactez-nous pour un devis. 📝 Nous proposons des facilités de paiement échelonné pour vous aider à vous équiper.", "L''achat se fait sur commande ou sur stock. Appelez-nous ou passez nous voir pour discuter de votre besoin. 🤝", "Vous pouvez commander directement via WhatsApp ou en venant à notre atelier. Nous offrons des plans de paiement flexibles. 💳"]'
),
(
    'sur_mesure',
    '["sur mesure", "personnalisé", "custom", "spécial", "conception", "fabriquer machine", "mon propre design"]',
    '["Absolument ! Nous sommes spécialisés dans la fabrication sur mesure. 📏 Apportez-nous votre idée ou vos plans, et nos ingénieurs la réaliseront.", "Oui, nous pouvons concevoir une machine selon vos spécifications exactes. Discutons de votre projet ! 💡"]'
),
(
    'videos',
    '["vidéo", "tutoriel", "voir machine", "démonstration", "youtube", "regarder", "chaine", "visuel"]',
    '["Découvrez nos machines en action sur notre page ''Vidéos'' ! 🎥 Vous y trouverez des démos et des tutoriels.", "Nous avons une galerie vidéo complète pour vous montrer comment fonctionnent nos équipements. Allez jeter un œil ! 👀", "Rien de tel qu''une vidéo ! Visitez notre section Vidéos ou notre chaîne YouTube. 📺"]'
),
(
    'contact',
    '["contact", "téléphone", "email", "joindre", "appeler", "numéro", "whatsapp", "adresse", "où êtes vous"]',
    '["Vous pouvez nous joindre au +243 979 022 998 (Appel & WhatsApp) ou par email à contact@gal-lubumbashi.com. 📱", "Nous sommes à Lubumbashi. Contactez-nous sur WhatsApp pour la localisation exacte ou un rendez-vous ! 📍", "L''équipe est disponible du lundi au vendredi. Le plus simple est de nous écrire sur WhatsApp ! 💬"]'
),
(
    'horaires',
    '["horaire", "heure", "ouverture", "fermeture", "quand venir", "disponible", "ouvert"]',
    '["Nous sommes ouverts du lundi au vendredi, de 8h00 à 17h00. 🕒", "Nos bureaux et ateliers vous accueillent en semaine de 8h à 17h. Fermé le week-end. 📅"]'
),
(
    'services_conseil',
    '["conseil", "aide", "accompagnement", "coaching", "mentorat", "soutien"]',
    '["Au-delà des machines, nous offrons du conseil pour lancer ou développer votre activité. 🚀 Parlez-nous de votre projet !", "Nos experts sont là pour vous guider dans le choix de vos équipements et votre stratégie. 🤝"]'
),
(
    'maintenance',
    '["réparation", "panne", "garantie", "service après vente", "sav", "pièces détachées", "maintenance"]',
    '["Nous assurons un SAV complet sur toutes nos machines. 🔧 Pièces de rechange et main d''œuvre garanties !", "Pas d''inquiétude, nos techniciens sont là pour la maintenance et les réparations. Votre production ne s''arrête pas ! 🛠️"]'
);
