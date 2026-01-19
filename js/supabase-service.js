<<<<<<< HEAD
import { supabase } from './supabase-init.js';

// Vérifie si Supabase est actif
const isSupabaseReady = () => !!supabase;

// ================= AUTHENTIFICATION =================

/**
 * Connexion avec email/mot de passe
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User object
 */
export async function supabaseLogin(email, password) {
    if (!isSupabaseReady()) throw new Error("Supabase non configuré");
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data.user;
    } catch (error) {
        console.error("Erreur Login Supabase:", error);
        throw error;
    }
}

/**
 * Inscription avec email/mot de passe
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User object
 */
export async function supabaseRegister(email, password) {
    if (!isSupabaseReady()) throw new Error("Supabase non configuré");
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw error;
        return data.user;
    } catch (error) {
        console.error("Erreur Inscription Supabase:", error);
        throw error;
    }
}

/**
 * Déconnexion
 */
export async function supabaseLogout() {
    if (!isSupabaseReady()) return;
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (error) {
        console.error("Erreur Logout Supabase:", error);
        throw error;
    }
}

/**
 * Obtenir l'utilisateur actuellement connecté
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
    if (!isSupabaseReady()) return null;
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.error("Erreur getCurrentUser:", error);
        return null;
    }
}

/**
 * Écouter les changements d'état d'authentification
 * @param {Function} callback 
 */
export function onAuthStateChange(callback) {
    if (!isSupabaseReady()) return () => { };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
    });

    // Retourne une fonction pour se désabonner
    return () => subscription.unsubscribe();
}

// ================= GESTION DES DONNÉES (CRUD GÉNÉRIQUE) =================

/**
 * Récupérer une table entière
 * @param {string} tableName - Nom de la table
 * @param {Object} options - Options de requête (select, order, limit, etc.)
 * @returns {Promise<Array>}
 */
export async function getCollection(tableName, options = {}) {
    if (!isSupabaseReady()) return [];
    try {
        let query = supabase.from(tableName).select(options.select || '*');

        // Ajout des options de tri
        if (options.orderBy) {
            query = query.order(options.orderBy, {
                ascending: options.ascending !== false
            });
        }

        // Ajout de la limite
        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error(`Erreur getCollection ${tableName}:`, error);
        return [];
    }
}

/**
 * Récupérer un document par ID
 * @param {string} tableName 
 * @param {string|number} id 
 * @returns {Promise<Object|null>}
 */
export async function getDocument(tableName, id) {
    if (!isSupabaseReady()) return null;
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Erreur getDocument ${tableName}:`, error);
        return null;
    }
}

/**
 * Ajouter un document
 * @param {string} tableName 
 * @param {Object} data 
 * @returns {Promise<Object>}
 */
export async function addDocument(tableName, data) {
    if (!isSupabaseReady()) return null;
    try {
        const { data: newData, error } = await supabase
            .from(tableName)
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return newData;
    } catch (error) {
        console.error(`Erreur addDocument ${tableName}:`, error);
        throw error;
    }
}

/**
 * Mettre à jour un document
 * @param {string} tableName 
 * @param {string|number} id 
 * @param {Object} data 
 * @returns {Promise<Object>}
 */
export async function updateDocument(tableName, id, data) {
    if (!isSupabaseReady()) return null;
    try {
        const { data: updatedData, error } = await supabase
            .from(tableName)
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return updatedData;
    } catch (error) {
        console.error(`Erreur updateDocument ${tableName}:`, error);
        throw error;
    }
}

/**
 * Supprimer un document
 * @param {string} tableName 
 * @param {string|number} id 
 * @returns {Promise<boolean>}
 */
export async function deleteDocument(tableName, id) {
    if (!isSupabaseReady()) return false;
    try {
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Erreur deleteDocument ${tableName}:`, error);
        throw error;
    }
}

/**
 * Rechercher des documents avec une condition
 * @param {string} tableName 
 * @param {string} column - Colonne à filtrer
 * @param {string} operator - Opérateur (eq, neq, gt, gte, lt, lte, like, ilike, etc.)
 * @param {*} value - Valeur à comparer
 * @returns {Promise<Array>}
 */
