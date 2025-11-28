/**
 * storage.js - Abstraction du stockage de données (localStorage)
 * GAL - Groupement des Artisans de Lubumbashi
 * 
 * Ce module peut être facilement remplacé par des appels API réels
 */

// Clés de stockage
const STORAGE_KEYS = {
  VIDEOS: 'gal_videos',
  FORMATIONS: 'gal_formations',
  MACHINES: 'gal_machines',
  BLOG: 'gal_blog',
  NEWSLETTER: 'gal_newsletter',
  PAGES: 'gal_pages',
  AUTH: 'gal_auth',
  LANGUAGE: 'gal_language',
  CHATBOT_HISTORY: 'gal_chatbot_history'
};

// Helper pour obtenir le chemin de base correct (GitHub Pages support)
const getBasePath = () => {
  const path = window.location.pathname;
  // Si on est dans un sous-dossier (html, admin, membres)
  if (path.includes('/html/') || path.includes('/admin/') || path.includes('/membres/')) {
    return '../';
  }
  // Si on est à la racine (index.html ou /)
  return './';
};

/**
 * Initialise le stockage avec les données par défaut si nécessaire
 */
export async function initStorage() {
  const basePath = getBasePath();
  // Charger les données depuis les fichiers JSON si le localStorage est vide
  const loadPromises = [];

  if (!localStorage.getItem(STORAGE_KEYS.VIDEOS)) {
    loadPromises.push(
      fetch(`${basePath}data/videos.json`)
        .then(res => res.json())
        .then(data => localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(data)))
        .catch(() => localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify([])))
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.FORMATIONS)) {
    loadPromises.push(
      fetch(`${basePath}data/formations.json`)
        .then(res => res.json())
        .then(data => localStorage.setItem(STORAGE_KEYS.FORMATIONS, JSON.stringify(data)))
        .catch(() => localStorage.setItem(STORAGE_KEYS.FORMATIONS, JSON.stringify([])))
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.MACHINES)) {
    loadPromises.push(
      fetch(`${basePath}data/machines.json`)
        .then(res => res.json())
        .then(data => localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(data)))
        .catch(() => localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify([])))
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.BLOG)) {
    loadPromises.push(
      fetch(`${basePath}data/blog.json`)
        .then(res => res.json())
        .then(data => localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(data)))
        .catch(() => localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify([])))
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.NEWSLETTER)) {
    loadPromises.push(
      fetch(`${basePath}data/newsletter.json`)
        .then(res => res.json())
        .then(data => localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(data)))
        .catch(() => localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify({ subscribers: [] })))
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.PAGES)) {
    loadPromises.push(
      fetch(`${basePath}data/pages.json`)
        .then(res => res.json())
        .then(data => localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(data)))
        .catch(() => localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify({})))
    );
  }

  // Attendre que toutes les promesses soient résolues
  await Promise.all(loadPromises);
}

// ===== VIDÉOS COURTES =====

export async function getVideos() {
  const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
  return data ? JSON.parse(data) : [];
}

export async function getVideoById(id) {
  const videos = await getVideos();
  return videos.find(v => v.id === id);
}

export async function createVideo(video) {
  const videos = await getVideos();
  const newVideo = {
    ...video,
    id: Date.now().toString()
  };
  videos.push(newVideo);
  localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  return newVideo;
}

export async function updateVideo(id, updates) {
  const videos = await getVideos();
  const index = videos.findIndex(v => v.id === id);
  if (index !== -1) {
    videos[index] = { ...videos[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
    return videos[index];
  }
  return null;
}

export async function deleteVideo(id) {
  const videos = await getVideos();
  const filtered = videos.filter(v => v.id !== id);
  localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(filtered));
  return true;
}

// ===== FORMATIONS =====

export async function getFormations() {
  const data = localStorage.getItem(STORAGE_KEYS.FORMATIONS);
  return data ? JSON.parse(data) : [];
}

export async function getFormationById(id) {
  const formations = await getFormations();
  return formations.find(f => f.id === id);
}

export async function createFormation(formation) {
  const formations = await getFormations();
  const newFormation = {
    ...formation,
    id: Date.now().toString()
  };
  formations.push(newFormation);
  localStorage.setItem(STORAGE_KEYS.FORMATIONS, JSON.stringify(formations));
  return newFormation;
}

export async function updateFormation(id, updates) {
  const formations = await getFormations();
  const index = formations.findIndex(f => f.id === id);
  if (index !== -1) {
    formations[index] = { ...formations[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.FORMATIONS, JSON.stringify(formations));
    return formations[index];
  }
  return null;
}

export async function deleteFormation(id) {
  const formations = await getFormations();
  const filtered = formations.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.FORMATIONS, JSON.stringify(filtered));
  return true;
}

// ===== MACHINES =====

export async function getMachines() {
  const data = localStorage.getItem(STORAGE_KEYS.MACHINES);
  return data ? JSON.parse(data) : [];
}

export async function getMachineById(id) {
  const machines = await getMachines();
  return machines.find(m => m.id === id);
}

export async function getMachineBySlug(slug) {
  const machines = await getMachines();
  return machines.find(m => m.slug === slug);
}

export async function createMachine(machine) {
  const machines = await getMachines();
  const newMachine = {
    ...machine,
    id: Date.now().toString()
  };
  machines.push(newMachine);
  localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(machines));
  return newMachine;
}

