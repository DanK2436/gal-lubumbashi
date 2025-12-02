-- ================================================
-- DONNÉES D'EXEMPLE POUR TEST - GAL LUBUMBASHI
-- À exécuter APRÈS supabase-gal-complete.sql
-- ================================================

-- Ce script ajoute des données d'exemple pour tester immédiatement
-- votre site web. Vous pourrez les modifier ou supprimer plus tard.

-- ================================
-- VIDÉOS D'EXEMPLE
-- ================================

INSERT INTO videos (title, category, url, thumbnail, "durationSeconds", description) VALUES
(
    'Introduction à la Soudure à l''Arc',
    'Métallurgie',
    'https://www.youtube.com/watch?v=WXFnmEvmMOw',
    'https://img.youtube.com/vi/WXFnmEvmMOw/maxresdefault.jpg',
    480,
    'Découvrez les bases de la soudure à l''arc électrique. Ce tutoriel vous guidera à travers les techniques fondamentales.'
),
(
    'Installation Électrique Résidentielle',
    'Électricité',
    'https://www.youtube.com/watch?v=fJeRabV5hNU',
    'https://img.youtube.com/vi/fJeRabV5hNU/maxresdefault.jpg',
    720,
    'Guide complet pour réaliser une installation électrique résidentielle conforme aux normes de sécurité.'
),
(
    'Fabrication d''une Table en Bois',
    'Menuiserie',
    'https://www.youtube.com/watch?v=u5uzDxJrCmo',
    'https://img.youtube.com/vi/u5uzDxJrCmo/maxresdefault.jpg',
    900,
    'Apprenez à fabriquer une table en bois massif de A à Z avec des outils simples.'
),
(
    'Techniques de Plomberie Moderne',
    'Plomberie',
    'https://www.youtube.com/watch?v=Hw8C75ijaJQ',
    'https://img.youtube.com/vi/Hw8C75ijaJQ/maxresdefault.jpg',
    600,
    'Les meilleures pratiques en plomberie moderne pour installations résidentielles et commerciales.'
);

-- ================================
-- FORMATIONS D'EXEMPLE
-- ================================

INSERT INTO formations (title, description, level, duration, price, modules) VALUES
(
    'Formation Soudure TIG Professionnelle',
    'Formation complète en soudure TIG (Tungsten Inert Gas) pour débutants et intermédiaires. Apprenez les techniques professionnelles utilisées dans l''industrie. Certification officielle à la fin de la formation.',
    'Intermédiaire',
    '4 semaines',
    '200 USD',
    ARRAY[
        'Introduction à la soudure TIG et sécurité',
        'Équipement et matériaux',
        'Techniques de base et positions',
        'Soudure des métaux ferreux',
        'Soudure aluminium et acier inoxydable',
        'Pratique intensive et projet final',
        'Examen de certification'
    ]
),
(
    'Électricité Industrielle Avancée',
    'Maîtrisez les installations électriques industrielles triphasées. Formation intensive couvrant les schémas, normes, installation et dépannage. Idéale pour les professionnels souhaitant se spécialiser.',
    'Avancé',
    '6 semaines',
    '350 USD',
    ARRAY[
        'Normes électriques RDC et internationales',
        'Lecture de schémas électriques industriels',
        'Installations triphasées et tableaux',
        'Automatismes industriels de base',
        'Techniques de dépannage avancées',
        'Sécurité électrique en milieu industriel',
        'Projet d''installation complète'
    ]
),
(
    'Menuiserie et Ébénisterie Moderne',
    'Découvrez les techniques modernes de menuiserie et d''ébénisterie. De la conception au produit fini, apprenez à créer des meubles de qualité professionnelle.',
    'Débutant',
    '3 semaines',
    '150 USD',
    ARRAY[
        'Présentation des outils et sécurité',
        'Choix et préparation du bois',
        'Mesures, tracés et découpes précises',
        'Techniques d''assemblage traditionnelles',
        'Assemblages modernes (tourillons, dominos)',
        'Finitions et traitement du bois',
        'Projet pratique : création d''un meuble'
    ]
),
(
    'Plomberie Sanitaire Complète',
    'Formation pratique en plomberie sanitaire. Apprenez l''installation, la réparation et l''entretien des systèmes de plomberie résidentielle et commerciale.',
    'Intermédiaire',
    '4 semaines',
    '180 USD',
    ARRAY[
        'Outils et matériaux de plomberie',
        'Tuyauterie PVC, cuivre et multicouche',
        'Installation sanitaire complète',
        'Systèmes d''évacuation et ventilation',
        'Réparations courantes et dépannage',
        'Normes et réglementations',
        'Mise en pratique sur chantier école'
    ]
);