export async function queryDocuments(tableName, column, operator, value) {
    if (!isSupabaseReady()) return [];
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
        [operator](column, value);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error(`Erreur queryDocuments ${tableName}:`, error);
        return [];
    }
}

/**
 * Compter le nombre de documents dans une table
 * @param {string} tableName 
 * @returns {Promise<number>}
 */
export async function countDocuments(tableName) {
    if (!isSupabaseReady()) return 0;
    try {
        const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error(`Erreur countDocuments ${tableName}:`, error);
        return 0;
    }
}

// ================= FONCTIONS SPÉCIFIQUES =================

/**
 * Récupérer un membre par email
 * @param {string} email 
 * @returns {Promise<Object|null>}
 */
export async function getMemberByEmail(email) {
    if (!isSupabaseReady()) return null;
    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            // Si aucun résultat n'est trouvé, retourner null au lieu de lancer une erreur
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Erreur getMemberByEmail:", error);
        return null;
    }
}

// ================= STOCKAGE DE FICHIERS =================

/**
 * Upload un fichier dans un bucket Supabase Storage
 * @param {string} bucketName - Nom du bucket
 * @param {string} filePath - Chemin du fichier dans le bucket
 * @param {File|Blob} file - Fichier à uploader
 * @returns {Promise<Object>}
 */
export async function uploadFile(bucketName, filePath, file) {
    if (!isSupabaseReady()) return null;
    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Erreur uploadFile ${bucketName}:`, error);
        throw error;
    }
}

/**
 * Obtenir l'URL publique d'un fichier
 * @param {string} bucketName 
 * @param {string} filePath 
 * @returns {string}
 */
export function getFileUrl(bucketName, filePath) {
    if (!isSupabaseReady()) return null;
    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

/**
 * Supprimer un fichier
 * @param {string} bucketName 
 * @param {string} filePath 
 * @returns {Promise<boolean>}
 */
export async function deleteFile(bucketName, filePath) {
    if (!isSupabaseReady()) return false;
    try {
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Erreur deleteFile ${bucketName}:`, error);
        throw error;
    }
}
=======
import { supabase } from './supabase-init.js';

// Vérifie si Supabase est actif
const isSupabaseReady = () => !!supabase;

// ================= AUTHENTIFICATION =================

/**
 * Connexion avec email/mot de passe
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User object
 */
export async function supabaseLogin(email, password) {
    if (!isSupabaseReady()) throw new Error("Supabase non configuré");
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data.user;
    } catch (error) {
        console.error("Erreur Login Supabase:", error);
        throw error;
    }
}

/**
 * Inscription avec email/mot de passe
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User object
 */
export async function supabaseRegister(email, password) {
    if (!isSupabaseReady()) throw new Error("Supabase non configuré");
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw error;
        return data.user;
    } catch (error) {
        console.error("Erreur Inscription Supabase:", error);
        throw error;
    }
}

/**
 * Déconnexion
 */
export async function supabaseLogout() {
    if (!isSupabaseReady()) return;
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (error) {
        console.error("Erreur Logout Supabase:", error);
        throw error;
    }
}

/**
 * Obtenir l'utilisateur actuellement connecté
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
    if (!isSupabaseReady()) return null;
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.error("Erreur getCurrentUser:", error);
        return null;
    }
}

/**
 * Écouter les changements d'état d'authentification
 * @param {Function} callback 
 */
export function onAuthStateChange(callback) {
    if (!isSupabaseReady()) return () => { };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
    });

    // Retourne une fonction pour se désabonner
    return () => subscription.unsubscribe();
}

// ================= GESTION DES DONNÉES (CRUD GÉNÉRIQUE) =================

/**
 * Récupérer une table entière
 * @param {string} tableName - Nom de la table
 * @param {Object} options - Options de requête (select, order, limit, etc.)
 * @returns {Promise<Array>}
 */
