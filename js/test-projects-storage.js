/**
 * test-projects-storage.js
 * Script de test pour vérifier l'initialisation et le fonctionnement
 * du système de stockage des chantiers et conceptions
 * 
 * UTILISATION :
 * 1. Ouvrez votre site web dans un navigateur
 * 2. Ouvrez la console (F12)
 * 3. Copiez et collez ce script dans la console
 * 4. Appuyez sur Entrée
 * 
 * Le script va tester toutes les opérations CRUD et afficher les résultats
 */

console.log('🧪 Démarrage des tests de stockage des projets...\n');

// Importer les fonctions nécessaires
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} from './js/storage.js';

// Utilitaire pour afficher les résultats
function logTest(name, success, data = null, error = null) {
    const icon = success ? '✅' : '❌';
    console.log(`${icon} ${name}`);
    if (data) console.log('   Données:', data);
    if (error) console.error('   Erreur:', error);
    console.log('');
}

// Variables pour stocker les IDs de test
let testChantierld = null;
let testConceptionId = null;

// ============================================
// SUITE DE TESTS
// ============================================

async function runTests() {
    console.log('═══════════════════════════════════════════');
    console.log('TEST 1 : Récupération de tous les projets');
    console.log('═══════════════════════════════════════════\n');

    try {
        const allProjects = await getProjects();
        logTest(
            'Récupérer tous les projets',
            true,
            { nombre: allProjects.length, projets: allProjects }
        );
    } catch (error) {
        logTest('Récupérer tous les projets', false, null, error.message);
    }

    console.log('═══════════════════════════════════════════');
    console.log('TEST 2 : Récupération des chantiers');
    console.log('═══════════════════════════════════════════\n');

    try {
        const chantiers = await getProjects('chantiers');
        logTest(
            'Récupérer les chantiers',
            true,
            { nombre: chantiers.length, chantiers }
        );
    } catch (error) {
        logTest('Récupérer les chantiers', false, null, error.message);
    }

    console.log('═══════════════════════════════════════════');
    console.log('TEST 3 : Récupération des conceptions');
    console.log('═══════════════════════════════════════════\n');

    try {
        const conceptions = await getProjects('conceptions');
        logTest(
            'Récupérer les conceptions',
            true,
            { nombre: conceptions.length, conceptions }
        );
    } catch (error) {
        logTest('Récupérer les conceptions', false, null, error.message);
    }

    console.log('═══════════════════════════════════════════');
    console.log('TEST 4 : Création d\'un nouveau chantier');
    console.log('═══════════════════════════════════════════\n');

    try {
        const newChantier = await createProject({
            title: '🧪 TEST - Chantier de Test',
            description: 'Ceci est un chantier de test créé automatiquement. Vous pouvez le supprimer en toute sécurité.',
            image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
            type: 'chantiers',
            status: 'active'
        });

        testChantierld = newChantier.id;
        logTest(
            'Créer un nouveau chantier',
            true,
            { id: newChantier.id, titre: newChantier.title }
        );
    } catch (error) {
        logTest('Créer un nouveau chantier', false, null, error.message);
    }

    console.log('═══════════════════════════════════════════');
    console.log('TEST 5 : Création d\'une nouvelle conception');
    console.log('═══════════════════════════════════════════\n');

    try {
        const newConception = await createProject({
            title: '🧪 TEST - Conception de Test',
            description: 'Ceci est une conception de test créée automatiquement. Vous pouvez la supprimer en toute sécurité.',
            image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400',
            type: 'conceptions',
            status: 'draft'
        });

        testConceptionId = newConception.id;
        logTest(
            'Créer une nouvelle conception',
            true,
            { id: newConception.id, titre: newConception.title }
        );
    } catch (error) {
        logTest('Créer une nouvelle conception', false, null, error.message);
    }

    console.log('═══════════════════════════════════════════');
    console.log('TEST 6 : Récupération d\'un projet par ID');
    console.log('═══════════════════════════════════════════\n');

    if (testChantierld) {
        try {
            const project = await getProjectById(testChantierld);
            logTest(
                'Récupérer un projet par ID',
                !!project,
                { id: project.id, titre: project.title, type: project.type }
            );
        } catch (error) {
            logTest('Récupérer un projet par ID', false, null, error.message);
        }
    } else {
        logTest('Récupérer un projet par ID', false, null, 'Aucun ID de test disponible');
    }

    console.log('═══════════════════════════════════════════');
    console.log('TEST 7 : Modification d\'un projet');
    console.log('═══════════════════════════════════════════\n');

    if (testChantierld) {
        try {
            const updated = await updateProject(testChantierld, {
                title: '🧪 TEST - Chantier de Test MODIFIÉ',
                status: 'completed'
            });
            logTest(
                'Modifier un projet',
                true,
                { id: updated.id, nouveauTitre: updated.title, nouveauStatut: updated.status }
            );
        } catch (error) {
            logTest('Modifier un projet', false, null, error.message);
        }
    } else {
        logTest('Modifier un projet', false, null, 'Aucun ID de test disponible');
    }

    console.log('═══════════════════════════════════════════');
    console.log('TEST 8 : Vérification du trigger updated_at');
    console.log('═══════════════════════════════════════════\n');

    if (testChantierld) {
        try {
            const project = await getProjectById(testChantierld);
            const createdAt = new Date(project.created_at);
            const updatedAt = new Date(project.updated_at);
            const isDifferent = updatedAt > createdAt;

            logTest(
                'Vérifier mise à jour automatique updated_at',
                isDifferent,
                {
                    créé: createdAt.toLocaleString('fr-FR'),
                    modifié: updatedAt.toLocaleString('fr-FR'),
                    différent: isDifferent
                }
            );
        } catch (error) {
            logTest('Vérifier mise à jour automatique updated_at', false, null, error.message);
        }
    }

    console.log('═══════════════════════════════════════════');
    console.log('TEST 9 : Suppression d\'un chantier');
    console.log('═══════════════════════════════════════════\n');

    if (testChantierld) {
        try {
            await deleteProject(testChantierld);
            // Vérifier que le projet n'existe plus
            const deleted = await getProjectById(testChantierld);
            logTest(
                'Supprimer un chantier',
                !deleted,
                { id: testChantierld, supprimé: !deleted }
            );
        } catch (error) {
            logTest('Supprimer un chantier', false, null, error.message);
        }
    } else {
        logTest('Supprimer un chantier', false, null, 'Aucun ID de test disponible');
    }

    console.log('═══════════════════════════════════════════');
    console.log('TEST 10 : Suppression d\'une conception');
    console.log('═══════════════════════════════════════════\n');

    if (testConceptionId) {
        try {
            await deleteProject(testConceptionId);
            // Vérifier que le projet n'existe plus
            const deleted = await getProjectById(testConceptionId);
            logTest(
                'Supprimer une conception',
                !deleted,
                { id: testConceptionId, supprimé: !deleted }
            );
        } catch (error) {
            logTest('Supprimer une conception', false, null, error.message);
        }
    } else {
        logTest('Supprimer une conception', false, null, 'Aucun ID de test disponible');
    }

    console.log('═══════════════════════════════════════════');
    console.log('TEST 11 : Statistiques finales');
    console.log('═══════════════════════════════════════════\n');

    try {
        const allProjects = await getProjects();
        const chantiers = await getProjects('chantiers');
        const conceptions = await getProjects('conceptions');

        const stats = {
            total: allProjects.length,
            chantiers: chantiers.length,
            conceptions: conceptions.length,
            actifs: allProjects.filter(p => p.status === 'active').length,
            completés: allProjects.filter(p => p.status === 'completed').length,
            brouillons: allProjects.filter(p => p.status === 'draft').length
        };

        logTest('Statistiques finales', true, stats);
    } catch (error) {
        logTest('Statistiques finales', false, null, error.message);
    }

    console.log('\n═══════════════════════════════════════════');
    console.log('🎉 TESTS TERMINÉS');
    console.log('═══════════════════════════════════════════\n');

    console.log('📊 Résumé :');
    console.log('   - Si tous les tests sont ✅, votre système fonctionne parfaitement !');
    console.log('   - Si des tests sont ❌, vérifiez les erreurs ci-dessus');
    console.log('   - Consultez INITIALISATION_CHANTIERS_CONCEPTIONS.md pour le dépannage\n');
}

// Exécuter les tests
runTests().catch(error => {
    console.error('❌ Erreur critique lors des tests:', error);
});

// Export pour utilisation en module
export { runTests };
