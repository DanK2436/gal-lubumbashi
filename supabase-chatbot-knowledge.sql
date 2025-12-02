-- Table pour la base de connaissances du chatbot
CREATE TABLE IF NOT EXISTS chatbot_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tag VARCHAR(255) NOT NULL UNIQUE,
    patterns JSONB NOT NULL DEFAULT '[]'::jsonb, -- Liste des phrases déclencheurs
    responses JSONB NOT NULL DEFAULT '[]'::jsonb, -- Liste des réponses possibles
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE chatbot_knowledge ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire (pour que le chatbot fonctionne pour les visiteurs)
CREATE POLICY "Lecture publique chatbot knowledge" ON chatbot_knowledge FOR SELECT USING (true);

-- Politique : Seuls les admins peuvent modifier (à affiner selon vos besoins d'auth)
-- Pour l'instant, on laisse ouvert pour faciliter l'insertion initiale si faite via l'API, 
-- mais idéalement via le dashboard Supabase ou un admin authentifié.
CREATE POLICY "Ecriture admin chatbot knowledge" ON chatbot_knowledge FOR ALL USING (true) WITH CHECK (true);

-- Insertion des données initiales
INSERT INTO chatbot_knowledge (tag, patterns, responses) VALUES
(
    'salutation',
    '["Bonjour", "Salut", "Bonsoir", "Il y a quelqu''un ?", "Allô", "Hello GAL", "J''aimerais parler à un conseiller", "Je peux poser une question ?"]'::jsonb,
    '["Bonjour ! Bienvenue chez GAL (Groupement des Artisans de Lubumbashi). Je suis votre assistant virtuel. Comment puis-je vous aider aujourd''hui ?"]'::jsonb
),
(
    'identite_entreprise',
    '["Qui êtes-vous ?", "Présentez l''entreprise", "C''est quoi GAL ?", "Depuis quand existez-vous ?", "Histoire du GAL", "Qui sont les fondateurs ?", "Quel est l''effectif ?", "GAL est basé où ?"]'::jsonb,
    '["Le Groupement des Artisans de Lubumbashi (GAL) est un atelier local fondé en **Juin 2025** par trois **ingénieurs civils de Lubumbashi**. Nous regroupons plus de 20 membres passionnés."]'::jsonb
),
(
    'mission_vision',
    '["Quelle est votre mission ?", "Votre vision ?", "Pourquoi choisir GAL ?", "Qu''est-ce qui vous distingue de la concurrence ?", "Vos valeurs", "Parlez-moi de l''avantage local", "Le Made in RDC ?"]'::jsonb,
    '["Notre mission est de fournir des solutions mécaniques fiables ''Made in Lubumbashi'' pour accélérer votre productivité. Choisir GAL, c''est la **robustesse garantie** et le **service de proximité**."]'::jsonb
),
(
    'contact_info',
    '["Où êtes-vous situés ?", "Donnez-moi votre adresse", "Numéro de téléphone", "Email du service commercial", "Comment vous joindre ?", "Adresse du siège social à Lubumbashi", "Je veux appeler GAL", "J''aimerais envoyer un mail"]'::jsonb,
    '["Nous sommes basés à **Lubumbashi, RDC**. Vous pouvez nous contacter au **+243 979 022 998** ou par email à **contact@gal-lubumbashi.com**."]'::jsonb
),
(
    'produits_agro',
    '["Machines agricoles", "Je cherche une **batteuse à maïs**", "**Rapeuse à manioc**", "**Presse à huile**", "Matériel pour l''agriculture", "Équipements agroalimentaires", "Machines pour augmenter les rendements"]'::jsonb,
    '["Pour l''agroalimentaire, nous fabriquons des équipements comme les **Batteuses à Maïs**, **Rapeuses à Manioc** et **Presses à Huile**. Ces machines vous garantissent une efficacité maximale."]'::jsonb
),
(
    'produits_construction',
    '["Matériel de construction", "**Moule brique**", "**Moule bloc**", "**Moule pour buses**", "Brouettes renforcées", "Équipement chantier", "Besoin d''un moule en béton"]'::jsonb,
    '["Pour la construction, nous proposons des équipements conçus pour durer : **Moules pour Briques/Blocs**, **Moules pour Buses en Béton** et des **Brouettes Renforcées**."]'::jsonb
),
(
    'services_sur_mesure',
    '["Faites-vous du sur mesure ?", "Fabrication spéciale", "**Soudure**", "**Réparation industrielle**", "Je veux commander une machine spécifique", "Conception d''outils", "Coffrets métalliques", "Pétrins"]'::jsonb,
    '["Oui, la fabrication **sur-mesure** est notre spécialité. Nos ingénieurs peuvent concevoir l''outil parfait. Nous offrons aussi des services de **soudure et réparation industrielle**."]'::jsonb
),
(
    'adhesion_info',
    '["Comment devenir membre ?", "Je suis artisan, je veux rejoindre", "Condition d''adhésion", "C''est pour qui le GAL ?", "Processus d''adhésion", "Contact pour adhésion"]'::jsonb,
    '["Pour devenir membre, vous devez être un **artisan actif dans la région de Lubumbashi**. Contactez-nous via le formulaire de contact ou **WhatsApp** pour démarrer le processus d''adhésion."]'::jsonb
),
(
    'adhesion_prix',
    '["Combien coûte l''adhésion ?", "Prix de la cotisation annuelle", "Frais annuels membre", "Montant de la cotisation"]'::jsonb,
    '["La cotisation annuelle est de **50 USD**. Ce montant donne accès à tous les services et avantages du GAL."]'::jsonb
),
(
    'adhesion_avantages',
    '["Pourquoi devenir membre ?", "Avantages de l''adhésion", "Qu''est-ce que je gagne à être membre ?", "Prix réduits machines", "Accès au réseau professionnel"]'::jsonb,
    '["Les membres bénéficient de **prix réduits** sur les machines et formations, d''un accès prioritaire aux opportunités, d''un **réseau professionnel** étendu et d''une **certification reconnue**."]'::jsonb
),
(
    'formations_general',
    '["Proposez-vous des formations ?", "Apprendre un métier", "Type de formation disponible", "Les formations sont-elles certifiées ?", "Durée des formations"]'::jsonb,
    '["Oui, nous offrons des formations certifiées dont la durée varie de **quelques jours pour les modules courts à plusieurs semaines** pour les cursus complets."]'::jsonb
),
(
    'formations_reduction',
    '["Puis-je suivre une formation sans être membre ?", "Tarifs pour les non-membres", "Réduction formation membre", "Avantage de prix sur les formations"]'::jsonb,
    '["Oui, les formations sont ouvertes à tous. Cependant, les membres bénéficient de **tarifs préférentiels allant jusqu''à 30% de réduction**."]'::jsonb
),
(
    'cgv_devis_commande',
    '["Validité du devis", "Comment commander une machine ?", "Engagement commande", "Avenant travaux", "Le devis est valable combien de temps ?"]'::jsonb,
    '["Le devis est valable pour une durée de **30 jours calendaires**. La commande est ferme après la signature du devis et le versement de l''acompte (CGV, Art 2)."]'::jsonb
),
(
    'cgv_paiement',
    '["Modalités de paiement", "**Acompte**", "Puis-je payer en francs ?", "Quand payer le solde ?", "Retard de paiement", "Pénalités de retard", "Pourcentage d''acompte"]'::jsonb,
    '["Un acompte de **30%** du montant total est requis à la signature. Le solde est dû à la Réception des Travaux. Nous acceptons les **USD** ou les **CDF** selon le taux en vigueur."]'::jsonb
),
(
    'cgv_retard_paiement',
    '["Que se passe-t-il si je paie en retard ?", "Intérêts de retard", "Suspension des travaux pour non-paiement"]'::jsonb,
    '["Tout retard de paiement entraîne la **suspension immédiate des travaux** et l''application de **pénalités** calculées au taux d''intérêt légal de la Banque Centrale du Congo majoré de 5 points."]'::jsonb
),
(
    'cgv_delais',
    '["Délais d''exécution", "Quand sera-ce prêt ?", "Retard de livraison", "Suspension des délais", "Force majeure délais"]'::jsonb,
    '["Les délais sont indicatifs. Ils sont prolongés en cas de défaut de paiement, modification des travaux, **cas de force majeure** (intempéries, pénurie) ou retard du client à fournir l''accès au site."]'::jsonb
),
(
    'cgv_reception_travaux',
    '["Comment se passe la réception ?", "Procès-verbal de Réception", "Qui valide l''achèvement des travaux ?"]'::jsonb,
    '["Les travaux sont réceptionnés par la signature d''un **Procès-Verbal de Réception (PV)** qui valide officiellement l''achèvement (CGV, Art 5)."]'::jsonb
),
(
    'cgv_garantie_main_oeuvre',
    '["Garantie légale", "Garantie main d''oeuvre", "Durée de la garantie des travaux", "Que couvre la garantie sur la main-d’œuvre ?"]'::jsonb,
    '["Nous offrons une garantie sur la **main-d’œuvre d’une durée de 6 mois** à compter de la date de réception, hors usure normale ou intervention de tiers sur l''ouvrage réalisé."]'::jsonb
),
(
    'cgv_juridiction',
    '["J''ai un litige juridique", "Quel est le tribunal compétent ?", "Où régler les désaccords légaux ?"]'::jsonb,
    '["Tout litige sera soumis à la compétence exclusive du **Tribunal de Commerce de Lubumbashi (RDC)** (CGV, Art 6)."]'::jsonb
),
(
    'confidentialite_collecte',
    '["Quelles données collectez-vous ?", "Pourquoi vous voulez mon numéro ?", "Collecte d''information", "Liste des données collectées"]'::jsonb,
    '["Nous collectons uniquement les informations fournies volontairement et strictement nécessaires : **Nom, Prénoms, Dénomination sociale, Numéro de téléphone, Adresse e-mail**, et **Adresse physique du chantier**."]'::jsonb
),
(
    'confidentialite_usage',
    '["Que faites-vous de mes données ?", "Vendez-vous mes données ?", "Utilisation des informations personnelles", "Transfert de données à des tiers"]'::jsonb,
    '["Vos informations servent exclusivement à la gestion commerciale (devis) et à l''exécution du contrat. Le GAL s''engage à **ne jamais vendre** ou céder vos données à des tiers externes."]'::jsonb
),
(
    'confidentialite_securite',
    '["Mes données sont-elles en sécurité ?", "Protection des informations", "Qui a accès à mes données ?"]'::jsonb,
    '["Nous mettons en œuvre des mesures de sécurité professionnelles. L''accès aux données est strictement limité au personnel autorisé (Direction, Commercial et Chefs de Chantier) dans le cadre de leurs fonctions."]'::jsonb
),
(
    'confidentialite_droit_acces',
    '["Supprimer mes données", "Droit d''accès", "Combien de temps gardez-vous mes infos ?", "Droit de rectification"]'::jsonb,
    '["Vos données sont conservées pour une période de suivi et de garantie de **3 ans après l''achèvement des travaux**. Vous disposez d’un droit d''accès, de rectification et de suppression."]'::jsonb
),
(
    'sav_garantie_machine',
    '["Service après-vente", "Garantie machine", "Pièces de rechange", "Si la machine tombe en panne", "Que couvre la garantie ?", "Durée de la garantie constructeur"]'::jsonb,
    '["Nous offrons un SAV complet et une garantie de **1 à 2 ans** selon la machine (couvre les défauts de fabrication et pièces mécaniques principales, mais pas l''usure normale ou la mauvaise utilisation)."]'::jsonb
),
(
    'facilites_paiement',
    '["Paiement échelonné", "Facilités de paiement pour les machines", "Payer en plusieurs fois", "Proposez-vous un crédit ?"]'::jsonb,
    '["Oui, nous proposons des solutions de **paiement échelonné** pour l''achat de machines. Les modalités sont définies au cas par cas en fonction du montant et de votre profil. Contactez-nous pour discuter des options."]'::jsonb
),
(
    'showroom_occasion',
    '["Voir les machines avant d''acheter", "Showroom", "Machine d''occasion", "Machines seconde main", "Machines neuves ou d''occasion ?"]'::jsonb,
    '["Nous proposons principalement des machines neuves avec garantie constructeur. Nous avons aussi une sélection de machines d''occasion révisées. Vous êtes invité à visiter notre showroom sur rendez-vous pour voir et tester les machines !"]'::jsonb
)
ON CONFLICT (tag) DO UPDATE SET
patterns = EXCLUDED.patterns,
responses = EXCLUDED.responses;
