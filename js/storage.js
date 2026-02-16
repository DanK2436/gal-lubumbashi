/**
 * storage.js - Stockage de données avec Supabase
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { supabase } from './supabase-init.js';
import {
  getCollection,
  getDocument,
  addDocument,
  updateDocument as supabaseUpdate,
  deleteDocument as supabaseDelete,
  queryDocuments,
  countDocuments,
  executeRpc
} from './supabase-service.js';

// Clés de stockage
const STORAGE_KEYS = {
  AUTH: 'gal_auth',
  LANGUAGE: 'gal_language'
};

/**
 * Initialise le stockage
 */
export async function initStorage() {
  if (!supabase) {
    console.error('❌ ERREUR : Supabase n\'est pas configuré !');
    throw new Error('Supabase non configuré');
  }
  console.log('✅ Utilisation de Supabase pour le stockage');
}

// ===== VIDEOS =====

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
  return await getCollection('machines', { orderBy: 'created_at', ascending: false });
}

export async function getMachineById(id) {
  return await getDocument('machines', id);
}

export async function getMachineBySlug(slug) {
  const results = await queryDocuments('machines', 'slug', 'eq', slug);
  return results && results.length > 0 ? results[0] : null;
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

// ===== BLOG POSTS =====

export async function getBlogPosts() {
  // Optionnellement filtrer par published_at si présent
  return await getCollection('blog_posts', { orderBy: 'created_at', ascending: false });
}

export async function getBlogPostById(id) {
  return await getDocument('blog_posts', id);
}

export async function getBlogPostBySlug(slug) {
  const results = await queryDocuments('blog_posts', 'slug', 'eq', slug);
  return results && results.length > 0 ? results[0] : null;
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
  // Vérifier si déjà inscrit
  const existing = await queryDocuments('newsletter_subscribers', 'email', 'eq', email);
  if (existing && existing.length > 0) {
    throw new Error('déjà inscrit');
  }

  return await addDocument('newsletter_subscribers', {
    email
  });
}

export async function removeNewsletterSubscriber(id) {
  return await supabaseDelete('newsletter_subscribers', id);
}

export async function exportNewsletterCSV() {
  const subscribers = await getNewsletterSubscribers();
  if (!subscribers.length) return '';

  const headers = 'Email,Date Inscription\n';
  const rows = subscribers.map(s => `${s.email},${s.created_at}`).join('\n');
  return headers + rows;
}

export async function saveNewsletter(data) {
  // Logique pour sauvegarder une notification/log de newsletter
  return await addDocument('newsletter_notifications_log', data);
}

// ===== RESERVATIONS & INSCRIPTIONS =====

export async function getReservations() {
  return await getCollection('machine_reservations', { orderBy: 'created_at', ascending: false });
}

export async function saveReservation(reservation) {
  return await addDocument('machine_reservations', reservation);
}

export async function deleteReservation(id) {
  return await supabaseDelete('machine_reservations', id);
}

export async function updateReservationStatus(id, status) {
  return await supabaseUpdate('machine_reservations', id, { status });
}

export async function getFormationRegistrations() {
  return await getCollection('formation_reservations', { orderBy: 'created_at', ascending: false });
}

export async function saveFormationRegistration(registration) {
  return await addDocument('formation_reservations', registration);
}

export async function deleteFormationRegistration(id) {
  return await supabaseDelete('formation_reservations', id);
}

export async function updateFormationRegistrationStatus(id, status) {
  return await supabaseUpdate('formation_reservations', id, { status });
}

// ===== MEMBRES =====

export async function getMembers() {
  return await getCollection('members', { orderBy: 'name', ascending: true });
}

export async function getMemberById(id) {
  return await getDocument('members', id);
}

export async function getMemberByEmail(email) {
  const results = await queryDocuments('members', 'email', 'eq', email);
  return results && results.length > 0 ? results[0] : null;
}

export async function createMember(member) {
  const existing = await getMemberByEmail(member.email);
  if (existing) {
    throw new Error('Cet email est déjà utilisé');
  }

  let authUserId = null;

  if (member.password) {
    try {
      authUserId = await executeRpc('create_user_command', {
        email: member.email,
        password: member.password,
        user_metadata: {
          name: member.name,
          phone: member.phone || ''
        }
      });
    } catch (authError) {
      console.error('Erreur création Auth:', authError);
      throw new Error('Erreur création compte connexion: ' + authError.message);
    }
  }

  return await addDocument('members', {
    ...member,
    auth_user_id: authUserId,
    status: member.status || 'active'
  });
}

export async function updateMember(id, updates) {
  // Si un mot de passe est fourni dans les mises à jour, on doit aussi mettre à jour Supabase Auth
  if (updates.password) {
    try {
      const member = await getMemberById(id);
      if (member && member.email) {
        await executeRpc('update_user_password_command', {
          target_email: member.email,
          new_password: updates.password
        });
        console.log('Mot de passe Auth mis à jour pour:', member.email);
      }
    } catch (authError) {
      console.error('Erreur mise à jour Auth password:', authError);
      // On continue quand même la mise à jour de la table members, ou on bloque ?
      // Pour la sécurité, il vaut mieux que les deux soient synchronisés.
    }
  }
  return await supabaseUpdate('members', id, updates);
}

export async function deleteMember(id) {
  return await supabaseDelete('members', id);
}

// ===== CONTACTS =====

export async function saveContact(contact) {
  return await addDocument('contact_messages', contact);
}

export async function getContacts() {
  return await getCollection('contact_messages', { orderBy: 'created_at', ascending: false });
}

// ===== PROJECTS (CHANTIERS & CONCEPTIONS) =====

export async function getProjects(type = null) {
  if (type) {
    let dbType = type;
    if (type === 'chantiers') dbType = 'chantier';
    if (type === 'conceptions') dbType = 'conception';

    return await queryDocuments('projects', 'type', 'eq', dbType);
  }
  return await getCollection('projects', { orderBy: 'created_at', ascending: false });
}

export async function getProjectById(id) {
  return await getDocument('projects', id);
}

export async function createProject(project) {
  let type = project.type;
  if (type === 'chantiers') type = 'chantier';
  if (type === 'conceptions') type = 'conception';

  const dbData = {
    ...project,
    type: type,
    status: project.status || 'active'
  };
  const result = await addDocument('projects', dbData);

  await notifyAllMembers({
    title: type === 'chantier' ? 'Nouveau Chantier' : 'Nouvelle Conception',
    message: `Un nouveau projet a été publié : ${project.title}`,
    type: 'project',
    link: type === 'chantier' ? 'chantiers.html' : 'conceptions.html'
  });

  return result;
}

export async function updateProject(id, updates) {
  const dbUpdates = { ...updates };
  if (dbUpdates.type === 'chantiers') dbUpdates.type = 'chantier';
  if (dbUpdates.type === 'conceptions') dbUpdates.type = 'conception';
  return await supabaseUpdate('projects', id, dbUpdates);
}

export async function deleteProject(id) {
  return await supabaseDelete('projects', id);
}

// ===== MESSAGES =====

export async function getMessages() {
  return await getCollection('messages', { orderBy: 'sent_at', ascending: false });
}

export async function getMessageById(id) {
  return await getDocument('messages', id);
}

export async function getMessagesByRecipient(recipientId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('recipient_id', recipientId)
    .order('sent_at', { ascending: false });

  if (error) {
    console.error('Erreur getMessagesByRecipient:', error);
    return [];
  }
  return data;
}

export async function createMessage(message) {
  const dbData = {
    recipient_id: message.recipient_id || message.recipientId,
    subject: message.subject,
    content: message.content || message.message,
    sender: message.sender || 'Admin',
    read: false,
    sent_at: message.sent_at || new Date().toISOString()
  };
  const result = await addDocument('messages', dbData);

  if (dbData.recipient_id && dbData.recipient_id !== 'all') {
    await createNotification({
      user_id: dbData.recipient_id,
      title: 'Nouveau Message Privé',
      message: `Vous avez reçu un message : ${dbData.subject}`,
      type: 'info',
      link: 'messages.html'
    });
  } else {
    await notifyAllMembers({
      title: 'Nouveau Message Global',
      message: `Un nouveau message important : ${dbData.subject}`,
      type: 'info',
      link: 'messages.html'
    });
  }

  return result;
}

export async function updateMessage(id, updates) {
  const dbUpdates = { ...updates };
  if (dbUpdates.message) {
    dbUpdates.content = dbUpdates.message;
    delete dbUpdates.message;
  }
  return await supabaseUpdate('messages', id, dbUpdates);
}

export async function deleteMessage(id) {
  return await supabaseDelete('messages', id);
}

// ===== ANNOUNCEMENTS =====

export async function getAnnouncements() {
  return await getCollection('announcements', { orderBy: 'sent_at', ascending: false });
}

export async function getAnnouncementById(id) {
  return await getDocument('announcements', id);
}

export async function createAnnouncement(announcement) {
  const dbData = {
    title: announcement.title || announcement.subject,
    content: announcement.content || announcement.message,
    sender: announcement.sender || 'Admin',
    priority: announcement.priority || 'normal',
    sent_at: announcement.sent_at || new Date().toISOString()
  };
  const result = await addDocument('announcements', dbData);

  await notifyAllMembers({
    title: 'Nouvelle Annonce',
    message: `Une annonce importante a été publiée : ${dbData.title}`,
    type: 'announcement',
    link: 'annonces.html'
  });

  return result;
}

export async function updateAnnouncement(id, updates) {
  const dbUpdates = { ...updates };
  if (dbUpdates.subject) {
    dbUpdates.title = dbUpdates.subject;
    delete dbUpdates.subject;
  }
  return await supabaseUpdate('announcements', id, dbUpdates);
}

export async function deleteAnnouncement(id) {
  return await supabaseDelete('announcements', id);
}

// ===== CHATBOT =====

export async function getChatbotConversations(userId = null) {
  if (!supabase) return [];
  let query = supabase.from('chatbot_conversations').select('*').order('updated_at', { ascending: false });
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) return [];
  return data;
}

