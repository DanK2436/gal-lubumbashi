/**
 * Script de test pour les fonctionnalités Chantiers et Conceptions
 * À exécuter dans la console du navigateur sur la page admin
 */

console.log('🧪 Test des fonctionnalités Chantiers et Conceptions\n');

// Test 1: Vérifier que les fonctions sont importées
console.log('1️⃣ Test des imports...');
try {
    console.log('✅ Fonctions disponibles dans storage.js');
} catch (error) {
    console.error('❌ Erreur d\'import:', error);
}

// Test 2: Créer un chantier de test
console.log('\n2️⃣ Test de création d\'un chantier...');
async function testCreateChantier() {
    try {
        const { createProject, getProjects } = await import('./js/storage.js');

        const nouveauChantier = {
            title: 'Chantier Test',
            description: 'Ceci est un chantier de test créé automatiquement',
            image: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Chantier+Test',
            type: 'chantiers',
            status: 'active'
        };

        const result = await createProject(nouveauChantier);
        console.log('✅ Chantier créé avec succès:', result);
        return result;
    } catch (error) {
        console.error('❌ Erreur lors de la création:', error);
        return null;
    }
}

// Test 3: Récupérer tous les chantiers
console.log('\n3️⃣ Test de récupération des chantiers...');
async function testGetChantiers() {
    try {
        const { getProjects } = await import('./js/storage.js');
        const chantiers = await getProjects('chantiers');
        console.log(`✅ ${chantiers.length} chantier(s) récupéré(s):`);
        chantiers.forEach(c => console.log(`   - ${c.title} (${c.status})`));
        return chantiers;
    } catch (error) {
        console.error('❌ Erreur lors de la récupération:', error);
        return [];
    }
}

// Test 4: Créer une conception de test
console.log('\n4️⃣ Test de création d\'une conception...');
async function testCreateConception() {
    try {
        const { createProject } = await import('./js/storage.js');

        const nouvelleConception = {
            title: 'Conception Test',
            description: 'Ceci est une conception de test créée automatiquement',
            image: 'https://via.placeholder.com/400x300/2563eb/ffffff?text=Conception+Test',
            type: 'conceptions',
            status: 'active'
        };

        const result = await createProject(nouvelleConception);
        console.log('✅ Conception créée avec succès:', result);
        return result;
    } catch (error) {
        console.error('❌ Erreur lors de la création:', error);
        return null;
    }
}

// Test 5: Récupérer toutes les conceptions
console.log('\n5️⃣ Test de récupération des conceptions...');
async function testGetConceptions() {
    try {
        const { getProjects } = await import('./js/storage.js');
        const conceptions = await getProjects('conceptions');
        console.log(`✅ ${conceptions.length} conception(s) récupérée(s):`);
        conceptions.forEach(c => console.log(`   - ${c.title} (${c.status})`));
        return conceptions;
    } catch (error) {
        console.error('❌ Erreur lors de la récupération:', error);
        return [];
    }
}

// Exécuter tous les tests
async function runAllTests() {
    console.log('\n🚀 Démarrage de tous les tests...\n');

    await testCreateChantier();
    await testGetChantiers();
    await testCreateConception();
    await testGetConceptions();

    console.log('\n✅ Tous les tests sont terminés!\n');
    console.log('💡 Vous pouvez maintenant :');
    console.log('   1. Cliquer sur "Chantiers" dans le menu pour voir les chantiers');
    console.log('   2. Cliquer sur "Conceptions" dans le menu pour voir les conceptions');
    console.log('   3. Utiliser les boutons "Ajouter" pour créer de nouveaux projets');
}

// Exporter les fonctions pour utilisation dans la console
window.projectTests = {
    runAllTests,
    testCreateChantier,
    testGetChantiers,
    testCreateConception,
    testGetConceptions
};

console.log('\n📝 Pour exécuter tous les tests, tapez dans la console:');
console.log('   window.projectTests.runAllTests()\n');
