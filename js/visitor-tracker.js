/**
 * visitor-tracker.js - Système de tracking des visiteurs
 * GAL - Groupement des Artisans de Lubumbashi
 * Enregistre les visites dans Supabase pour le dashboard analytics
 */

import { supabase } from './supabase-init.js';

/**
 * Enregistrer une visite
 */
export async function trackPageVisit() {
    if (!supabase) return;

    try {
        const visitData = {
            page_url: window.location.pathname + window.location.hash,
            page_title: document.title,
            referrer: document.referrer || 'direct',
            user_agent: navigator.userAgent,
            screen_width: window.innerWidth,
            screen_height: window.innerHeight,
            language: navigator.language || 'fr',
            visited_at: new Date().toISOString(),
            session_id: getOrCreateSessionId()
        };

        const { error } = await supabase
            .from('site_visits')
            .insert([visitData]);

        if (error) {
            // Table might not exist yet, create it silently
            if (error.code === '42P01') {
                console.warn('⚠️ Table site_visits non trouvée. Exécutez le script SQL de création.');
            } else {
                console.warn('Tracking visiteur:', error.message);
            }
        }
    } catch (err) {
        // Silently fail - tracking should never break the site
        console.warn('Tracking error:', err.message);
    }
}

/**
 * Obtenir ou créer un ID de session unique
 */
function getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('gal_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('gal_session_id', sessionId);
    }
    return sessionId;
}

/**
 * Récupérer les statistiques de visites
 */
export async function getVisitStats(period = 'month') {
    if (!supabase) return null;

    try {
        const now = new Date();
        let startDate;

        switch (period) {
            case 'hour':
                startDate = new Date(now - 3600000);
                break;
            case 'day':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now - 7 * 86400000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const { data, error } = await supabase
            .from('site_visits')
            .select('*')
            .gte('visited_at', startDate.toISOString())
            .order('visited_at', { ascending: true });

        if (error) {
            console.error('Erreur récupération stats:', error);
            return null;
        }

        return data || [];
    } catch (err) {
        console.error('Erreur stats:', err);
        return [];
    }
}

/**
 * Obtenir le résumé des statistiques pour le dashboard
 */
export async function getDashboardStats() {
    if (!supabase) return getEmptyStats();

    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekStart = new Date(now - 7 * 86400000).toISOString();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();

        // Requêtes parallèles
        const [todayRes, weekRes, monthRes, yearRes, totalRes] = await Promise.all([
            supabase.from('site_visits').select('id', { count: 'exact', head: true }).gte('visited_at', todayStart),
            supabase.from('site_visits').select('id', { count: 'exact', head: true }).gte('visited_at', weekStart),
            supabase.from('site_visits').select('id', { count: 'exact', head: true }).gte('visited_at', monthStart),
            supabase.from('site_visits').select('id', { count: 'exact', head: true }).gte('visited_at', yearStart),
            supabase.from('site_visits').select('id', { count: 'exact', head: true })
        ]);

        // Sessions uniques aujourd'hui
        const todaySessions = await supabase
            .from('site_visits')
            .select('session_id')
            .gte('visited_at', todayStart);

        const uniqueSessionsToday = new Set((todaySessions.data || []).map(v => v.session_id)).size;

        // Pages les plus visitées (ce mois)
        const topPagesRes = await supabase
            .from('site_visits')
            .select('page_url, page_title')
            .gte('visited_at', monthStart);

        const pageCount = {};
        (topPagesRes.data || []).forEach(v => {
            const key = v.page_url || '/';
            if (!pageCount[key]) pageCount[key] = { url: key, title: v.page_title, count: 0 };
            pageCount[key].count++;
        });
        const topPages = Object.values(pageCount).sort((a, b) => b.count - a.count).slice(0, 10);

        // Données horaires pour le graphique (dernières 24h)
        const last24h = new Date(now - 24 * 3600000).toISOString();
        const hourlyRes = await supabase
            .from('site_visits')
            .select('visited_at')
            .gte('visited_at', last24h)
            .order('visited_at', { ascending: true });

        const hourlyData = new Array(24).fill(0);
        (hourlyRes.data || []).forEach(v => {
            const hour = new Date(v.visited_at).getHours();
            hourlyData[hour]++;
        });

        // Données journalières (30 derniers jours)
        const last30d = new Date(now - 30 * 86400000).toISOString();
        const dailyRes = await supabase
            .from('site_visits')
            .select('visited_at')
            .gte('visited_at', last30d)
            .order('visited_at', { ascending: true });

        const dailyData = {};
        (dailyRes.data || []).forEach(v => {
            const day = new Date(v.visited_at).toISOString().split('T')[0];
            dailyData[day] = (dailyData[day] || 0) + 1;
        });

        // Données mensuelles (12 derniers mois)
        const last12m = new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString();
        const monthlyRes = await supabase
            .from('site_visits')
            .select('visited_at')
            .gte('visited_at', last12m)
            .order('visited_at', { ascending: true });

        const monthlyData = {};
        (monthlyRes.data || []).forEach(v => {
            const month = new Date(v.visited_at).toISOString().substring(0, 7);
            monthlyData[month] = (monthlyData[month] || 0) + 1;
        });

        // Referrers
        const referrerRes = await supabase
            .from('site_visits')
            .select('referrer')
            .gte('visited_at', monthStart);

        const referrerCount = {};
        (referrerRes.data || []).forEach(v => {
            let ref = v.referrer || 'direct';
            try {
                if (ref !== 'direct' && ref.startsWith('http')) {
                    ref = new URL(ref).hostname;
                }
            } catch (e) { /* keep as is */ }
            referrerCount[ref] = (referrerCount[ref] || 0) + 1;
        });
        const topReferrers = Object.entries(referrerCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([source, count]) => ({ source, count }));

        // Appareils
        const deviceRes = await supabase
            .from('site_visits')
            .select('screen_width')
            .gte('visited_at', monthStart);

        let mobile = 0, tablet = 0, desktop = 0;
        (deviceRes.data || []).forEach(v => {
            if (v.screen_width < 768) mobile++;
            else if (v.screen_width < 1024) tablet++;
            else desktop++;
        });

        return {
            today: todayRes.count || 0,
            week: weekRes.count || 0,
            month: monthRes.count || 0,
            year: yearRes.count || 0,
            total: totalRes.count || 0,
            uniqueToday: uniqueSessionsToday,
            topPages,
            hourlyData,
            dailyData,
            monthlyData,
            topReferrers,
            devices: { mobile, tablet, desktop },
            lastUpdate: now.toISOString()
        };

    } catch (err) {
        console.error('Erreur dashboard stats:', err);
        return getEmptyStats();
    }
}

function getEmptyStats() {
    return {
        today: 0, week: 0, month: 0, year: 0, total: 0, uniqueToday: 0,
        topPages: [], hourlyData: new Array(24).fill(0),
        dailyData: {}, monthlyData: {},
        topReferrers: [],
        devices: { mobile: 0, tablet: 0, desktop: 0 },
        lastUpdate: new Date().toISOString()
    };
}

// Auto-track quand ce module est chargé
trackPageVisit();