-- ================================
-- MACHINES D'EXEMPLE
-- ================================

INSERT INTO machines (name, slug, category, status, description, image, "priceRange", specs, "defaultWhatsAppMessage") VALUES
(
    'Batteuse à Maïs Professionnelle',
    'batteuse-mais-professionnelle',
    'Agroalimentaire',
    'Disponible',
    'Machine robuste de fabrication locale pour décortiquer le maïs. Haute capacité de traitement, idéale pour coopératives agricoles et producteurs. Moteur Honda fiable et économique en carburant.',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    '1500-2000 USD',
    jsonb_build_array(
        jsonb_build_object('label', 'Capacité', 'value', '500 kg/heure'),
        jsonb_build_object('label', 'Moteur', 'value', 'Honda 5.5 HP'),
        jsonb_build_object('label', 'Garantie', 'value', '12 mois'),
        jsonb_build_object('label', 'Fabrication', 'value', 'Made in Lubumbashi'),
        jsonb_build_object('label', 'Poids', 'value', '85 kg')
    ),
    'Bonjour, je suis intéressé par la Batteuse à Maïs Professionnelle. Est-elle disponible ?'
),
(
    'Rapeuse à Manioc Électrique',
    'rapeuse-manioc-electrique',
    'Agroalimentaire',
    'Disponible',
    'Rapeuse électrique pour manioc, haute performance. Idéale pour production de chikwangue et fufu. Construction robuste en acier inoxydable pour une hygiène optimale.',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    '1200-1600 USD',
    jsonb_build_array(
        jsonb_build_object('label', 'Capacité', 'value', '300 kg/heure'),
        jsonb_build_object('label', 'Moteur', 'value', '4 HP électrique'),
        jsonb_build_object('label', 'Matériau', 'value', 'Acier inoxydable'),
        jsonb_build_object('label', 'Garantie', 'value', '6 mois'),
        jsonb_build_object('label', 'Voltage', 'value', '220V/380V')
    ),
    'Bonjour, je suis intéressé par la Rapeuse à Manioc Électrique. Quel est le délai de livraison ?'
),
(
    'Bétonneuse 200 Litres',
    'betonneuse-200-litres',
    'Construction',
    'Disponible',
    'Bétonneuse professionnelle pour chantiers. Cuve basculante 200L, moteur diesel économique. Montée sur roues pour facilité de déplacement.',
    'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800',
    '800-1200 USD',
    jsonb_build_array(
        jsonb_build_object('label', 'Capacité', 'value', '200 litres'),
        jsonb_build_object('label', 'Moteur', 'value', 'Diesel 5 HP'),
        jsonb_build_object('label', 'Type', 'value', 'Cuve basculante'),
        jsonb_build_object('label', 'Poids', 'value', '120 kg'),
        jsonb_build_object('label', 'Mobilité', 'value', 'Sur roues')
    ),
    'Bonjour, je voudrais réserver la Bétonneuse 200 Litres pour mon chantier.'
),
(
    'Moule à Briques Semi-Automatique',
    'moule-briques-semi-automatique',
    'Construction',
    'Disponible',
    'Machine de production de briques et blocs en béton. Semi-automatique pour augmenter votre productivité. Capacité de 500 à 800 blocs par jour.',
    'https://images.unsplash.com/photo-1597476870704-8c9f9f0ec8bd?w=800',
    '2500-3200 USD',
    jsonb_build_array(
        jsonb_build_object('label', 'Production', 'value', '500-800 blocs/jour'),
        jsonb_build_object('label', 'Type', 'value', 'Semi-automatique'),
        jsonb_build_object('label', 'Formats', 'value', 'Multiples tailles'),
        jsonb_build_object('label', 'Moteur', 'value', 'Électrique 7.5 HP'),
        jsonb_build_object('label', 'Garantie', 'value', '18 mois')
    ),
    'Bonjour, je souhaite avoir plus d''informations sur le Moule à Briques Semi-Automatique.'
),
(
    'Tour à Métaux Conventionnel',
    'tour-metaux-conventionnel',
    'Sur Mesure',
    'Sur commande',
    'Tour à métaux de précision pour travaux d''usinage. Idéal pour fabrication de pièces sur mesure. Construction robuste garantissant précision et longévité.',
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
    'Sur devis',
    jsonb_build_array(
        jsonb_build_object('label', 'Type', 'value', 'Tour conventionnel'),
        jsonb_build_object('label', 'Distance pointes', 'value', '1000 mm'),
        jsonb_build_object('label', 'Diamètre tournage', 'value', '400 mm'),
        jsonb_build_object('label', 'Précision', 'value', '0.01 mm'),
        jsonb_build_object('label', 'Livraison', 'value', '4-6 semaines')
    ),
    'Bonjour, je voudrais un devis pour le Tour à Métaux Conventionnel.'
),
(
    'Presse Hydraulique Atelier',
    'presse-hydraulique-atelier',
    'Sur Mesure',
    'Sur commande',
    'Presse hydraulique pour atelier. Force de pressage réglable, idéale pour redressage, emboutissage et montage. Construction sur-mesure selon vos besoins.',
    'https://images.unsplash.com/photo-1586864387634-37a273f6aa7c?w=800',
    'Sur devis',
    jsonb_build_array(
        jsonb_build_object('label', 'Force', 'value', '20-50 tonnes'),
        jsonb_build_object('label', 'Type', 'value', 'Hydraulique'),
        jsonb_build_object('label', 'Personnalisation', 'value', 'Sur-mesure'),
        jsonb_build_object('label', 'Garantie', 'value', '12 mois'),
        jsonb_build_object('label', 'Délai', 'value', '6-8 semaines')
    ),
    'Bonjour, je cherche une Presse Hydraulique sur-mesure pour mon atelier.'
);

