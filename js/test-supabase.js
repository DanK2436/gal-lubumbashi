/**
 * Script de test pour vérifier la configuration Supabase
 * Ouvrez la console du navigateur pour voir les résultats
 */

import { supabase } from './supabase-init.js';
import {
    addDocument,
    getCollection,
    deleteDocument
} from './supabase-service.js';

// Fonction principale de test
async function testSupabase() {
    console.log('🧪 Début des tests Supabase...\n');

    // Test 1: Vérifier la connexion
    console.log('Test 1: Vérification de la connexion...');
    if (!supabase) {
        console.error('❌ Supabase n\'est pas configuré');
        console.log('ℹ️ Configurez vos clés dans js/supabase-init.js');
        return;
    }
    console.log('✅ Supabase est connecté\n');

    // Test 2: Tester l'ajout d'un abonné newsletter
    console.log('Test 2: Ajout d\'un abonné newsletter...');
    try {
        const testEmail = `test_${Date.now()}@example.com`;
        const subscriber = await addDocument('newsletter_subscribers', {
            email: testEmail
        });
        console.log('✅ Abonné ajouté:', subscriber);

        // Nettoyer le test
        if (subscriber && subscriber.id) {
            await deleteDocument('newsletter_subscribers', subscriber.id);
            console.log('✅ Test nettoyé\n');
        }
    } catch (error) {
        console.error('❌ Erreur newsletter:', error.message);
        console.log('ℹ️ Vérifiez que la table "newsletter_subscribers" existe\n');
    }

    // Test 3: Lire les formations
    console.log('Test 3: Lecture des formations...');
    try {
        const formations = await getCollection('formations');
        console.log(`✅ ${formations.length} formation(s) trouvée(s)`);
        if (formations.length > 0) {
            console.log('Première formation:', formations[0]);
        }
        console.log('');
    } catch (error) {
        console.error('❌ Erreur formations:', error.message);
        console.log('ℹ️ Vérifiez que la table "formations" existe\n');
    }

    // Test 4: Lire les machines
    console.log('Test 4: Lecture des machines...');
    try {
        const machines = await getCollection('machines');
        console.log(`✅ ${machines.length} machine(s) trouvée(s)`);
        if (machines.length > 0) {
            console.log('Première machine:', machines[0]);
        }
        console.log('');
    } catch (error) {
        console.error('❌ Erreur machines:', error.message);
        console.log('ℹ️ Vérifiez que la table "machines" existe\n');
    }

    // Test 5: Tester un message de contact
    console.log('Test 5: Envoi d\'un message de contact...');
    try {
        const message = await addDocument('contact_messages', {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test',
            message: 'Message de test',
            status: 'new'
        });
        console.log('✅ Message envoyé:', message);

        // Nettoyer le test
        if (message && message.id) {
            await deleteDocument('contact_messages', message.id);
            console.log('✅ Test nettoyé\n');
        }
    } catch (error) {
        console.error('❌ Erreur contact:', error.message);
        console.log('ℹ️ Vérifiez que la table "contact_messages" existe\n');
    }

    // Résumé
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Tests terminés !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nℹ️ Si certains tests ont échoué :');
    console.log('1. Vérifiez que les tables existent dans Supabase');
    console.log('2. Exécutez le script SQL dans STOCKAGE_HYBRIDE.md');
    console.log('3. Vérifiez les politiques RLS (Row Level Security)');
    console.log('\n📚 Documentation : SUPABASE_SETUP.md');
}

// Auto-exécution si ce script est importé
if (typeof window !== 'undefined') {
    // Attendre que la page soit chargée
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Ajouter un bouton de test dans la console
            window.testSupabase = testSupabase;
            console.log('🧪 Test Supabase disponible !');
            console.log('Tapez "testSupabase()" dans la console pour lancer les tests');
        });
    } else {
        window.testSupabase = testSupabase;
        console.log('🧪 Test Supabase disponible !');
        console.log('Tapez "testSupabase()" dans la console pour lancer les tests');
    }
}

export { testSupabase };