export async function updateChatbotConversation(id, updates) {
  return await supabaseUpdate('chatbot_conversations', id, {
    ...updates,
    updated_at: new Date().toISOString()
  });
}

export async function deleteChatbotConversation(id) {
  return await supabaseDelete('chatbot_conversations', id);
}

export async function getChatbotKnowledge() {
  return await getCollection('chatbot_knowledge');
}

// ===== NOTIFICATIONS =====

export async function getNotifications(userId = null) {
  if (!userId) return [];
  return await queryDocuments('notifications', 'user_id', 'eq', userId);
}

export async function getUnreadNotificationsCount(userId) {
  if (!supabase || !userId) return 0;
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  return error ? 0 : count;
}

export async function markNotificationAsRead(id) {
  return await supabaseUpdate('notifications', id, { is_read: true });
}

export async function createNotification(notification) {
  return await addDocument('notifications', notification);
}

export async function notifyAllMembers(notificationBase) {
  const members = await getMembers();
  const promises = members.map(member => createNotification({
    ...notificationBase,
    user_id: member.id
  }));
  return Promise.all(promises);
}

// ===== PAGES STATIQUES =====

export async function getPages() {
  const data = localStorage.getItem('gal_pages');
  return data ? JSON.parse(data) : {};
}

export async function updatePages(updates) {
  const pages = await getPages();
  const updated = { ...pages, ...updates };
  localStorage.setItem('gal_pages', JSON.stringify(updated));
  return updated;
}

