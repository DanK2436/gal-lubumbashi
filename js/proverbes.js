// Proverbes africains pour la page d'accueil
const proverbsAfricains = [
    "« L'artisan qui prend le temps de mesurer deux fois n'a besoin de couper qu'une seule fois, car la patience et la précision sont les fondations invisibles de toute œuvre durable. »",
    "« La lumière bien calculée éclaire plus que mille lampes mal posées, car ce n'est pas la quantité qui illumine, mais la sagesse de la disposition. »",
    "« Un plan clair est déjà la moitié du chantier terminé ; celui qui dessine avec rigueur construit avec confiance, et celui qui construit avec confiance transmet la paix. »",
    "« Quand les mains s'unissent dans le travail, le mur se dresse droit et solide, car la force de l'artisan seul est limitée, mais l'union des artisans est infinie. »",
    "« Le fil bien tendu guide l'ouvrage vers la perfection ; il est comme une route tracée dans le désert, qui empêche l'artisan de se perdre dans l'improvisation. »",
    "« L'outil respecté ne trahit jamais son maître ; celui qui entretient son marteau, sa scie ou son pinceau, trouve en eux des compagnons fidèles qui prolongent son savoir-faire. »",
    "« Le schéma ordonné est la langue que comprend la maison ; sans lui, les murs parlent le chaos, mais avec lui, chaque pierre trouve sa place comme une note dans une mélodie. »",
    "« Celui qui néglige la norme construit l'erreur ; les fissures ne naissent pas du hasard, mais du mépris des règles que les anciens ont transmises pour protéger la vie. »",
    "« La précision est la sagesse silencieuse de l'artisan ; elle ne crie pas, elle ne se vante pas, mais elle se voit dans chaque joint parfait et chaque ligne droite. »",
    "« Le savoir partagé éclaire plus qu'une ampoule seule ; car une idée transmise à un autre artisan devient une lumière qui se multiplie dans mille maisons. »",
    "« La maison solide commence par une fondation humble ; celui qui respecte la terre et la prépare avec soin construit un héritage qui défie le temps. »",
    "« Le bois bien séché chante longtemps dans le feu ; de même, le matériau préparé avec patience donne une œuvre qui dure au-delà des générations. »",
    "« Le fer forgé avec patience devient une œuvre éternelle ; car la chaleur du feu et la constance de la main transforment la dureté en beauté. »",
    "« Le ciment mal dosé trahit le maçon ; il est comme une promesse non tenue, qui s'effrite au premier vent. »",
    "« L'électricité mal pensée est une ombre dangereuse ; elle ne pardonne pas l'erreur et rappelle que la technique est une science qui protège ou détruit. »",
    "« Le dessin exact est le langage des bâtisseurs ; il est la carte qui guide les mains et évite que les murs racontent des mensonges. »",
    "« La règle droite est la mère de la confiance ; sans elle, l'artisan doute, mais avec elle, il marche avec assurance vers la perfection. »",
    "« L'artisan pressé fabrique des fissures ; car la vitesse sans réflexion est une ennemie silencieuse qui détruit l'œuvre avant qu'elle ne soit achevée. »",
    "« Le chantier ordonné est un chant de discipline ; chaque outil à sa place, chaque geste à son moment, et l'ensemble devient une symphonie de travail. »",
    "« Le marteau sage frappe sans colère ; il ne détruit pas, il façonne, et rappelle que la force doit toujours être guidée par la maîtrise. »",
    "« La lampe bien placée chasse l'obscurité des esprits ; elle n'est pas seulement une source de lumière, mais une invitation à la clarté, à la sécurité et à la dignité dans chaque maison. »",
    "« Le câble bien fixé est la veine de la maison ; il transporte l'énergie comme le sang transporte la vie, et rappelle que la rigueur technique est une forme de protection invisible. »",
    "« L'artisan qui écoute la matière entend la vérité ; le bois parle de sa sécheresse, le métal de sa dureté, et la pierre de sa patience, mais seuls les sages savent les entendre. »",
    "« Le plan mal lu est un chemin vers l'erreur ; chaque ligne oubliée est une fissure future, et chaque symbole ignoré est une menace silencieuse pour l'ouvrage. »",
    "« La norme respectée est la clé de la sécurité ; elle est comme une loi ancestrale qui protège l'artisan, l'habitant et la communauté contre les dangers invisibles. »",
    "« Le fil électrique est comme le sang : il doit circuler sans fuite, car une seule négligence peut transformer la maison en piège au lieu de refuge. »",
    "« Le mur droit est le miroir de l'artisan ; il reflète sa discipline, sa patience et son respect des règles, et devient une signature silencieuse de son savoir-faire. »",
    "« Le chantier propre est la fierté du maître ; chaque outil rangé, chaque débris retiré est une preuve que l'artisan respecte son métier autant que son client. »",
    "« La patience est le ciment invisible des grandes œuvres ; elle ne se voit pas, mais elle lie chaque geste, chaque mesure et chaque coup de marteau dans une harmonie durable. »",
    "« Le savoir-faire est une lampe qui ne s'éteint jamais ; même quand l'artisan vieillit, ses gestes enseignent encore, et ses œuvres parlent pour lui. »",
    "« L'artisan qui partage son savoir construit deux fois ; une fois dans la matière, et une fois dans l'esprit de celui qui apprend. »",
    "« Le clou bien planté ne tremble pas dans la tempête ; il est petit mais fidèle, et rappelle que la solidité vient souvent des détails invisibles. »",
    "« La maison bien éclairée est un cœur ouvert ; elle accueille la famille, les amis et les voyageurs, et montre que la technique peut être une poésie de l'hospitalité. »",
    "« Le dessin précis est la musique des bâtisseurs ; chaque ligne est une note, chaque mesure une mélodie, et l'ensemble devient une symphonie de pierre et de lumière. »",
    "« Le fil mal tendu est une route vers l'accident ; il est comme un serpent qui guette dans l'ombre, prêt à rappeler que la négligence est une ennemie silencieuse. »",
    "« L'artisan qui respecte la norme protège la vie ; son travail est une barrière invisible contre le feu, l'effondrement et l'obscurité. »",
    "« Le chantier est une école où chaque erreur enseigne ; celui qui apprend de ses fautes devient maître, et celui qui les ignore devient prisonnier de l'échec. »",
    "« La main habile transforme la pierre en mémoire ; chaque maison construite est une histoire, chaque mur un témoignage, et chaque lampe une étoile pour les générations. »",
    "« Le plan est une promesse que l'artisan doit tenir ; il est un contrat silencieux entre la vision et la réalité, et chaque ligne est une parole donnée. »",
    "« La lampe bien choisie est une étoile dans la maison ; elle ne brille pas seulement pour éclairer, mais pour rappeler que la beauté et la technique peuvent marcher ensemble. »",
    "« Le câble mal posé est comme un serpent caché dans la maison ; il ne se montre pas, mais il attend le moment de frapper, rappelant que chaque détail négligé peut devenir un danger silencieux. »",
    "« L'artisan qui doute vérifie, et celui qui vérifie réussit ; car la confiance ne vient pas de l'orgueil, mais de la rigueur et de l'humilité devant la matière. »",
    "« Le chantier discipliné est une prière silencieuse ; chaque geste répété avec soin devient une offrande, et chaque mur dressé avec patience devient un temple de savoir-faire. »",
    "« La règle est la sagesse qui guide la main ; elle ne parle pas, mais elle corrige, et elle rappelle que la droiture est la première vertu de l'artisan. »",
    "« Le ciment bien dosé est la patience matérialisée ; il lie les pierres comme la sagesse lie les générations, et il enseigne que la mesure est la clé de la solidité. »",
    "« L'artisan qui respecte le schéma respecte la vie ; car derrière chaque ligne tracée se cache une promesse de sécurité pour ceux qui habiteront l'ouvrage. »",
    "« Le fil bien isolé est une promesse de sécurité ; il protège la maison comme une mère protège son enfant, et rappelle que la technique est aussi une forme d'amour. »",
    "« La maison bien construite est un héritage vivant ; elle ne se limite pas aux murs, mais elle transmet la mémoire, la dignité et la fierté de l'artisan à ceux qui viendront après lui. »",
    "« Le plan clair est une lampe pour l'esprit ; il éclaire le chemin de l'artisan et empêche que l'ouvrage devienne une forêt d'erreurs. »",
    "« L'artisan qui travaille en équipe bâtit plus haut ; car une seule main peut lever une pierre, mais mille mains unissent leurs forces pour élever une cité. »",
    "« Le marteau mal utilisé est un danger silencieux ; il n'est pas l'outil qui est mauvais, mais la main qui oublie la discipline. »",
    "« La lumière bien pensée est une poésie technique ; elle ne se contente pas d'éclairer, elle raconte une histoire de beauté et de sécurité dans chaque espace. »",
    "« Le chantier bien dirigé est une danse d'ordre ; chaque artisan connaît son pas, chaque outil son rythme, et l'ensemble devient une chorégraphie de savoir-faire. »",
    "« L'artisan qui apprend chaque jour ne vieillit jamais ; car son esprit reste jeune, et ses œuvres deviennent des leçons vivantes pour ceux qui suivent. »",
    "« La précision est le souffle invisible de l'artisan ; elle ne se voit pas dans les gestes rapides, mais elle se révèle dans la solidité des œuvres qui défient le temps. »"
];

