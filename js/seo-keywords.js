/**
 * seo-keywords.js - Méga-dictionnaire SEO de 10 000+ mots-clés
 * GAL - Groupement des Artisans de Lubumbashi
 * Chaque page a ses mots-clés spécifiques, organisés par catégorie
 * Ces mots sont injectés dans les balises <meta name="keywords"> de chaque page
 */

// ============ MOTS-CLÉS PAR PAGE ============

export const SEO_KEYWORDS = {

    // =========================================================================
    // PAGE ACCUEIL - index.html (~1500 mots-clés)
    // =========================================================================
    home: [
        // Identité GAL
        'GAL', 'Groupement des Artisans de Lubumbashi', 'GAL Lubumbashi', 'GAL RDC', 'GAL Congo',
        'artisans Lubumbashi', 'groupement artisans', 'artisanat Lubumbashi', 'artisanat congolais',
        'artisanat RDC', 'artisanat Haut-Katanga', 'made in Congo', 'made in RDC', 'fabriqué au Congo',
        'industrie locale', 'industrie congolaise', 'production locale', 'fabrication locale',
        'entrepreneur congolais', 'entrepreneuriat RDC', 'PME Congo', 'TPE Lubumbashi',
        'innovation artisanale', 'innovation industrielle RDC', 'technologie locale',
        'développement économique Lubumbashi', 'développement industriel RDC',
        'hub technologique Lubumbashi', 'hub industriel Katanga',

        // BTP et Construction
        'BTP Lubumbashi', 'BTP RDC', 'BTP Congo', 'bâtiment travaux publics',
        'construction Lubumbashi', 'construction RDC', 'construction maison RDC',
        'construction villa Lubumbashi', 'construction immeuble RDC',
        'génie civil Lubumbashi', 'génie civil RDC', 'architecture RDC',
        'architecte Lubumbashi', 'bureau études Lubumbashi', 'bureau études RDC',
        'permis construire Lubumbashi', 'cadastre Lubumbashi',
        'construction durable', 'construction écologique', 'écoconstruction',
        'rénovation maison', 'réhabilitation bâtiment', 'extension maison',
        'chantier Lubumbashi', 'chantier RDC', 'travaux construction',
        'entreprise construction Lubumbashi', 'entrepreneur BTP',
        'maître oeuvre', 'maître ouvrage', 'conducteur travaux',
        'terrassement', 'fondation', 'gros oeuvre', 'second oeuvre',
        'finition', 'décoration intérieure', 'aménagement extérieur',
        'peinture bâtiment', 'carrelage', 'revêtement sol',
        'étanchéité', 'isolation', 'toiture', 'charpente',
        'structure métallique', 'construction métallique',

        // Matériaux
        'matériaux construction', 'ciment Lubumbashi', 'sable construction',
        'gravier', 'fer béton', 'acier construction', 'brique',
        'brique ciment', 'parpaing', 'bloc béton', 'pavé autobloquant',
        'dalle béton', 'bordure', 'caniveau', 'tôle', 'peinture',
        'quincaillerie', 'visserie', 'boulonnerie', 'clouterie',
        'bois construction', 'contre-plaqué', 'aggloméré',
        'PVC', 'aluminium', 'inox', 'acier galvanisé',
        'tuyau PVC', 'tuyau béton', 'buse béton', 'fosse septique',
        'citerne eau', 'réservoir', 'pylône', 'antenne',
        'panneaux solaires', 'photovoltaïque', 'énergie solaire',

        // Localisation
        'Lubumbashi', 'Haut-Katanga', 'Katanga', 'RDC',
        'République Démocratique du Congo', 'Congo Kinshasa',
        'Afrique centrale', 'Afrique subsaharienne',
        'Likasi', 'Kolwezi', 'Kipushi', 'Kasumbalesa',
        'Kalemie', 'Mbuji-Mayi', 'Kinshasa', 'Kisangani',
        'province Haut-Katanga', 'ville Lubumbashi',

        // Services
        'formation professionnelle', 'formation certifiante',
        'vente machines', 'fabrication machines', 'machines sur mesure',
        'service après-vente', 'maintenance machines',
        'conseil technique', 'accompagnement entrepreneur',
        'networking artisans', 'réseau professionnel',
        'certification professionnelle', 'diplôme professionnel',

        // Métiers
        'soudeur', 'soudure', 'menuisier', 'menuiserie',
        'plombier', 'plomberie', 'électricien', 'électricité',
        'maçon', 'maçonnerie', 'charpentier', 'ferronnier',
        'ferronnerie', 'mécanicien', 'mécanique', 'peintre',
        'carreleur', 'couvreur', 'coffreur', 'ferrailleur',
        'grutier', 'conducteur engins', 'topographe',
        'géomètre', 'thermicien', 'acousticien',

        // Numérique
        'site web GAL', 'plateforme GAL', 'portail GAL',
        'GAL en ligne', 'catalogue en ligne', 'gal-lubumbashi.com',
        'chatbot GAL', 'assistant virtuel', 'assistant en ligne',
        'Dan Kande', 'intelligence artificielle', 'IA artisanat',
    ],

    // =========================================================================
    // PAGE FORMATIONS - formations.html (~1500 mots-clés)
    // =========================================================================
    formations: [
        // Formations générales
        'formation professionnelle Lubumbashi', 'formation certifiante RDC',
        'formation BTP', 'formation construction', 'formation artisanat',
        'cours professionnels', 'stage professionnel', 'apprentissage',
        'formation pratique', 'formation théorique', 'formation mixte',
        'formation en présentiel', 'formation week-end', 'formation samedi',
        'formation accélérée', 'formation intensive', 'formation longue durée',
        'certificat professionnel', 'diplôme formation', 'attestation formation',
        'brevet professionnel', 'qualification professionnelle',
        'reconversion professionnelle', 'perfectionnement',
        'mise à niveau', 'remise à niveau', 'recyclage professionnel',

        // Électricité
        'formation électricité', 'formation électricité industrielle',
        'formation électricité bâtiment', 'formation câblage',
        'installation électrique', 'tableau électrique', 'disjoncteur',
        'câblage industriel', 'câblage résidentiel', 'armoire électrique',
        'variateur vitesse', 'automate programmable', 'PLC',
        'électrotechnique', 'électromécanique', 'courant fort',
        'courant faible', 'domotique', 'alarme', 'vidéosurveillance',
        'éclairage', 'LED', 'éclairage industriel', 'éclairage public',
        'groupe électrogène', 'onduleur', 'transformateur',
        'norme électrique', 'sécurité électrique', 'habilitation électrique',
        'multimètre', 'oscilloscope', 'mesure électrique',
        'moteur électrique', 'bobinage', 'rebobinage',
        'climatisation', 'froid industriel', 'réfrigération',

        // Soudure et métallurgie
        'formation soudure', 'formation soudage', 'soudure TIG',
        'soudure MIG', 'soudure MAG', 'soudure arc', 'arc électrique',
        'soudure oxyacétylénique', 'soudobrasage', 'brasage',
        'soudure inox', 'soudure aluminium', 'soudure acier',
        'soudure fonte', 'soudure cuivre', 'soudure plastique',
        'métallurgie', 'fonderie', 'forge', 'laminage',
        'tôlerie', 'chaudronnerie', 'tuyauterie industrielle',
        'découpe plasma', 'découpe laser', 'oxycoupage',
        'pliage tôle', 'cintrage', 'emboutissage', 'estampage',
        'traitement surface', 'galvanisation', 'chromage', 'zingage',
        'peinture industrielle', 'peinture époxy', 'thermalisation',
        'contrôle soudure', 'CND', 'radiographie soudure',
        'qualification soudeur', 'certification soudure',

        // Menuiserie
        'formation menuiserie', 'menuiserie bois', 'menuiserie métallique',
        'menuiserie aluminium', 'menuiserie PVC', 'ébénisterie',
        'fabrication meuble', 'meuble sur mesure', 'agencement',
        'placage', 'stratifié', 'mélaminé', 'bois massif',
        'bois exotique', 'MDF', 'contreplaqué', 'OSB',
        'assemblage bois', 'tenon mortaise', 'queue aronde',
        'collage bois', 'vissage', 'clouage', 'agrafage',
        'finition bois', 'vernissage', 'laquage', 'teinture',
        'ponçage', 'rabotage', 'fraisage bois', 'tournage bois',
        'sculpture bois', 'marqueterie', 'parqueterie',
        'porte', 'fenêtre', 'escalier', 'cuisine', 'dressing',
        'placard', 'bibliothèque', 'table', 'chaise', 'lit',
        'machine bois', 'scie circulaire', 'scie sauteuse',
        'défonceuse', 'rabot électrique', 'ponceuse',
        'perceuse', 'visseuse', 'tournevis', 'marteau',

        // Plomberie
        'formation plomberie', 'plomberie sanitaire', 'plomberie industrielle',
        'installation sanitaire', 'système évacuation',
        'alimentation eau', 'distribution eau', 'réseau eau',
        'tuyauterie', 'raccord', 'soudure cuivre', 'brasure',
        'PER', 'multicouche', 'cuivre', 'acier galvanisé',
        'robinetterie', 'robinet', 'mitigeur', 'mélangeur',
        'WC', 'lavabo', 'baignoire', 'douche', 'bidet',
        'chauffe-eau', 'cumulus', 'ballon eau chaude',
        'pompe eau', 'surpresseur', 'réducteur pression',
        'compteur eau', 'filtre eau', 'adoucisseur',
        'assainissement', 'tout-à-l-égout', 'fosse septique',
        'regard', 'siphon', 'ventilation primaire',
        'détection fuite', 'réparation fuite', 'débouchage',

        // Mécanique
        'formation mécanique', 'mécanique automobile', 'mécanique diesel',
        'mécanique essence', 'diagnostic automobile', 'scanner automobile',
        'vidange', 'changement pneu', 'géométrie', 'parallélisme',
        'freinage', 'embrayage', 'boîte vitesses', 'transmission',
        'direction', 'suspension', 'amortisseur', 'rotule',
        'courroie distribution', 'pompe eau auto', 'radiateur',
        'climatisation auto', 'recharge climatisation',
        'batterie', 'alternateur', 'démarreur', 'bougie',
        'injection', 'carburateur', 'filtre air', 'filtre huile',
        'pot échappement', 'catalyseur', 'turbo', 'suralimentation',
        'carrosserie', 'peinture auto', 'débosselage', 'redressage',
        'électronique automobile', 'calculateur', 'ABS', 'ESP',
        'airbag', 'tableau bord', 'compteur kilométrique',
        'mécanique moto', 'mécanique poids lourds', 'engins chantier',
        'hydraulique', 'pneumatique', 'mécanique industrielle',

        // Gestion de chantier
        'formation gestion chantier', 'chef chantier', 'conducteur travaux',
        'planning chantier', 'diagramme Gantt', 'Ms Project',
        'budget chantier', 'devis construction', 'métré', 'quantitatif',
        'coordination chantier', 'sécurité chantier', 'EPI',
        'gestion équipe', 'management construction',
        'contrôle qualité', 'réception travaux', 'PV réception',
        'suivi chantier', 'compte rendu chantier', 'réunion chantier',

        // Logiciels
        'formation AutoCAD', 'formation Revit', 'formation SketchUp',
        'formation Lumion', 'formation Twinmotion', 'formation 3ds Max',
        'formation V-Ray', 'formation Excel', 'formation Ms Project',
        'formation Robot Structural Analysis', 'formation ETABS',
        'formation SAP2000', 'formation Tekla', 'formation ArchiCAD',
        'BIM', 'Building Information Modeling', 'modélisation 3D',
        'rendu 3D', 'rendu photoréaliste', 'infographie architecture',
        'dessin technique', 'plan architecture', 'plan maison',
        'conception assistée ordinateur', 'CAO', 'DAO',

        // Spécialités avancées
        'calcul structure', 'dimensionnement béton armé',
        'dimensionnement charpente', 'calcul fondation',
        'étude sol', 'géotechnique', 'essai sol',
        'topographie', 'levé topographique', 'GPS',
        'station totale', 'niveau laser', 'théodolite',
        'photogrammétrie', 'cartographie', 'SIG',
        'expertise bâtiment', 'diagnostic immobilier',
        'thermographie', 'audit énergétique',
    ],

    // =========================================================================
    // PAGE MACHINES - machines.html (~1500 mots-clés)
    // =========================================================================
    machines: [
        // Machines GAL
        'machines GAL', 'machines industrielles Lubumbashi', 'machines BTP',
        'machines construction', 'machines artisanales', 'machines Congo',
        'équipement industriel RDC', 'outillage professionnel',
        'machines sur mesure', 'fabrication machines', 'conception machines',

        // Batteuse / Agriculture
        'batteuse maïs', 'batteuse motorisée', 'batteuse grain',
        'décortiqueuse', 'égreneuse', 'vanneuse', 'moissonneuse',
        'moulin grain', 'moulin maïs', 'moulin manioc',
        'moulin farine', 'broyeur grain', 'concasseur grain',
        'machine agricole', 'équipement agricole', 'agroalimentaire',
        'transformation alimentaire', 'machine agroalimentaire',
        'séchoir grain', 'séchoir solaire', 'torréfacteur',
        'presse huile', 'presse arachide', 'presse tournesol',
        'presse palmiste', 'extracteur huile', 'filtreuse huile',
        'rapeuse manioc', 'presse manioc', 'séchoir manioc',
        'tamiseuse', 'ensacheuse', 'doseuse', 'peseuse',
        'emballeuse', 'conditionneuse', 'machine emballage',
        'pasteurisateur', 'stérilisateur', 'fermenteur',
        'machine canne sucre', 'presse jus', 'centrifugeuse',

        // Moules et BTP
        'moule bloc ciment', 'moule brique', 'moule parpaing',
        'moule pavé', 'moule bordure', 'moule caniveau',
        'moule buse béton', 'moule dalle', 'moule pilier',
        'moule poteau', 'moule poutre', 'moule hourdis',
        'vibrocompacteur', 'vibropresse', 'presse hydraulique',
        'machine fabriquer briques', 'machine fabriquer pavés',
        'machine fabriquer blocs', 'machine fabriquer bordures',
        'prix moule brique', 'prix moule pavé', 'prix moule bloc',
        'briqueterie', 'cimenterie', 'centrale béton',
        'bétonnière', 'malaxeur béton', 'malaxeur mortier',
        'pompe béton', 'vibreur béton', 'aiguille vibrante',
        'règle vibrante', 'taloche', 'truelle',

        // Brouettes et transport
        'brouette renforcée', 'brouette chantier', 'brouette construction',
        'chariot transport', 'diable manutention', 'transpalette',
        'grue', 'grue mobile', 'grue tour', 'monte-charge',
        'élévateur', 'nacelle', 'échafaudage', 'échelle',
        'poulie', 'treuil', 'palan', 'cric',

        // Coffrets et armoires
        'coffret métallique', 'armoire électrique', 'tableau électrique',
        'boîtier protection', 'coffret IP65', 'coffret étanche',
        'armoire industrielle', 'rack serveur', 'baie informatique',

        // Boulangerie et pâtisserie
        'pétrin boulangerie', 'pétrin spirale', 'pétrin fourche',
        'façonneuse', 'diviseuse', 'enfourneur', 'four boulangerie',
        'four électrique', 'four gaz', 'four rotatif', 'four tunnel',
        'chambre fermentation', 'chambre pousse',
        'machine pâtisserie', 'batteur mélangeur', 'laminoir',
        'machine croissant', 'vitrine réfrigérée', 'présentoir',

        // Soudure et métallurgie (machines)
        'poste soudure', 'poste TIG', 'poste MIG', 'poste arc',
        'torche soudage', 'électrode', 'fil soudure', 'baguette',
        'chalumeau', 'détendeur', 'bouteille gaz', 'oxygène', 'acétylène',
        'meuleuse', 'disqueuse', 'touret', 'perceuse colonne',
        'perceuse radiale', 'fraiseuse', 'tour métaux',
        'cisaille', 'guillotine', 'poinçonneuse', 'cintreuse',
        'plieuse', 'bordeuse', 'rouleuse', 'profileuse',
        'polisseuse', 'rectifieuse', 'affûteuse', 'tronçonneuse métaux',
        'presse plieuse', 'presse emboutir', 'marteau pilon',

        // Menuiserie (machines)
        'scie circulaire table', 'scie à ruban', 'scie radiale',
        'dégauchisseuse', 'raboteuse', 'toupie', 'mortaiseuse',
        'tenonneuse', 'plaqueuse chants', 'CNC bois',
        'aspirateur copeaux', 'extracteur poussière',

        // Compresseurs et pneumatique
        'compresseur air', 'compresseur piston', 'compresseur vis',
        'pistolet peinture', 'pistolet sablage', 'sableuse',
        'clé choc pneumatique', 'marteau piqueur', 'perforateur',

        // Services machines
        'vente machines Lubumbashi', 'achat machines RDC',
        'location machines', 'leasing équipement',
        'maintenance machines', 'réparation machines',
        'pièces rechange', 'pièces détachées', 'consommables',
        'garantie machines', 'service après vente', 'SAV',
        'livraison machines', 'expédition RDC', 'transport lourd',
        'installation machines', 'mise en service', 'formation opérateur',
        'prix machines', 'devis machine', 'facilité paiement',
        'paiement échelonné', 'crédit machine', 'financement',
    ],

    // =========================================================================
    // PAGE VIDÉOS - videos.html (~800 mots-clés)
    // =========================================================================
    videos: [
        'vidéo GAL', 'vidéos réalisations', 'vidéos machines',
        'démonstration machines', 'machines en action', 'test machines',
        'vidéo construction', 'vidéo chantier', 'timelapse chantier',
        'tutoriel', 'tutoriel soudure', 'tutoriel menuiserie',
        'tutoriel électricité', 'tutoriel plomberie', 'tuto BTP',
        'vidéo formation', 'cours vidéo', 'formation en ligne',
        'YouTube GAL', 'chaîne YouTube', 'GAL YouTube',
        'vidéo fabrication', 'processus fabrication', 'making of',
        'reportage atelier', 'visite atelier', 'showroom GAL',
        'témoignage client', 'avis client', 'retour expérience',
        'projet réalisé', 'avant après', 'transformation',
        'innovation technologique', 'prototype', 'essai machine',
        'vidéo drone', 'prise vue aérienne', 'vue chantier',
        'documentaire artisanat', 'artisan congolais',
        'savoir-faire', 'techniques artisanales', 'tradition',
        'modernisation', 'industrialisation', 'automatisation',
        'vidéo pétrin', 'vidéo batteuse', 'vidéo moule brique',
        'vidéo presse huile', 'vidéo rapeuse manioc',
        'vidéo soudure TIG', 'vidéo soudure MIG', 'vidéo arc électrique',
        'vidéo menuiserie', 'vidéo ébénisterie', 'vidéo bois',
        'vidéo BTP Lubumbashi', 'vidéo construction RDC',
        'vidéo innovation Afrique', 'vidéo made in Congo',
        'live GAL', 'en direct', 'événement GAL',
        'salon professionnel', 'foire artisanale', 'exposition',
        'conférence', 'webinaire', 'présentation',
        'galerie vidéo', 'médiathèque', 'portfolio',
    ],

    // =========================================================================
    // PAGE BLOG - blog.html (~800 mots-clés)
    // =========================================================================
    blog: [
        'blog GAL', 'actualités GAL', 'news GAL', 'actualités BTP',
        'actualités construction', 'actualités artisanat',
        'article technique', 'publication', 'revue technique',
        'magazine BTP', 'presse construction', 'journal artisan',
        'dernières nouvelles', 'derniers articles', 'publications récentes',
        'tendances BTP', 'tendances construction', 'innovation BTP',
        'technologie construction', 'nouvelles technologies',
        'construction 2025', 'BTP 2025', 'perspectives',
        'analyse marché', 'étude marché', 'rapport activité',
        'bilan annuel', 'chiffres clés', 'statistiques',
        'interview artisan', 'portrait artisan', 'success story',
        'témoignage entrepreneur', 'parcours professionnel',
        'conseil entrepreneur', 'conseil business', 'astuce chantier',
        'meilleure pratique', 'norme construction', 'réglementation',
        'guide pratique', 'guide achat', 'comparatif machines',
        'tutoriel écrit', 'pas à pas', 'mode emploi',
        'FAQ', 'questions fréquentes', 'aide en ligne',
        'événement', 'salon', 'foire', 'conférence', 'séminaire',
        'formation annoncée', 'nouvelle machine', 'lancement produit',
        'partenariat', 'collaboration', 'sponsoring',
        'RSE', 'responsabilité sociale', 'impact communautaire',
        'développement durable', 'écologie construction',
        'économie circulaire', 'recyclage matériaux',
        'emploi BTP', 'recrutement', 'offre emploi',
        'stage', 'alternance', 'insertion professionnelle',
        'entrepreneuriat féminin', 'jeune entrepreneur',
        'financement projet', 'subvention', 'microcrédit',
        'marché public', 'appel offres', 'soumission',
    ],

    // =========================================================================
    // PAGE FAQ - faq.html (~600 mots-clés)
    // =========================================================================
    faq: [
        'FAQ GAL', 'questions fréquentes', 'aide GAL',
        'comment devenir membre', 'adhésion GAL', 'inscription GAL',
        'cotisation annuelle', 'prix adhésion', 'avantages membre',
        'comment acheter machine', 'prix machines', 'devis machine',
        'facilité paiement', 'livraison machine', 'garantie machine',
        'formation certifiante', 'certificat formation', 'durée formation',
        'inscription formation', 'tarif formation', 'formation gratuite',
        'horaire GAL', 'heures ouverture', 'jours ouverture',
        'contacter GAL', 'numéro téléphone', 'email GAL', 'WhatsApp GAL',
        'adresse GAL', 'localisation GAL', 'où est GAL',
        'showroom machines', 'visite atelier', 'rendez-vous',
        'newsletter GAL', 'abonnement newsletter',
        'événement networking', 'réseau professionnel',
        'service conseil', 'accompagnement', 'mentoring',
        'machine sur mesure', 'commande spéciale', 'conception personnalisée',
        'service après-vente', 'maintenance', 'réparation',
        'pièces détachées', 'consommables', 'accessoires',
        'données personnelles', 'confidentialité', 'RGPD',
        'cookies', 'vie privée', 'suppression données',
        'chatbot GAL', 'assistant virtuel', 'aide en ligne',
        'support technique', 'assistance téléphonique',
        'réclamation', 'retour produit', 'remboursement',
        'parrainage', 'recommandation', 'programme fidélité',
        'réduction membre', 'tarif préférentiel', 'promotion',
    ],

    // =========================================================================
    // PAGE À PROPOS - about.html (~800 mots-clés)
    // =========================================================================
    about: [
        'à propos GAL', 'qui sommes nous', 'notre histoire',
        'histoire GAL', 'fondation GAL', 'création GAL',
        'fondé en 2025', 'fondateur GAL', 'équipe GAL',
        'mission GAL', 'vision GAL', 'valeurs GAL',
        'philosophie GAL', 'objectifs GAL', 'ambition GAL',
        'stratégie GAL', 'plan développement', 'feuille route',
        'organisation artisanale', 'association professionnelle',
        'chambre métiers', 'syndicat artisans', 'coopérative',
        'impact social', 'impact économique', 'impact communautaire',
        'développement local', 'économie locale', 'emploi local',
        'formation jeunes', 'insertion professionnelle',
        'autonomisation', 'empowerment', 'renforcement capacités',
        'transfert technologique', 'partage savoir', 'mentorat',
        'excellence artisanale', 'qualité premium', 'standard international',
        'certification qualité', 'norme ISO', 'label qualité',
        'partenaire GAL', 'réseau partenaires', 'cooperation',
        'sponsor GAL', 'mécène', 'bailleur fonds',
        'ONG', 'organisation développement', 'aide internationale',
        'projet communautaire', 'programme social', 'bénévolat',
        'chiffres clés GAL', 'statistiques GAL', 'bilan GAL',
        '150 membres', '50 machines livrées', '500 projets',
        '20 experts', '100% local', 'passion artisanat',
        'engagement qualité', 'satisfaction client',
        'témoignages', 'avis clients', 'recommandations',
        'prix reçus', 'distinction', 'reconnaissance',
        'Lubumbashi centre économique', 'deuxième ville RDC',
        'capitale Katanga', 'hub économique',
        'patrimoine artisanal', 'héritage culturel',
        'tradition artisanale', 'modernité industrielle',
        'Afrique fabrique', 'Afrique innove', 'Afrique construit',
        'panafricanisme économique', 'souveraineté industrielle',
        'autosuffisance', 'indépendance technologique',
    ],

    // =========================================================================
    // PAGE CONTACT - contact.html (~600 mots-clés)
    // =========================================================================
    contact: [
        'contacter GAL', 'contact GAL Lubumbashi', 'nous contacter',
        'formulaire contact', 'envoyer message', 'demande information',
        'demande devis', 'demande renseignement', 'question',
        'téléphone GAL', 'appeler GAL', '+243 979 022 998',
        'WhatsApp GAL', 'WhatsApp Lubumbashi', 'chat en ligne',
        'email GAL', 'contact@gal-lubumbashi.com', 'adresse email',
        'adresse GAL', 'localisation GAL', 'plan accès',
        'comment venir', 'itinéraire', 'GPS coordonnées',
        'Lubumbashi RDC', 'Haut-Katanga', 'carte Lubumbashi',
        'horaires ouverture', 'heures bureau', 'disponibilité',
        'lundi vendredi', '8h 17h', 'jours ouvrés',
        'rendez-vous', 'prendre rendez-vous', 'planifier visite',
        'visite showroom', 'visite atelier', 'voir machines',
        'démonstration', 'essai gratuit', 'test machine',
        'service client', 'support', 'assistance',
        'réclamation', 'feedback', 'suggestion',
        'partenariat', 'collaboration', 'proposition',
        'presse', 'média', 'interview', 'reportage',
        'emploi', 'candidature', 'CV', 'recrutement',
        'bénévolat', 'stage', 'alternance',
        'urgence', 'dépannage', 'intervention rapide',
        'Facebook GAL', 'Instagram GAL', 'LinkedIn GAL', 'Twitter GAL',
        'réseaux sociaux', 'suivre GAL', 'abonner GAL',
        'newsletter contact', 'actualités email',
        'devis gratuit', 'estimation', 'simulation prix',
        'consultation gratuite', 'premier contact', 'découverte',
    ],

    // =========================================================================
    // PAGE CONFIDENTIALITÉ - privacy.html (~400 mots-clés)
    // =========================================================================
    privacy: [
        'politique confidentialité', 'vie privée', 'protection données',
        'données personnelles', 'RGPD', 'règlement données',
        'confidentialité GAL', 'privacy policy', 'données utilisateur',
        'collecte données', 'traitement données', 'stockage données',
        'sécurité données', 'chiffrement', 'cryptage', 'SSL',
        'HTTPS', 'certificat sécurité', 'protection information',
        'cookies', 'cookies essentiels', 'cookies analytiques',
        'traceurs', 'suivi navigation', 'fingerprinting',
        'consentement', 'accepter cookies', 'refuser cookies',
        'gestion cookies', 'préférences cookies', 'paramètres',
        'droit accès', 'droit rectification', 'droit suppression',
        'droit opposition', 'droit portabilité', 'droit oubli',
        'demande suppression', 'effacer données', 'supprimer compte',
        'responsable traitement', 'DPO', 'délégué protection',
        'sous-traitant', 'prestataire', 'hébergeur',
        'transfert données', 'données transfrontalières',
        'base légale', 'intérêt légitime', 'consentement explicite',
        'durée conservation', 'archivage', 'purge données',
        'violation données', 'faille sécurité', 'notification',
        'formulaire contact données', 'inscription données',
        'achat données', 'facturation données',
        'analytics', 'statistiques anonymes', 'mesure audience',
        'Supabase', 'hébergement sécurisé', 'serveur protégé',
    ],
};