export async function updateMachine(id, updates) {
  const machines = await getMachines();
  const index = machines.findIndex(m => m.id === id);
  if (index !== -1) {
    machines[index] = { ...machines[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(machines));
    return machines[index];
  }
  return null;
}

export async function deleteMachine(id) {
  const machines = await getMachines();
  const filtered = machines.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(filtered));
  return true;
}

// ===== BLOG =====

export async function getBlogPosts() {
  const data = localStorage.getItem(STORAGE_KEYS.BLOG);
  return data ? JSON.parse(data) : [];
}

export async function getBlogPostById(id) {
  const posts = await getBlogPosts();
  return posts.find(p => p.id === id);
}

export async function getBlogPostBySlug(slug) {
  const posts = await getBlogPosts();
  return posts.find(p => p.slug === slug);
}

export async function createBlogPost(post) {
  const posts = await getBlogPosts();
  const newPost = {
    ...post,
    id: Date.now().toString(),
    date: new Date().toISOString()
  };
  posts.push(newPost);
  localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(posts));
  return newPost;
}

export async function updateBlogPost(id, updates) {
  const posts = await getBlogPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(posts));
    return posts[index];
  }
  return null;
}

export async function deleteBlogPost(id) {
  const posts = await getBlogPosts();
  const filtered = posts.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(filtered));
  return true;
}

// ===== NEWSLETTER =====

export async function getNewsletterSubscribers() {
  const data = localStorage.getItem(STORAGE_KEYS.NEWSLETTER);
  const parsed = data ? JSON.parse(data) : { subscribers: [] };
  return parsed.subscribers || [];
}

export async function addNewsletterSubscriber(email) {
  const subscribers = await getNewsletterSubscribers();

  // Vérifier si l'email existe déjà
  if (subscribers.find(s => s.email === email)) {
    throw new Error('Cet email est déjà inscrit');
  }

  const newSubscriber = {
    email,
    dateSubscribed: new Date().toISOString()
  };

  subscribers.push(newSubscriber);
  localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify({ subscribers }));
  return newSubscriber;
}

export async function removeNewsletterSubscriber(email) {
  const subscribers = await getNewsletterSubscribers();
  const filtered = subscribers.filter(s => s.email !== email);
  localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify({ subscribers: filtered }));
  return true;
}

export async function exportNewsletterCSV() {
  const subscribers = await getNewsletterSubscribers();
  let csv = 'Email,Date d\'inscription\n';
  subscribers.forEach(sub => {
    csv += `${sub.email},${new Date(sub.dateSubscribed).toLocaleDateString('fr-FR')}\n`;
  });
  return csv;
}

// Alias for newsletter subscription
export async function saveNewsletter(email) {
  return await addNewsletterSubscriber(email);
}

// ===== CONTACTS =====

export async function saveContact(contactData) {
  const CONTACTS_KEY = 'gal_contacts';
  const contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');

  const newContact = {
    ...contactData,
    id: Date.now().toString(),
    date: contactData.date || new Date().toISOString()
  };

  contacts.push(newContact);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  return newContact;
}

export async function getContacts() {
  const CONTACTS_KEY = 'gal_contacts';
  return JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
}

// ===== PAGES STATIQUES =====

export async function getPages() {
  const data = localStorage.getItem(STORAGE_KEYS.PAGES);
  return data ? JSON.parse(data) : {};
}

export async function updatePages(updates) {
  const pages = await getPages();
  const updated = { ...pages, ...updates };
  localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(updated));
  return updated;
}

// ===== AUTHENTIFICATION =====

export async function login(email, password) {
  // Mock authentication
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

// ===== CHATBOT =====

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
  setLanguage
};
