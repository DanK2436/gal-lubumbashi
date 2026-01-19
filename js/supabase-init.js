<<<<<<< HEAD
// Import du SDK Supabase depuis le CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// =================================================================
// ⚠️ CONFIGURATION À REMPLIR ⚠️
// Allez sur https://supabase.com/dashboard
// Créez un projet, puis dans Settings > API :
// - Copiez l'URL du projet (Project URL)
// - Copiez la clé publique (anon/public key)
// =================================================================

const supabaseConfig = {
    url: "https://isshhhysudktvowdzzwc.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzc2hoaHlzdWRrdHZvd2R6endjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTkxNDIsImV4cCI6MjA4MDE5NTE0Mn0.XvzQ2JocU-8ln9Cc0W38E9XWBYxnqLZDZILvj5j4at4"
};

// Initialisation de Supabase
let supabase = null;

try {
    // Vérification basique pour ne pas planter si la config est vide
    if (supabaseConfig.url === "VOTRE_SUPABASE_URL_ICI" ||
        supabaseConfig.anonKey === "VOTRE_SUPABASE_ANON_KEY_ICI") {
        console.warn("⚠️ Supabase n'est pas configuré ! Les données ne seront pas sauvegardées en ligne.");
    } else {
        supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
        console.log("✅ Supabase initialisé avec succès");
    }
} catch (error) {
    console.error("❌ Erreur d'initialisation Supabase:", error);
}

export { supabase };
=======
// Import du SDK Supabase depuis le CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// =================================================================
// ⚠️ CONFIGURATION À REMPLIR ⚠️
// Allez sur https://supabase.com/dashboard
// Créez un projet, puis dans Settings > API :
// - Copiez l'URL du projet (Project URL)
// - Copiez la clé publique (anon/public key)
// =================================================================

const supabaseConfig = {
    url: "https://isshhhysudktvowdzzwc.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzc2hoaHlzdWRrdHZvd2R6endjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTkxNDIsImV4cCI6MjA4MDE5NTE0Mn0.XvzQ2JocU-8ln9Cc0W38E9XWBYxnqLZDZILvj5j4at4"
};

// Initialisation de Supabase
let supabase = null;

try {
    // Vérification basique pour ne pas planter si la config est vide
    if (supabaseConfig.url === "VOTRE_SUPABASE_URL_ICI" ||
        supabaseConfig.anonKey === "VOTRE_SUPABASE_ANON_KEY_ICI") {
        console.warn("⚠️ Supabase n'est pas configuré ! Les données ne seront pas sauvegardées en ligne.");
    } else {
        supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
        console.log("✅ Supabase initialisé avec succès");
    }
} catch (error) {
    console.error("❌ Erreur d'initialisation Supabase:", error);
}

export { supabase };
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