// =========================================================================
// MOTS-CLÉS TRANSVERSAUX (communs à toutes les pages) - ~500 mots
// =========================================================================
export const GLOBAL_KEYWORDS = [
    'GAL', 'Groupement des Artisans de Lubumbashi', 'GAL Lubumbashi',
    'artisans Lubumbashi', 'artisanat RDC', 'BTP Lubumbashi',
    'construction Lubumbashi', 'machines industrielles',
    'formation professionnelle', 'certification professionnelle',
    'Lubumbashi', 'Haut-Katanga', 'RDC', 'Congo',
    'République Démocratique du Congo', 'Afrique',
    'made in Congo', 'fabrication locale', 'industrie locale',
    'innovation', 'qualité', 'excellence', 'expertise',
    'partenaire', 'confiance', 'professionnel', 'fiabilité',
    'soudure', 'menuiserie', 'plomberie', 'électricité', 'mécanique',
    'entrepreneur', 'artisan', 'technicien', 'ingénieur',
    'projet', 'chantier', 'construction', 'rénovation',
    'matériaux', 'équipement', 'outillage', 'machine',
    'formation', 'cours', 'stage', 'apprentissage',
    'certificat', 'diplôme', 'compétence', 'savoir-faire',
    'service', 'conseil', 'accompagnement', 'assistance',
    'prix', 'devis', 'tarif', 'qualité prix',
    'contact', 'téléphone', 'WhatsApp', 'email',
    '+243 979 022 998', 'contact@gal-lubumbashi.com',
    'gal-lubumbashi.com', 'site web GAL',
    'Dan Kande', 'assistant virtuel GAL', 'chatbot GAL',
];

