
/**
 * Chatbot intelligent pour GAL
 * Comprend le contexte, détecte plusieurs intentions et répond de manière naturelle et humaine
 * Accède aux données réelles du site pour des réponses personnalisées
 */

import { t } from './i18n.js';
import {
    getMachines,
    getFormations,
    getBlogPosts,
    createChatbotConversation,
    addMessageToConversation
} from './storage.js';

// Intentions et Base de Connaissances
const intents = [
    {
        "tag": "salutation",
        "patterns": [
            "Bonjour", "Salut", "Bonsoir", "Il y a quelqu'un ?", "Allô",
            "Hello GAL", "J'aimerais parler à un conseiller", "Je peux poser une question ?"
        ],
        "responses": ["Bonjour ! Bienvenue chez GAL (Groupement des Artisans de Lubumbashi). Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?"]
    },
    {
        "tag": "identite_entreprise",
        "patterns": [
            "Qui êtes-vous ?", "Présentez l'entreprise", "C'est quoi GAL ?", "Depuis quand existez-vous ?",
            "Histoire du GAL", "Qui sont les fondateurs ?", "Quel est l'effectif ?", "GAL est basé où ?"
        ],
        "responses": ["Le Groupement des Artisans de Lubumbashi (GAL) est un atelier local fondé en **Juin 2025** par trois **ingénieurs civils de Lubumbashi**. Nous regroupons plus de 20 membres passionnés."]
    },
    {
        "tag": "mission_vision",
        "patterns": [
            "Quelle est votre mission ?", "Votre vision ?", "Pourquoi choisir GAL ?", "Qu'est-ce qui vous distingue de la concurrence ?",
            "Vos valeurs", "Parlez-moi de l'avantage local", "Le Made in RDC ?"
        ],
        "responses": ["Notre mission est de fournir des solutions mécaniques fiables 'Made in Lubumbashi' pour accélérer votre productivité. Choisir GAL, c'est la **robustesse garantie** et le **service de proximité**."]
    },
    {
        "tag": "contact_info",
        "patterns": [
            "Où êtes-vous situés ?", "Donnez-moi votre adresse", "Numéro de téléphone", "Email du service commercial",
            "Comment vous joindre ?", "Adresse du siège social à Lubumbashi", "Je veux appeler GAL", "J'aimerais envoyer un mail"
        ],
        "responses": ["Nous sommes basés à **Lubumbashi, RDC**. Vous pouvez nous contacter au **+243 979 022 998** ou par email à **contact@gal-lubumbashi.com**."]
    },
    {
        "tag": "produits_agro",
        "patterns": [
            "Machines agricoles", "Je cherche une **batteuse à maïs**", "**Rapeuse à manioc**", "**Presse à huile**",
            "Matériel pour l'agriculture", "Équipements agroalimentaires", "Machines pour augmenter les rendements"
        ],
        "responses": ["Pour l'agroalimentaire, nous fabriquons des équipements comme les **Batteuses à Maïs**, **Rapeuses à Manioc** et **Presses à Huile**. Ces machines vous garantissent une efficacité maximale."]
    },
    {
        "tag": "produits_construction",
        "patterns": [
            "Matériel de construction", "**Moule brique**", "**Moule bloc**", "**Moule pour buses**",
            "Brouettes renforcées", "Équipement chantier", "Besoin d'un moule en béton"
        ],
        "responses": ["Pour la construction, nous proposons des équipements conçus pour durer : **Moules pour Briques/Blocs**, **Moules pour Buses en Béton** et des **Brouettes Renforcées**."]
    },
    {
        "tag": "services_sur_mesure",
        "patterns": [
            "Faites-vous du sur mesure ?", "Fabrication spéciale", "**Soudure**", "**Réparation industrielle**",
            "Je veux commander une machine spécifique", "Conception d'outils", "Coffrets métalliques", "Pétrins"
        ],
        "responses": ["Oui, la fabrication **sur-mesure** est notre spécialité. Nos ingénieurs peuvent concevoir l'outil parfait. Nous offrons aussi des services de **soudure et réparation industrielle**."]
    },
    {
        "tag": "adhesion_info",
        "patterns": [
            "Comment devenir membre ?", "Je suis artisan, je veux rejoindre", "Condition d'adhésion",
            "C'est pour qui le GAL ?", "Processus d'adhésion", "Contact pour adhésion"
        ],
        "responses": ["Pour devenir membre, vous devez être un **artisan actif dans la région de Lubumbashi**. Contactez-nous via le formulaire de contact ou **WhatsApp** pour démarrer le processus d'adhésion."]
    },
    {
        "tag": "adhesion_prix",
        "patterns": [
            "Combien coûte l'adhésion ?", "Prix de la cotisation annuelle", "Frais annuels membre",
            "Montant de la cotisation"
        ],
        "responses": ["La cotisation annuelle est de **50 USD**. Ce montant donne accès à tous les services et avantages du GAL."]
    },
    {
        "tag": "adhesion_avantages",
        "patterns": [
            "Pourquoi devenir membre ?", "Avantages de l'adhésion", "Qu'est-ce que je gagne à être membre ?",
            "Prix réduits machines", "Accès au réseau professionnel"
        ],
        "responses": ["Les membres bénéficient de **prix réduits** sur les machines et formations, d'un accès prioritaire aux opportunités, d'un **réseau professionnel** étendu et d'une **certification reconnue**."]
    },
    {
        "tag": "formations_general",
        "patterns": [
            "Proposez-vous des formations ?", "Apprendre un métier", "Type de formation disponible",
            "Les formations sont-elles certifiées ?", "Durée des formations"
        ],
        "responses": ["Oui, nous offrons des formations certifiées dont la durée varie de **quelques jours pour les modules courts à plusieurs semaines** pour les cursus complets."]
    },
    {
        "tag": "formations_reduction",
        "patterns": [
            "Puis-je suivre une formation sans être membre ?", "Tarifs pour les non-membres",
            "Réduction formation membre", "Avantage de prix sur les formations"
        ],
        "responses": ["Oui, les formations sont ouvertes à tous. Cependant, les membres bénéficient de **tarifs préférentiels allant jusqu'à 30% de réduction**."]
    },
    {
        "tag": "cgv_devis_commande",
        "patterns": [
            "Validité du devis", "Comment commander une machine ?", "Engagement commande", "Avenant travaux",
            "Le devis est valable combien de temps ?"
        ],
        "responses": ["Le devis est valable pour une durée de **30 jours calendaires**. La commande est ferme après la signature du devis et le versement de l'acompte (CGV, Art 2)."]
    },
    {
        "tag": "cgv_paiement",
        "patterns": [
            "Modalités de paiement", "**Acompte**", "Puis-je payer en francs ?", "Quand payer le solde ?",
            "Retard de paiement", "Pénalités de retard", "Pourcentage d'acompte"
        ],
        "responses": ["Un acompte de **30%** du montant total est requis à la signature. Le solde est dû à la Réception des Travaux. Nous acceptons les **USD** ou les **CDF** selon le taux en vigueur."]
    },
    {
        "tag": "cgv_retard_paiement",
        "patterns": [
            "Que se passe-t-il si je paie en retard ?", "Intérêts de retard", "Suspension des travaux pour non-paiement"
        ],
        "responses": ["Tout retard de paiement entraîne la **suspension immédiate des travaux** et l'application de **pénalités** calculées au taux d'intérêt légal de la Banque Centrale du Congo majoré de 5 points."]
    },
    {
        "tag": "cgv_delais",
        "patterns": [
            "Délais d'exécution", "Quand sera-ce prêt ?", "Retard de livraison", "Suspension des délais",
            "Force majeure délais"
        ],
        "responses": ["Les délais sont indicatifs. Ils sont prolongés en cas de défaut de paiement, modification des travaux, **cas de force majeure** (intempéries, pénurie) ou retard du client à fournir l'accès au site."]
    },
    {
        "tag": "cgv_reception_travaux",
        "patterns": [
            "Comment se passe la réception ?", "Procès-verbal de Réception", "Qui valide l'achèvement des travaux ?"
        ],
        "responses": ["Les travaux sont réceptionnés par la signature d'un **Procès-Verbal de Réception (PV)** qui valide officiellement l'achèvement (CGV, Art 5)."]
    },
    {
        "tag": "cgv_garantie_main_oeuvre",
        "patterns": [
            "Garantie légale", "Garantie main d'oeuvre", "Durée de la garantie des travaux",
            "Que couvre la garantie sur la main-d’œuvre ?"
        ],
        "responses": ["Nous offrons une garantie sur la **main-d’œuvre d’une durée de 6 mois** à compter de la date de réception, hors usure normale ou intervention de tiers sur l'ouvrage réalisé."]
    },
    {
        "tag": "cgv_juridiction",
        "patterns": [
            "J'ai un litige juridique", "Quel est le tribunal compétent ?", "Où régler les désaccords légaux ?"
        ],
        "responses": ["Tout litige sera soumis à la compétence exclusive du **Tribunal de Commerce de Lubumbashi (RDC)** (CGV, Art 6)."]
    },
    {
        "tag": "confidentialite_collecte",
        "patterns": [
            "Quelles données collectez-vous ?", "Pourquoi vous voulez mon numéro ?", "Collecte d'information",
            "Liste des données collectées"
        ],
        "responses": ["Nous collectons uniquement les informations fournies volontairement et strictement nécessaires : **Nom, Prénoms, Dénomination sociale, Numéro de téléphone, Adresse e-mail**, et **Adresse physique du chantier**."]
    },
    {
        "tag": "confidentialite_usage",
        "patterns": [
            "Que faites-vous de mes données ?", "Vendez-vous mes données ?", "Utilisation des informations personnelles",
            "Transfert de données à des tiers"
        ],
        "responses": ["Vos informations servent exclusivement à la gestion commerciale (devis) et à l'exécution du contrat. Le GAL s'engage à **ne jamais vendre** ou céder vos données à des tiers externes."]
    },
    {
        "tag": "confidentialite_securite",
        "patterns": [
            "Mes données sont-elles en sécurité ?", "Protection des informations", "Qui a accès à mes données ?"
        ],
        "responses": ["Nous mettons en œuvre des mesures de sécurité professionnelles. L'accès aux données est strictement limité au personnel autorisé (Direction, Commercial et Chefs de Chantier) dans le cadre de leurs fonctions."]
    },
    {
        "tag": "confidentialite_droit_acces",
        "patterns": [
            "Supprimer mes données", "Droit d'accès", "Combien de temps gardez-vous mes infos ?",
            "Droit de rectification"
        ],
        "responses": ["Vos données sont conservées pour une période de suivi et de garantie de **3 ans après l'achèvement des travaux**. Vous disposez d’un droit d'accès, de rectification et de suppression."]
    },
    {
        "tag": "sav_garantie_machine",
        "patterns": [
            "Service après-vente", "Garantie machine", "Pièces de rechange", "Si la machine tombe en panne",
            "Que couvre la garantie ?", "Durée de la garantie constructeur"
        ],
        "responses": ["Nous offrons un SAV complet et une garantie de **1 à 2 ans** selon la machine (couvre les défauts de fabrication et pièces mécaniques principales, mais pas l'usure normale ou la mauvaise utilisation)."]
    },
    {
        "tag": "facilites_paiement",
        "patterns": [
            "Paiement échelonné", "Facilités de paiement pour les machines", "Payer en plusieurs fois",
            "Proposez-vous un crédit ?"
        ],
        "responses": ["Oui, nous proposons des solutions de **paiement échelonné** pour l'achat de machines. Les modalités sont définies au cas par cas en fonction du montant et de votre profil. Contactez-nous pour discuter des options."]
    },
    {
        "tag": "showroom_occasion",
        "patterns": [
            "Voir les machines avant d'acheter", "Showroom", "Machine d'occasion", "Machines seconde main",
            "Machines neuves ou d'occasion ?"
        ],
        "responses": ["Nous proposons principalement des machines neuves avec garantie constructeur. Nous avons aussi une sélection de machines d'occasion révisées. Vous êtes invité à visiter notre showroom sur rendez-vous pour voir et tester les machines !"]
    }
];

