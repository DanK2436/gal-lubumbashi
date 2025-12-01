/**
 * storage.js - Stockage de données avec Supabase UNIQUEMENT
 * GAL - Groupement des Artisans de Lubumbashi
 * 
 * Ce module utilise UNIQUEMENT Supabase pour toutes les opérations
 */

import { supabase } from './supabase-init.js';
import {
  getCollection,
  getDocument,
  addDocument,
  updateDocument as supabaseUpdate,
  deleteDocument as supabaseDelete,
  queryDocuments
} from './supabase-service.js';

// Clés de stockage (pour compatibilité - langue et auth restent en localStorage)
const STORAGE_KEYS = {
  AUTH: 'gal_auth',
  LANGUAGE: 'gal_language',
  CHATBOT_HISTORY: 'gal_chatbot_history'
};

/**
 * Initialise le stockage
 */
export async function initStorage() {
  if (!supabase) {
    console.error('❌ ERREUR : Supabase n\'est pas configuré !');
    console.error('Configurez vos clés dans js/supabase-init.js');
    throw new Error('Supabase non configuré');
  }

  console.log('✅ Utilisation de Supabase pour le stockage');
}

// ===== FORMATIONS =====

export async function getFormations() {
  return await getCollection('formations', { orderBy: 'created_at', ascending: false });
}

export async function getFormationById(id) {
  return await getDocument('formations', id);
}

export async function createFormation(formation) {
  return await addDocument('formations', formation);
}

export async function updateFormation(id, updates) {
  return await supabaseUpdate('formations', id, updates);
}

export async function deleteFormation(id) {
  return await supabaseDelete('formations', id);
}

// ===== MACHINES =====

export async function getMachines() {
  return await getCollection('machines', { orderBy: 'name', ascending: true });
}

export async function getMachineById(id) {
  return await getDocument('machines', id);
}

export async function getMachineBySlug(slug) {
  const machines = await getMachines();
  return machines.find(m => m.slug === slug);
}

export async function createMachine(machine) {
  return await addDocument('machines', machine);
}

export async function updateMachine(id, updates) {
  return await supabaseUpdate('machines', id, updates);
}

export async function deleteMachine(id) {
  return await supabaseDelete('machines', id);
}

// ===== VIDÉOS =====

export async function getVideos() {
  return await getCollection('videos', { orderBy: 'created_at', ascending: false });
}

export async function getVideoById(id) {
  return await getDocument('videos', id);
}

export async function createVideo(video) {
  return await addDocument('videos', video);
}

export async function updateVideo(id, updates) {
  return await supabaseUpdate('videos', id, updates);
}

export async function deleteVideo(id) {
  return await supabaseDelete('videos', id);
}

// ===== BLOG =====

export async function getBlogPosts() {
  return await getCollection('blog_posts', { orderBy: 'created_at', ascending: false });
}

export async function getBlogPostById(id) {
  return await getDocument('blog_posts', id);
}

export async function getBlogPostBySlug(slug) {
  const posts = await getBlogPosts();
  return posts.find(p => p.slug === slug);
}

export async function createBlogPost(post) {
  return await addDocument('blog_posts', post);
}

export async function updateBlogPost(id, updates) {
  return await supabaseUpdate('blog_posts', id, updates);
}

export async function deleteBlogPost(id) {
  return await supabaseDelete('blog_posts', id);
}

// ===== NEWSLETTER =====

export async function getNewsletterSubscribers() {
  return await getCollection('newsletter_subscribers', { orderBy: 'subscribed_at', ascending: false });
}

export async function addNewsletterSubscriber(email) {
  try {
    const newSub = await addDocument('newsletter_subscribers', { email });
    return newSub;
  } catch (error) {
    if (error.message && error.message.includes('duplicate')) {
      throw new Error('Cet email est déjà inscrit');
    }
    throw error;
  }
}

export async function removeNewsletterSubscriber(email) {
  const subs = await getCollection('newsletter_subscribers');
  const toDelete = subs.find(s => s.email === email);
  if (toDelete) {
    await supabaseDelete('newsletter_subscribers', toDelete.id);
  }
  return true;
}

export async function exportNewsletterCSV() {
  const subscribers = await getNewsletterSubscribers();
  let csv = 'Email,Date d\'inscription\n';
  subscribers.forEach(sub => {
    const date = sub.subscribed_at;
    csv += `${sub.email},${new Date(date).toLocaleDateString('fr-FR')}\n`;
  });
  return csv;
}

// Alias for newsletter subscription
export async function saveNewsletter(email) {
  return await addNewsletterSubscriber(email);
}

// ===== CONTACTS =====

export async function saveContact(contactData) {
  return await addDocument('contact_messages', {
    name: contactData.name,
    email: contactData.email,
    subject: contactData.subject || '',
    message: contactData.message,
    status: 'new'
  });
}

export async function getContacts() {
  return await getCollection('contact_messages', { orderBy: 'created_at', ascending: false });
}

// ===== RÉSERVATIONS MACHINES =====

