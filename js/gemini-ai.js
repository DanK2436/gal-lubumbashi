/**
 * gemini-ai.js - Assistant IA GAL propulsé par Google Gemini
 * GAL - Groupement des Artisans de Lubumbashi
 * Version 2.0 - Intelligence Artificielle avancée
 */

const GEMINI_API_KEY = "AIzaSyAWAZPcdqTPXBCMLd1RMqbW3zife-gkIQk";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Contexte système pour l'IA
const GAL_SYSTEM_CONTEXT = `Tu es "Dan Kande", l'assistant virtuel intelligent et professionnel du GAL (Groupement des Artisans de Lubumbashi).

🏢 IDENTITÉ DE L'ORGANISATION :
- Nom complet : Groupement des Artisans de Lubumbashi (GAL)
- Fondation : 2025 à Lubumbashi, RDC (République Démocratique du Congo)
- Mission : Propulser l'industrie locale en concevant des outils mécaniques robustes, adaptés aux réalités du terrain congolais
- Vision : Faire de Lubumbashi le hub technologique de l'artisanat industriel en RDC. D'ici 2030, chaque entrepreneur local utilisera au moins une solution signée GAL.
- Philosophie : "L'Afrique n'a pas besoin d'importer des solutions, elle doit les fabriquer elle-même."
- Localisation : Lubumbashi, Haut-Katanga, RDC 🇨🇩
- Contact : +243 979 022 998 | contact@gal-lubumbashi.com | WhatsApp: wa.me/243979022998
- Site web : https://gal-lubumbashi.com
- Horaires : Lundi-Vendredi 8h-17h

📊 CHIFFRES CLÉS :
- 150+ membres artisans
- 50+ machines livrées
- 500+ projets réalisés
- 20+ experts dans l'équipe
- Impact 100% local

🔧 MACHINES DISPONIBLES :
1. Batteuse à Maïs Motorisée - 1 200 USD - Capacité 1000 kg/h, Moteur Honda 6.5 HP
2. Moule Bloc Ciment - 150 USD - 40x20x20 cm, 250 blocs/jour
3. Rapeuse à Manioc - Sur devis - Production constante, usage intensif
4. Presse à Huile (arachide, tournesol) - Sur devis - Extraction à froid/chaud
5. Moule Buses Béton - Sur devis - Pour infrastructures
6. Brouette Renforcée - Sur devis - Charge lourde, terrain difficile
7. Coffret Métallique - Sur devis - Sur mesure, peinture époxy
8. Pétrin Boulangerie - Sur devis - Cuve inox alimentaire
- GAL propose aussi la conception de machines sur mesure selon les besoins du client
- Service après-vente complet : maintenance, pièces de rechange, assistance technique
- Garantie 1 à 2 ans selon le type de machine
- Livraison dans toute la RDC
- Facilités de paiement échelonné disponibles

🎓 FORMATIONS PROPOSÉES :
1. Électricité industrielle - Complète - Installation et normes de sécurité
2. Soudure et métallurgie - Avancée - TIG, MIG, arc électrique
3. Menuiserie professionnelle - Professionnelle - Conception et réalisation
4. Plomberie sanitaire - Complète - Systèmes sanitaires et évacuation
5. Mécanique automobile - Niveau Pro - Diagnostic et réparation
6. Gestion de chantier - Managériale - Planification et livraison
- Toutes les formations délivrent un certificat reconnu
- Tarifs réduits pour les membres (-30%)
- Sessions flexibles incluant le samedi
- Ouvertes à tous (membres et non-membres)

💼 ADHÉSION :
- Cotisation annuelle : 50 USD
- Avantages : prix réduits machines/formations, accès prioritaire, réseau professionnel, conseils personnalisés, certification
- Conditions : être artisan actif dans la région de Lubumbashi

📌 SERVICES COMPLÉMENTAIRES :
- Événements de networking trimestriels
- Accompagnement personnalisé (choix d'équipements, optimisation processus, stratégie commerciale)
- Newsletter avec actualités et offres spéciales
- Chaîne YouTube avec tutoriels et démonstrations
- Projet chantiers et conceptions réalisés

🔒 CONFIDENTIALITÉ :
- Données stockées de manière sécurisée
- Jamais partagées avec des tiers sans consentement
- Cookies essentiels uniquement (pas de publicitaires)
- Droit de suppression des données sur demande

📝 RÈGLES DE COMPORTEMENT :
1. Réponds TOUJOURS en français (sauf si l'utilisateur parle une autre langue)
2. Sois professionnel, chaleureux et enthousiaste
3. Utilise des emojis avec modération pour rendre la conversation vivante
4. Fournis des réponses précises avec des données concrètes
5. Si tu ne connais pas la réponse, oriente vers le contact direct (+243 979 022 998 ou contact@gal-lubumbashi.com)
6. Ne fais JAMAIS de promesses que GAL ne peut pas tenir
7. Mets en valeur les produits et services GAL naturellement
8. Adapte le ton selon le contexte (formel pour les demandes d'affaires, décontracté pour les salutations)
9. Format tes réponses avec des paragraphes courts et des listes à puces quand c'est pertinent
10. Ne mentionne JAMAIS que tu es un modèle IA de Google ou Gemini. Tu es "Dan Kande", assistant GAL.
11. Tes réponses doivent être concises mais complètes (3-5 paragraphes max pour la plupart des questions)
12. Quand on te demande qui tu es, dis que tu es Dan Kande, l'assistant numérique de GAL
`;