// Détection d'intention
function detectIntents(message) {
    const lowerMessage = message.toLowerCase();
    const detected = [];

    for (const intent of intents) {
        for (const pattern of intent.patterns) {
            // Nettoyage simple des patterns pour la comparaison (retrait des **)
            const cleanPattern = pattern.replace(/\*\*/g, '').toLowerCase();
            if (lowerMessage.includes(cleanPattern)) {
                detected.push({ name: intent.tag, score: 1 });
                break;
            }
        }
    }

    return detected.length > 0 ? detected : [{ name: 'default', score: 0 }];
}

// Génération de réponse
function generateResponse(detectedIntents, context) {
    const primaryIntentTag = detectedIntents[0].name;

    if (primaryIntentTag === 'default') {
        return "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ? Je peux vous parler de nos machines, formations, conditions d'adhésion ou de nos services.";
    }

    const intent = intents.find(i => i.tag === primaryIntentTag);
    if (intent && intent.responses) {
        return intent.responses[Math.floor(Math.random() * intent.responses.length)];
    }

    return "Désolé, je n'ai pas trouvé de réponse appropriée.";
}

// Contexte de la conversation
const conversationContext = {
    history: [],
    lastIntent: null,
    interests: [],
    messageCount: 0,
    conversationId: null
};

// ... (reste du code inchangé jusqu'à getBotResponse)