// ===== AUTHENTIFICATION =====

export async function login(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const session = {
      email: data.user.email,
      role: data.user.email === 'admin@gal-lubumbashi.com' ? 'admin' : 'member',
      id: data.user.id,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
    return session;
  } catch (error) {
    console.error('Erreur de connexion:', error.message);
    throw new Error('Email ou mot de passe incorrect');
  }
}

export async function logout() {
  await supabase.auth.signOut();
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

// ===== LANGUE =====

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
  getVideos, getVideoById, createVideo, updateVideo, deleteVideo,
  getFormations, getFormationById, createFormation, updateFormation, deleteFormation,
  getMachines, getMachineById, getMachineBySlug, createMachine, updateMachine, deleteMachine,
  getBlogPosts, getBlogPostById, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost,
  getNewsletterSubscribers, addNewsletterSubscriber, removeNewsletterSubscriber, exportNewsletterCSV, saveNewsletter,
  getReservations, saveReservation, deleteReservation, updateReservationStatus,
  getFormationRegistrations, saveFormationRegistration, deleteFormationRegistration, updateFormationRegistrationStatus,
  getMembers, getMemberById, getMemberByEmail, createMember, updateMember, deleteMember,
  saveContact, getContacts,
  getProjects, getProjectById, createProject, updateProject, deleteProject,
  getMessages, getMessageById, getMessagesByRecipient, createMessage, updateMessage, deleteMessage,
  getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  getNotifications, getUnreadNotificationsCount, markNotificationAsRead, createNotification, notifyAllMembers,
  getPages, updatePages,
  login, logout, getSession, isAuthenticated,
  getLanguage, setLanguage
};