// Historique de la conversation pour maintenir le contexte
let conversationHistory = [];
const MAX_HISTORY = 20; // Garder les 20 derniers messages

/**
 * Envoie un message à l'API Google Gemini et retourne la réponse
 * @param {string} userMessage - Le message de l'utilisateur
 * @param {object} siteData - Données dynamiques du site (formations, machines, etc.)
 * @returns {Promise<string>} La réponse de l'IA
 */
export async function askGemini(userMessage, siteData = null) {
  // Construire le contexte dynamique si des données du site sont disponibles
  let dynamicContext = "";
  if (siteData) {
    if (siteData.formations && siteData.formations.length > 0) {
      dynamicContext +=
        "\n\n📚 FORMATIONS ACTUELLES DANS LA BASE DE DONNÉES :\n";
      siteData.formations.forEach((f, i) => {
        dynamicContext += `${i + 1}. ${f.title} - Niveau: ${f.level || "N/A"} - Durée: ${f.duration || "N/A"} - Prix: ${f.price || "N/A"}\n`;
        if (f.description)
          dynamicContext += `   Description: ${f.description.substring(0, 150)}\n`;
      });
    }
    if (siteData.machines && siteData.machines.length > 0) {
      dynamicContext += "\n\n🔧 MACHINES ACTUELLES DANS LA BASE DE DONNÉES :\n";
      siteData.machines.forEach((m, i) => {
        dynamicContext += `${i + 1}. ${m.name} - Catégorie: ${m.category || "N/A"} - Statut: ${m.status || "N/A"} - Prix: ${m.priceRange || "Sur devis"}\n`;
        if (m.description)
          dynamicContext += `   Description: ${m.description.substring(0, 150)}\n`;
      });
    }
    if (siteData.projects && siteData.projects.length > 0) {
      dynamicContext += "\n\n🏗️ PROJETS RÉCENTS :\n";
      siteData.projects.slice(0, 10).forEach((p, i) => {
        dynamicContext += `${i + 1}. ${p.title} - Type: ${p.type || "N/A"} - Statut: ${p.status || "N/A"}\n`;
      });
    }
    if (siteData.blogPosts && siteData.blogPosts.length > 0) {
      dynamicContext += "\n\n📰 ARTICLES DE BLOG RÉCENTS :\n";
      siteData.blogPosts.slice(0, 5).forEach((b, i) => {
        dynamicContext += `${i + 1}. ${b.title} - Catégorie: ${b.category || "N/A"}\n`;
      });
    }
  }

  // Ajouter le message utilisateur à l'historique
  conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

  // Limiter l'historique
  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory = conversationHistory.slice(-MAX_HISTORY);
  }

  // Construire le corps de la requête
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              GAL_SYSTEM_CONTEXT +
              dynamicContext +
              "\n\n--- Début de la conversation ---",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Compris ! Je suis Dan Kande, l'assistant virtuel de GAL. Je suis prêt à aider les utilisateurs avec toutes les informations sur GAL, ses machines, formations et services. Je répondrai en français de manière professionnelle et chaleureuse. 🤝",
          },
        ],
      },
      ...conversationHistory,
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
      responseMimeType: "text/plain",
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erreur API Gemini:", response.status, errorData);
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();

    // Extraire la réponse
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error("Réponse vide de Gemini");
    }

    // Ajouter la réponse à l'historique
    conversationHistory.push({ role: "model", parts: [{ text: aiResponse }] });

    return aiResponse;
  } catch (error) {
    console.error("Erreur Gemini:", error);

    // Fallback intelligent
    return generateFallbackResponse(userMessage);
  }
}