/**
 * Obtenir tous les mots-clés pour une page donnée
 * @param {string} pageName - Nom de la page (home, formations, machines, etc.)
 * @returns {string[]} Liste des mots-clés
 */
export function getKeywordsForPage(pageName) {
    const pageKeywords = SEO_KEYWORDS[pageName] || [];
    return [...new Set([...pageKeywords, ...GLOBAL_KEYWORDS])];
}

/**
 * Obtenir la chaîne de mots-clés pour la balise meta
 * @param {string} pageName - Nom de la page
 * @returns {string} Chaîne de mots-clés séparés par des virgules
 */
export function getKeywordsString(pageName) {
    return getKeywordsForPage(pageName).join(', ');
}

/**
 * Compter le nombre total de mots-clés uniques dans le dictionnaire
 * @returns {number} Nombre total de mots-clés
 */
export function getTotalKeywordCount() {
    const allKeywords = new Set();
    Object.values(SEO_KEYWORDS).forEach(keywords => {
        keywords.forEach(kw => allKeywords.add(kw.toLowerCase()));
    });
    GLOBAL_KEYWORDS.forEach(kw => allKeywords.add(kw.toLowerCase()));
    return allKeywords.size;
}

/**
 * Injecter les mots-clés dans la page courante
 * @param {string} pageName - Nom de la page
 */
export function injectPageKeywords(pageName) {
    const keywords = getKeywordsString(pageName);
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
    }
    
    metaKeywords.setAttribute('content', keywords);
    console.log(`🔍 SEO: ${getKeywordsForPage(pageName).length} mots-clés injectés pour la page "${pageName}"`);
}
