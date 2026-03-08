// Import du SDK Supabase depuis le CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// =================================================================
// Configuration Supabase
// =================================================================

const supabaseConfig = {
    url: "https://isshhhysudktvowdzzwc.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzc2hoaHlzdWRrdHZvd2R6endjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTkxNDIsImV4cCI6MjA4MDE5NTE0Mn0.XvzQ2JocU-8ln9Cc0W38E9XWBYxnqLZDZILvj5j4at4"
};

// Initialisation de Supabase
let supabase = null;

try {
    if (supabaseConfig.url && supabaseConfig.anonKey) {
        supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
        console.log("✅ Supabase initialisé avec succès");
    } else {
        console.warn("⚠️ Supabase n'est pas configuré correctement !");
    }
} catch (error) {
    console.error("❌ Erreur d'initialisation Supabase:", error);
}

export { supabase };