// Fonction principale
export async function getBotResponse(userMessage) {
    // Charger les données fraîches
    await loadRealData();

    // Initialiser la conversation Supabase si nécessaire
    if (!conversationContext.conversationId) {
        try {
            const conversation = await createChatbotConversation({
                messages: []
            });
            conversationContext.conversationId = conversation.id;
            // Sauvegarder aussi l'ID dans sessionStorage pour persister au refresh si voulu
            sessionStorage.setItem('gal_current_conversation_id', conversation.id);
        } catch (error) {
            console.error('Erreur création conversation chatbot:', error);
        }
    }

    conversationContext.messageCount++;

    // Sauvegarder message utilisateur
    const userMsgObj = { role: 'user', content: userMessage };
    conversationContext.history.push(userMsgObj);

    if (conversationContext.conversationId) {
        addMessageToConversation(conversationContext.conversationId, userMsgObj).catch(console.error);
    }

    const detectedIntents = detectIntents(userMessage);
    const response = generateResponse(detectedIntents, conversationContext);

    // Sauvegarder réponse bot
    const botMsgObj = { role: 'assistant', content: response };
    conversationContext.history.push(botMsgObj);

    if (conversationContext.conversationId) {
        addMessageToConversation(conversationContext.conversationId, botMsgObj).catch(console.error);
    }

    return response;
}

// Message de bienvenue
export function getWelcomeMessage() {
    const hour = new Date().getHours();
    const greeting = hour < 18 ? "Bonjour" : "Bonsoir";
    return `${greeting} ! Je suis l'assistant virtuel du GAL. Je peux vous renseigner sur nos formations, nos machines et nos activités. Comment puis-je vous aider ?`;
}

export function initChatbot() {
    console.log('Chatbot GAL initialized');
    // Récupérer conversation existante si possible (optionnel)
    const savedId = sessionStorage.getItem('gal_current_conversation_id');
    if (savedId) {
        conversationContext.conversationId = savedId;
    }
}