/**
 * Réponse de secours si l'API est indisponible
 */
function generateFallbackResponse(message) {
  const lowerMsg = message.toLowerCase();

  if (/bonjour|salut|hello|bonsoir|hey/i.test(lowerMsg)) {
    const hour = new Date().getHours();
    const greeting = hour < 18 ? "Bonjour" : "Bonsoir";
    return `${greeting} ! 🤝 Je suis Dan Kande, l'assistant virtuel de GAL. Comment puis-je vous aider aujourd'hui ?`;
  }

  if (/machine|équipement|outil|batteuse|moule|presse/i.test(lowerMsg)) {
    return "Nous proposons une gamme complète de machines industrielles : batteuses, moules, presses, rapeuses, et bien plus. Consultez notre catalogue sur la page Machines ou contactez-nous au +243 979 022 998 pour un devis personnalisé ! ⚙️";
  }

  if (/formation|apprendre|cours|certif/i.test(lowerMsg)) {
    return "GAL propose des formations certifiantes en électricité, soudure, menuiserie, plomberie, mécanique et gestion de chantier. Les membres bénéficient de -30% ! Découvrez toutes nos formations sur la page dédiée. 🎓";
  }

  if (/adhésion|membre|rejoindre|cotisation/i.test(lowerMsg)) {
    return "Pour devenir membre de GAL, la cotisation annuelle est de 50 USD. Vous bénéficierez de tarifs réduits sur les machines et formations, d'un réseau professionnel et d'un accompagnement personnalisé. Contactez-nous pour en savoir plus ! 💼";
  }

  if (/contact|téléphone|email|whatsapp|adresse/i.test(lowerMsg)) {
    return "📱 Contactez GAL :\n• Tél: +243 979 022 998\n• Email: contact@gal-lubumbashi.com\n• WhatsApp: wa.me/243979022998\n• Horaires: Lun-Ven 8h-17h\n\n📍 Lubumbashi, Haut-Katanga, RDC";
  }

  if (/merci|thanks/i.test(lowerMsg)) {
    return "Avec plaisir ! 🤝 N'hésitez pas si vous avez d'autres questions. L'équipe GAL est toujours là pour vous. ⚙️";
  }

  return "Je suis Dan Kande, votre assistant GAL. 🤖\n\nJe peux vous renseigner sur :\n💼 L'adhésion à GAL\n🎓 Nos formations certifiantes\n⚙️ Notre catalogue de machines\n📱 Nos coordonnées\n\nN'hésitez pas à reformuler votre question ou contactez-nous directement au +243 979 022 998 !";
}

/**
 * Réinitialiser la conversation
 */
export function resetConversation() {
  conversationHistory = [];
}

/**
 * Obtenir le message de bienvenue
 */
export function getWelcomeMessage() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  return `${greeting} ! 🤝 Je suis **Dan Kande**, l'assistant intelligent de GAL propulsé par l'IA.\n\nJe peux vous renseigner avec précision sur nos **machines industrielles**, nos **formations certifiantes**, les conditions d'**adhésion**, et bien plus encore.\n\nComment puis-je vous aider ?`;
}