-- ================================
-- ARTICLES DE BLOG D'EXEMPLE
-- ================================

INSERT INTO blog_posts (title, slug, content, excerpt, author, category, tags, image, date) VALUES
(
    '10 Conseils Essentiels pour Débuter en Soudure',
    '10-conseils-debuter-soudure',
    E'# Introduction à la Soudure\n\nLa soudure est un métier fascinant qui allie technique, précision et créativité. Que vous soyez un artisan débutant ou que vous souhaitiez simplement vous initier à cet art, voici 10 conseils essentiels pour bien démarrer.\n\n## 1. La Sécurité Avant Tout\n\nNe négligez jamais votre équipement de protection :\n- Masque de soudure avec filtre adapté\n- Gants en cuir épais\n- Chaussures de sécurité\n- Vêtements en coton (pas de synthétique)\n- Tablier de cuir\n\n## 2. Choisir le Bon Équipement\n\nPour débuter, un poste à souder à l''arc (MMA) est idéal :\n- Moins coûteux que le TIG ou MIG\n- Polyvalent et robuste\n- Facile à apprendre\n\n## 3. Pratiquer Régulièrement\n\nLa soudure est une question de pratique. Consacrez au moins 2-3 heures par semaine à vous exercer.\n\n## 4. Comprendre les Métaux\n\nChaque métal a ses spécificités :\n- **Acier doux** : Le plus facile pour débuter\n- **Acier inoxydable** : Demande plus de précision\n- **Aluminium** : Nécessite un équipement TIG\n\n## 5. Maîtriser la Température\n\nLe réglage de l''intensité est crucial. Trop faible : pas de fusion. Trop forte : perçage du métal.\n\n## 6. Nettoyer les Surfaces\n\nToujours nettoyer et décaper les pièces à souder. La rouille, la peinture ou l''huile compromettent la qualité.\n\n## 7. Choisir le Bon Procédé\n\n- **Soudure à l''arc (MMA)** : Polyvalente, pour débutants\n- **MIG/MAG** : Rapide, pour production\n- **TIG** : Précise, pour travaux fins\n\n## 8. Respecter les Normes\n\nFormez-vous aux normes de sécurité locales et internationales.\n\n## 9. Apprendre de ses Erreurs\n\nChaque soudure ratée est une leçon. Analysez vos défauts pour progresser.\n\n## 10. Se Former Continuellement\n\nLe métier évolue. Participez à des formations, regardez des tutoriels, échangez avec d''autres soudeurs.\n\n---\n\n## Conclusion\n\nAu GAL, nous proposons des formations complètes en soudure adaptées à tous les niveaux. N''hésitez pas à nous contacter pour plus d''informations !',
    'Découvrez les 10 conseils indispensables pour bien débuter dans le monde de la soudure professionnelle. De la sécurité à la pratique, tout ce qu''il faut savoir.',
    'Jean Kabamba',
    'Tutoriels',
    ARRAY['soudure', 'débutant', 'conseils', 'sécurité', 'métallurgie'],
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1000',
    NOW() - INTERVAL '5 days'
),
(
    'Les Innovations Machines 2025 : Ce Qui Change',
    'innovations-machines-2025',
    E'# Les Machines Industrielles en 2025\n\nL''année 2025 marque un tournant dans l''industrie des machines agricoles et industrielles, particulièrement en République Démocratique du Congo.\n\n## Tendances Principales\n\n### 1. Automatisation Accrue\n\nLes machines deviennent progressivement plus \"intelligentes\" :\n- Systèmes de contrôle électroniques\n- Capteurs de performance\n- Optimisation automatique\n\n### 2. Économie d''Énergie\n\nLes nouveaux moteurs sont jusqu''à 30% plus efficaces :\n- Consommation réduite\n- Moins d''émissions\n- Meilleure rentabilité\n\n### 3. Maintenance Simplifiée\n\nConception modulaire facilitant :\n- Remplacement rapide des pièces\n- Diagnostic simplifié\n- Coûts d''entretien réduits\n\n### 4. Fabrication Locale\n\nLe \"Made in Lubumbashi\" gagne en qualité :\n- Prix plus compétitifs\n- Pièces de rechange disponibles\n- Support technique local\n\n## Nos Nouveautés 2025\n\nAu GAL, nous avons développé :\n- Nouvelle gamme de batteuses à maïs\n- Rapeuses à manioc améliorées\n- Bétonneuses ultra-robustes\n\n## Prix et Accessibilité\n\nGrâce à la production locale et aux économies d''échelle, les prix restent compétitifs tout en améliorant la qualité.\n\n---\n\nContactez-nous pour découvrir notre catalogue 2025 !',
    'Tour d''horizon des principales innovations en matière de machines industrielles et agricoles pour 2025. Automatisation, économie et fabrication locale.',
    'Marie Tshisekedi',
    'Actualités',
    ARRAY['machines', 'innovation', '2025', 'agriculture', 'industrie'],
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1000',
    NOW() - INTERVAL '2 days'
),
(
    'Guide Complet : Comment Choisir Sa Machine Agricole',
    'guide-choisir-machine-agricole',
    E'# Guide d''Achat de Machine Agricole\n\nChoisir la bonne machine agricole est une décision cruciale pour la rentabilité de votre exploitation. Voici un guide complet pour faire le bon choix.\n\n## 1. Évaluer Vos Besoins Réels\n\n### Questions à se poser :\n- Quelle quantité dois-je traiter quotidiennement ?\n- Combien d''heures d''utilisation par jour ?\n- Utilisation saisonnière ou toute l''année ?\n- Production pour vente ou transformation ?\n\n## 2. Définir Votre Budget\n\n### Coûts à considérer :\n- **Prix d''achat** : 1200-3000 USD selon la machine\n- **Installation** : Prévoir 5-10% du prix\n- **Formation** : Optionnelle mais recommandée\n- **Maintenance annuelle** : Environ 10% du prix\n\n### Options de financement :\n- Paiement comptant avec réduction\n- Paiement échelonné (selon conditions)\n- Crédit via partenaires financiers\n\n## 3. Adapter la Capacité\n\n| Production | Capacité Recommandée | Machine Type |\n|------------|---------------------|---------------|\n| Petite (0-200kg/j) | 100-300 kg/h | Modèle standard |\n| Moyenne (200-500kg/j) | 300-500 kg/h | Modèle renforcé |\n| Grande (+500kg/j) | 500+ kg/h | Modèle industriel |\n\n## 4. Vérifier la Disponibilité des Pièces\n\n### Points essentiels :\n- Pièces disponibles localement ?\n- Temps de livraison des pièces\n- Coût des pièces de remplacement\n- Existence d''alternatives compatibles\n\n## 5. Garantie et Service Après-Vente\n\n### Ce qu''il faut exiger :\n- **Garantie minimale** : 6-12 mois\n- **SAV local** : Techniciens à Lubumbashi\n- **Hotline** : Support téléphonique\n- **Visites** : Maintenances périodiques\n\n## 6. Type de Moteur\n\n### Électrique vs Thermique :\n\n**Moteur Électrique :**\n- ✅ Moins de maintenance\n- ✅ Coût d''utilisation réduit\n- ❌ Nécessite électricité stable\n- ❌ Moins mobile\n\n**Moteur Thermique (Essence/Diesel) :**\n- ✅ Autonome\n- ✅ Mobile\n- ❌ Plus de maintenance\n- ❌ Coût carburant\n\n## 7. Tester Avant d''Acheter\n\nAu GAL, nous vous proposons :\n- Démonstrations gratuites\n- Essais sur vos propres produits\n- Formation initiale gratuite\n\n## 8. Vérifier la Robustesse\n\n### Points de contrôle :\n- Épaisseur du métal\n- Qualité des soudures\n- Finition anti-corrosion\n- Qualité des roulements\n\n## Conclusion\n\nUn bon investissement en machine agricole se rentabilise en 12-18 mois. Prenez le temps de bien choisir !\n\n---\n\n**Contactez le GAL pour une consultation gratuite et personnalisée.**',
    'Guide pratique et détaillé pour choisir la machine agricole parfaitement adaptée à vos besoins et votre budget. Tous nos conseils d''experts.',
    'Paul Mwamba',
    'Conseils',
    ARRAY['agriculture', 'machines', 'guide', 'achat', 'agroalimentaire'],
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1000',
    NOW() - INTERVAL '7 days'
),
(
    'Entretien des Machines : 5 Erreurs à Éviter',
    'entretien-machines-erreurs-eviter',
    E'# Entretien des Machines : Les 5 Erreurs Fatales\n\nUne machine bien entretenue peut durer 10-15 ans. Mal entretenue, elle ne tiendra pas 2 ans. Voici les 5 erreurs les plus courantes et comment les éviter.\n\n## Erreur #1 : Négliger la Lubrification\n\n### Pourquoi c''est grave :\n- Usure prématurée des pièces mobiles\n- Surchauffe du moteur\n- Risque de grippage\n\n### Solution :\n- Lubrification **hebdomadaire** minimum\n- Utiliser l''huile recommandée\n- Graisser tous les points prévus\n\n## Erreur #2 : Ignorer les Bruits Anormaux\n\n### Signes d''alerte :\n- Grincements\n- Vibrations inhabituelles\n- Claquements\n\n### Action :\n1. Arrêter immédiatement la machine\n2. Identifier la source du bruit\n3. Appeler un technicien si nécessaire\n\n## Erreur #3 : Ne Pas Nettoyer Régulièrement\n\n### Conséquences :\n- Accumulation de poussière → surchauffe\n- Residus → blocages\n- Corrosion accélérée\n\n### Routine de nettoyage :\n- **Quotidien** : Dépoussiérage et nettoyage de base\n- **Hebdomadaire** : Nettoyage complet\n- **Mensuel** : Nettoyage en profondeur\n\n## Erreur #4 : Utiliser des Pièces Non-Conformes\n\n### Dangers :\n- Performance réduite\n- Risque de casse\n- Annulation de garantie\n\n### Recommandations :\n- Acheter chez des fournisseurs agréés\n- Vérifier la compatibilité\n- Privilégier pièces d''origine\n\n## Erreur #5 : Surcharger la Machine\n\n### Exemple concret :\nUne batteuse de 500 kg/h forcée à 700 kg/h :\n- Usure 3x plus rapide\n- Risque de casse du moteur\n- Mauvaise qualité du travail\n\n### Bonne pratique :\nRespecter les capacités indiquées (même rester 10% en dessous)\n\n---\n\n## Bonus : Planning d''Entretien Type\n\n### Quotidien :\n- Vérification visuelle\n- Nettoyage de surface\n- Test de fonctionnement\n\n### Hebdomadaire :\n- Lubrification complète\n- Nettoyage approfondi\n- Vérification serrages\n\n### Mensuel :\n- Contrôle moteur\n- Inspection courroies/chaînes\n- Test performance\n\n### Annuel :\n- Révision complète\n- Remplacement pièces d''usure\n- Mise à jour si nécessaire\n\n---\n\n**Le SAV du GAL propose des contrats d''entretien préventif. Contactez-nous !**',
    'Les 5 erreurs d''entretien qui réduisent drastiquement la durée de vie de vos machines. Apprenez à les éviter et prolongez leur utilisation.',
    'David Mukendi',
    'Conseils',
    ARRAY['entretien', 'maintenance', 'machines', 'durabilité', 'SAV'],
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000',
    NOW() - INTERVAL '10 days'
);