// Variables globales
let currentProverbIndex = 0;
let proverbeInterval = null;

/**
 * Initialise le système de proverbes défilants
 */
function initProverbes() {
    const proverbeElement = document.getElementById('proverbe-text');

    if (!proverbeElement) {
        console.warn('Element proverbe-text not found');
        return;
    }

    // Définir le premier proverbe
    proverbeElement.textContent = proverbsAfricains[0];

    // Démarrer le défilement automatique toutes les 15 secondes
    proverbeInterval = setInterval(changeProverbe, 15000);
}

/**
 * Change le proverbe affiché avec animation
 */
function changeProverbe() {
    const proverbeElement = document.getElementById('proverbe-text');

    if (!proverbeElement) {
        clearInterval(proverbeInterval);
        return;
    }

    // Animation de sortie (slide-out vers la droite)
    proverbeElement.style.animation = 'none';
    proverbeElement.style.opacity = '0';
    proverbeElement.style.transform = 'translateX(100%)';

    // Changer le proverbe après l'animation de sortie
    setTimeout(() => {
        // Passer au proverbe suivant
        currentProverbIndex = (currentProverbIndex + 1) % proverbsAfricains.length;
        proverbeElement.textContent = proverbsAfricains[currentProverbIndex];

        // Animation d'entrée (slide-in depuis la gauche)
        proverbeElement.style.transition = 'all 1s ease-in-out';
        requestAnimationFrame(() => {
            proverbeElement.style.opacity = '1';
            proverbeElement.style.transform = 'translateX(0)';
        });
    }, 1000);
}

/**
 * Arrête le défilement automatique (utile pour nettoyer)
 */
function stopProverbes() {
    if (proverbeInterval) {
        clearInterval(proverbeInterval);
        proverbeInterval = null;
    }
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProverbes);
} else {
    initProverbes();
}

// Nettoyer l'intervalle quand on quitte la page
window.addEventListener('beforeunload', stopProverbes);

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initProverbes, stopProverbes };
}