export async function getReservations() {
  return await getCollection('machine_reservations', { orderBy: 'created_at', ascending: false });
}

export async function saveReservation(reservationData) {
  return await addDocument('machine_reservations', {
    ...reservationData,
    status: reservationData.status || 'pending'
  });
}

export async function deleteReservation(id) {
  return await supabaseDelete('machine_reservations', id);
}

export async function updateReservationStatus(id, status) {
  return await supabaseUpdate('machine_reservations', id, { status });
}

// ===== INSCRIPTIONS FORMATIONS =====

export async function getFormationRegistrations() {
  return await getCollection('formation_reservations', { orderBy: 'created_at', ascending: false });
}

export async function saveFormationRegistration(registrationData) {
  return await addDocument('formation_reservations', {
    ...registrationData,
    status: registrationData.status || 'pending'
  });
}

export async function deleteFormationRegistration(id) {
  return await supabaseDelete('formation_reservations', id);
}

export async function updateFormationRegistrationStatus(id, status) {
  return await supabaseUpdate('formation_reservations', id, { status });
}

// ===== MEMBRES =====

export async function getMembers() {
  return await getCollection('members', { orderBy: 'created_at', ascending: false });
}

export async function getMemberById(id) {
  return await getDocument('members', id);
}

export async function getMemberByEmail(email) {
  const members = await getCollection('members');
  return members.find(m => m.email === email);
}

export async function createMember(member) {
  // Vérifier si l'email existe déjà
  const existing = await getMemberByEmail(member.email);
  if (existing) {
    throw new Error('Cet email est déjà utilisé');
  }

  return await addDocument('members', {
    ...member,
    status: member.status || 'active'
  });
}

export async function updateMember(id, updates) {
  return await supabaseUpdate('members', id, updates);
}

export async function deleteMember(id) {
  return await supabaseDelete('members', id);
}

// ===== PAGES STATIQUES (localStorage temporairement) =====

export async function getPages() {
  // TODO: Migrer vers Supabase si nécessaire
  const data = localStorage.getItem('gal_pages');
  return data ? JSON.parse(data) : {};
}

export async function updatePages(updates) {
  // TODO: Migrer vers Supabase si nécessaire
  const pages = await getPages();
  const updated = { ...pages, ...updates };
  localStorage.setItem('gal_pages', JSON.stringify(updated));
  return updated;
}

// ===== AUTHENTIFICATION (localStorage pour la session) =====

export async function login(email, password) {
  // Mock authentication - TODO: Implémenter avec Supabase Auth
  if (email === 'admin@gal-lubumbashi.com' && password === 'Admin123!') {
    const session = {
      email,
      role: 'admin',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
    return session;
  }
  throw new Error('Email ou mot de passe incorrect');
}

export async function logout() {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
  return true;
}

export async function getSession() {
  const data = localStorage.getItem(STORAGE_KEYS.AUTH);
  return data ? JSON.parse(data) : null;
}

export async function isAuthenticated() {
  const session = await getSession();
  return session !== null;
}

// ===== CHATBOT (localStorage) =====

export async function getChatbotHistory() {
  const data = localStorage.getItem(STORAGE_KEYS.CHATBOT_HISTORY);
  return data ? JSON.parse(data) : [];
}

export async function saveChatbotMessage(message) {
  const history = await getChatbotHistory();
  history.push({
    ...message,
    timestamp: new Date().toISOString()
  });

  // Garder seulement les 50 derniers messages
  if (history.length > 50) {
    history.shift();
  }

  localStorage.setItem(STORAGE_KEYS.CHATBOT_HISTORY, JSON.stringify(history));
  return message;
}

export async function clearChatbotHistory() {
  localStorage.setItem(STORAGE_KEYS.CHATBOT_HISTORY, JSON.stringify([]));
  return true;
}

// ===== LANGUE (localStorage) =====

export async function getLanguage() {
  return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
}

export async function setLanguage(lang) {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  return lang;
}

// ===== EXPORT PAR DÉFAUT =====
export default {
  initStorage,
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getFormations,
  getFormationById,
  createFormation,
  updateFormation,
  deleteFormation,
  getMachines,
  getMachineById,
  getMachineBySlug,
  createMachine,
  updateMachine,
  deleteMachine,
  getBlogPosts,
  getBlogPostById,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getNewsletterSubscribers,
  addNewsletterSubscriber,
  removeNewsletterSubscriber,
  exportNewsletterCSV,
  saveNewsletter,
  getPages,
  updatePages,
  login,
  logout,
  getSession,
  isAuthenticated,
  getChatbotHistory,
  saveChatbotMessage,
  clearChatbotHistory,
  getLanguage,
  setLanguage,
  getReservations,
  saveReservation,
  deleteReservation,
  updateReservationStatus,
  getFormationRegistrations,
  saveFormationRegistration,
  deleteFormationRegistration,
  updateFormationRegistrationStatus,
  getMembers,
  getMemberById,
  getMemberByEmail,
  createMember,
  updateMember,
  deleteMember,
  saveContact,
  getContacts
};