export async function getCollection(tableName, options = {}) {
    if (!isSupabaseReady()) return [];
    try {
        let query = supabase.from(tableName).select(options.select || '*');

        // Ajout des options de tri
        if (options.orderBy) {
            query = query.order(options.orderBy, {
                ascending: options.ascending !== false
            });
        }

        // Ajout de la limite
        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error(`Erreur getCollection ${tableName}:`, error);
        return [];
    }
}

/**
 * Récupérer un document par ID
 * @param {string} tableName 
 * @param {string|number} id 
 * @returns {Promise<Object|null>}
 */
export async function getDocument(tableName, id) {
    if (!isSupabaseReady()) return null;
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Erreur getDocument ${tableName}:`, error);
        return null;
    }
}

/**
 * Ajouter un document
 * @param {string} tableName 
 * @param {Object} data 
 * @returns {Promise<Object>}
 */
export async function addDocument(tableName, data) {
    if (!isSupabaseReady()) return null;
    try {
        const { data: newData, error } = await supabase
            .from(tableName)
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return newData;
    } catch (error) {
        console.error(`Erreur addDocument ${tableName}:`, error);
        throw error;
    }
}

/**
 * Mettre à jour un document
 * @param {string} tableName 
 * @param {string|number} id 
 * @param {Object} data 
 * @returns {Promise<Object>}
 */
export async function updateDocument(tableName, id, data) {
    if (!isSupabaseReady()) return null;
    try {
        const { data: updatedData, error } = await supabase
            .from(tableName)
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return updatedData;
    } catch (error) {
        console.error(`Erreur updateDocument ${tableName}:`, error);
        throw error;
    }
}

/**
 * Supprimer un document
 * @param {string} tableName 
 * @param {string|number} id 
 * @returns {Promise<boolean>}
 */
export async function deleteDocument(tableName, id) {
    if (!isSupabaseReady()) return false;
    try {
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Erreur deleteDocument ${tableName}:`, error);
        throw error;
    }
}

/**
 * Rechercher des documents avec une condition
 * @param {string} tableName 
 * @param {string} column - Colonne à filtrer
 * @param {string} operator - Opérateur (eq, neq, gt, gte, lt, lte, like, ilike, etc.)
 * @param {*} value - Valeur à comparer
 * @returns {Promise<Array>}
 */
export async function queryDocuments(tableName, column, operator, value) {
    if (!isSupabaseReady()) return [];
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
        [operator](column, value);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error(`Erreur queryDocuments ${tableName}:`, error);
        return [];
    }
}

// ================= FONCTIONS SPÉCIFIQUES =================

/**
 * Récupérer un membre par email
 * @param {string} email 
 * @returns {Promise<Object|null>}
 */
export async function getMemberByEmail(email) {
    if (!isSupabaseReady()) return null;
    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            // Si aucun résultat n'est trouvé, retourner null au lieu de lancer une erreur
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Erreur getMemberByEmail:", error);
        return null;
    }
}

// ================= STOCKAGE DE FICHIERS =================

/**
 * Upload un fichier dans un bucket Supabase Storage
 * @param {string} bucketName - Nom du bucket
 * @param {string} filePath - Chemin du fichier dans le bucket
 * @param {File|Blob} file - Fichier à uploader
 * @returns {Promise<Object>}
 */
export async function uploadFile(bucketName, filePath, file) {
    if (!isSupabaseReady()) return null;
    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Erreur uploadFile ${bucketName}:`, error);
        throw error;
    }
}

/**
 * Obtenir l'URL publique d'un fichier
 * @param {string} bucketName 
 * @param {string} filePath 
 * @returns {string}
 */
export function getFileUrl(bucketName, filePath) {
    if (!isSupabaseReady()) return null;
    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

/**
 * Supprimer un fichier
 * @param {string} bucketName 
 * @param {string} filePath 
 * @returns {Promise<boolean>}
 */
export async function deleteFile(bucketName, filePath) {
    if (!isSupabaseReady()) return false;
    try {
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Erreur deleteFile ${bucketName}:`, error);
        throw error;
    }
}
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
