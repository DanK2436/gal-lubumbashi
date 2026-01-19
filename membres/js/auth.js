/**
 * auth.js - Gestion de l'authentification membres
 * GAL - Groupement des Artisans de Lubumbashi
 */

/**
 * Vérifier si l'utilisateur est connecté
 */
export function isAuthenticated() {
    return !!(localStorage.getItem('memberToken') || sessionStorage.getItem('memberToken'));
}

/**
 * Obtenir les données du membre connecté
 */
export function getCurrentMember() {
    const data = localStorage.getItem('memberData');
    return data ? JSON.parse(data) : null;
}

/**
 * Déconnexion
 */
export function logout() {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberData');
    sessionStorage.removeItem('memberToken');
    window.location.href = '../login.html';
}