-- ================================
-- VÉRIFICATION DES DONNÉES
-- ================================

-- Compter les enregistrements ajoutés
DO $$
DECLARE
    v_videos INT;
    v_formations INT;
    v_machines INT;
    v_blog INT;
BEGIN
    SELECT COUNT(*) INTO v_videos FROM videos;
    SELECT COUNT(*) INTO v_formations FROM formations;
    SELECT COUNT(*) INTO v_machines FROM machines;
    SELECT COUNT(*) INTO v_blog FROM blog_posts;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ DONNÉES D''EXEMPLE AJOUTÉES !';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Résumé :';
    RAISE NOTICE '   - % vidéos ajoutées', v_videos;
    RAISE NOTICE '   - % formations ajoutées', v_formations;
    RAISE NOTICE '   - % machines ajoutées', v_machines;
    RAISE NOTICE '   - % articles de blog ajoutés', v_blog;
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Vous pouvez maintenant :';
    RAISE NOTICE '   1. Voir les vidéos sur /html/videos.html';
    RAISE NOTICE '   2. Voir les formations sur /html/formations.html';
    RAISE NOTICE '   3. Voir les machines sur /html/machines.html';
    RAISE NOTICE '   4. Voir le blog sur /html/blog.html';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Modifier ces données dans l''admin :';
    RAISE NOTICE '   👉 /admin/index.html';
    RAISE NOTICE '';
END $$;

-- Afficher un aperçu
SELECT '=== VIDÉOS ===' as section, title, category FROM videos
UNION ALL
SELECT '=== FORMATIONS ===', title, level FROM formations
UNION ALL
SELECT '=== MACHINES ===', name, category FROM machines
UNION ALL
SELECT '=== BLOG ===', title, category FROM blog_posts;
