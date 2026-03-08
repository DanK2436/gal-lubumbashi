/**
 * admin-analytics.js - Dashboard Analytics style Google Analytics
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { getDashboardStats, getVisitStats } from '../visitor-tracker.js';

let chartInstances = {};
let currentPeriod = 'month';
let statsData = null;
let autoRefreshInterval = null;

/**
 * Charge et retourne le HTML du dashboard analytics
 */
export async function loadAnalyticsDashboard() {
    statsData = await getDashboardStats();

    const html = `
        <div class="analytics-dashboard">
            <div class="d-flex justify-between align-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold">📊 Tableau de Bord Analytics</h2>
                    <p class="text-muted mt-1">Statistiques en temps réel des visiteurs du site</p>
                </div>
                <div class="d-flex gap-3 align-center">
                    <select class="form-input" id="analytics-period" onchange="window.adminAnalytics.changePeriod(this.value)" style="width: auto; min-width: 180px;">
                        <option value="day" ${currentPeriod === 'day' ? 'selected' : ''}>Aujourd'hui</option>
                        <option value="week" ${currentPeriod === 'week' ? 'selected' : ''}>Cette semaine</option>
                        <option value="month" ${currentPeriod === 'month' ? 'selected' : ''}>Ce mois</option>
                        <option value="year" ${currentPeriod === 'year' ? 'selected' : ''}>Cette année</option>
                    </select>
                    <button class="btn btn--primary" onclick="window.adminAnalytics.refreshStats()" title="Actualiser">
                        🔄 Actualiser
                    </button>
                </div>
            </div>

            <!-- KPI Cards -->
            <div class="analytics-kpi-grid">
                <div class="analytics-kpi-card kpi-blue">
                    <div class="kpi-icon-wrapper">
                        <img src="../public/images/analytics/eye.png" alt="Visites" class="kpi-img">
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value" id="kpi-today">${statsData.today.toLocaleString()}</div>
                        <div class="kpi-label">Visites Aujourd'hui</div>
                    </div>
                    <div class="kpi-trend-wrapper">
                        <img src="../public/images/analytics/trend.png" alt="Trend" class="kpi-trend-img">
                    </div>
                </div>
                <div class="analytics-kpi-card kpi-green">
                    <div class="kpi-icon-wrapper">
                        <img src="../public/images/analytics/eye.png" alt="Uniques" class="kpi-img" style="filter: hue-rotate(90deg);">
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value" id="kpi-unique">${statsData.uniqueToday.toLocaleString()}</div>
                        <div class="kpi-label">Visiteurs Uniques</div>
                    </div>
                    <div class="kpi-trend-wrapper">
                        <img src="../public/images/analytics/trend.png" alt="New" class="kpi-trend-img">
                    </div>
                </div>
                <div class="analytics-kpi-card kpi-orange">
                    <div class="kpi-icon-wrapper">
                        <img src="../public/images/analytics/calendar.png" alt="Semaine" class="kpi-img" style="filter: hue-rotate(30deg) saturate(1.5);">
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value" id="kpi-week">${statsData.week.toLocaleString()}</div>
                        <div class="kpi-label">Cette Semaine</div>
                    </div>
                    <div class="kpi-trend-wrapper">
                         <img src="../public/images/analytics/trend.png" alt="Stats" class="kpi-trend-img" style="filter: grayscale(1);">
                    </div>
                </div>
                <div class="analytics-kpi-card kpi-purple">
                    <div class="kpi-icon-wrapper">
                        <img src="../public/images/analytics/calendar.png" alt="Mois" class="kpi-img" style="filter: hue-rotate(260deg) saturate(1.2);">
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value" id="kpi-month">${statsData.month.toLocaleString()}</div>
                        <div class="kpi-label">Ce Mois</div>
                    </div>
                    <div class="kpi-trend-wrapper">
                        <img src="../public/images/analytics/trend.png" alt="Trend" class="kpi-trend-img">
                    </div>
                </div>
                <div class="analytics-kpi-card kpi-red">
                    <div class="kpi-icon-wrapper">
                        <img src="../public/images/analytics/calendar.png" alt="Année" class="kpi-img">
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value" id="kpi-year">${statsData.year.toLocaleString()}</div>
                        <div class="kpi-label">Cette Année</div>
                    </div>
                    <div class="kpi-trend-wrapper">
                        <img src="../public/images/analytics/calendar.png" alt="Calendar" class="kpi-trend-img" style="width: 20px; opacity: 0.5;">
                    </div>
                </div>
                <div class="analytics-kpi-card kpi-dark">
                    <div class="kpi-icon-wrapper">
                        <img src="../public/images/analytics/globe.png" alt="Total" class="kpi-img">
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value" id="kpi-total">${statsData.total.toLocaleString()}</div>
                        <div class="kpi-label">Total Historique</div>
                    </div>
                    <div class="kpi-trend-wrapper">
                         <img src="../public/images/analytics/globe.png" alt="Total" class="kpi-trend-img" style="width: 20px; opacity: 0.5; animation: spin 10s linear infinite;">
                    </div>
                </div>
            </div>

            <!-- Charts Row 1 -->
            <div class="analytics-charts-row">
                <div class="analytics-chart-card chart-large">
                    <div class="chart-header">
                        <h3><img src="../public/images/analytics/trend.png" style="height: 24px; vertical-align: middle; margin-right: 8px;"> Trafic par Heure (24h)</h3>
                        <div class="chart-badge">Temps réel</div>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart-hourly"></canvas>
                    </div>
                </div>
                <div class="analytics-chart-card chart-small">
                    <div class="chart-header">
                        <h3><img src="../public/images/analytics/set.png" style="height: 24px; width: 24px; object-fit: cover; object-position: center; border-radius: 4px; vertical-align: middle; margin-right: 8px;"> Appareils</h3>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart-devices"></canvas>
                    </div>
                </div>
            </div>

            <!-- Charts Row 2 -->
            <div class="analytics-charts-row">
                <div class="analytics-chart-card chart-large">
                    <div class="chart-header">
                        <h3><img src="../public/images/analytics/trend.png" style="height: 24px; vertical-align: middle; margin-right: 8px; filter: hue-rotate(260deg);"> Visites par Jour (30 jours)</h3>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart-daily"></canvas>
                    </div>
                </div>
                <div class="analytics-chart-card chart-small">
                    <div class="chart-header">
                        <h3><img src="../public/images/analytics/globe.png" style="height: 24px; vertical-align: middle; margin-right: 8px;"> Sources de Trafic</h3>
                    </div>
                    <div class="referrer-list" id="referrer-list">
                        ${renderReferrerList(statsData.topReferrers)}
                    </div>
                </div>
            </div>

            <!-- Charts Row 3 -->
            <div class="analytics-charts-row">
                <div class="analytics-chart-card chart-large">
                    <div class="chart-header">
                        <h3><img src="../public/images/analytics/calendar.png" style="height: 24px; vertical-align: middle; margin-right: 8px;"> Visites par Mois (12 mois)</h3>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart-monthly"></canvas>
                    </div>
                </div>
                <div class="analytics-chart-card chart-small">
                    <div class="chart-header">
                        <h3><img src="../public/images/analytics/trend.png" style="height: 24px; vertical-align: middle; margin-right: 8px; filter: brightness(1.2);"> Pages les Plus Visitées</h3>
                    </div>
                    <div class="top-pages-list" id="top-pages-list">
                        ${renderTopPages(statsData.topPages)}
                    </div>
                </div>
            </div>

            <!-- Live Clock -->
            <div class="analytics-live-bar">
                <span class="live-dot"></span>
                <span id="analytics-live-time">Dernière mise à jour: ${new Date().toLocaleString('fr-FR')}</span>
                <span class="live-auto">Auto-refresh: 60s</span>
            </div>
        </div>

        <style>
            .analytics-dashboard { 
                max-width: 1400px; 
                padding: 1rem;
                background: #f8fafc;
            }

            .analytics-kpi-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2.5rem;
            }

            .analytics-kpi-card {
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 20px;
                padding: 1.75rem;
                display: flex;
                align-items: center;
                gap: 1.25rem;
                box-shadow: 0 10px 30px rgba(0,0,0,0.04);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .analytics-kpi-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                background: rgba(255, 255, 255, 0.95);
            }

            .kpi-icon-wrapper {
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 16px;
                background: white;
                box-shadow: 0 8px 16px rgba(0,0,0,0.05);
            }

            .kpi-img {
                width: 45px;
                height: 45px;
                object-fit: contain;
                filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
            }

            .kpi-trend-wrapper {
                position: absolute;
                top: 1.25rem;
                right: 1.25rem;
            }

            .kpi-trend-img {
                width: 24px;
                height: 24px;
                object-fit: contain;
            }

            .kpi-blue { border-bottom: 4px solid #3B82F6; }
            .kpi-green { border-bottom: 4px solid #10B981; }
            .kpi-orange { border-bottom: 4px solid #F59E0B; }
            .kpi-purple { border-bottom: 4px solid #8B5CF6; }
            .kpi-red { border-bottom: 4px solid #EF4444; }
            .kpi-dark { border-bottom: 4px solid #1E293B; }

            .kpi-value { 
                font-size: 2rem; 
                font-weight: 800; 
                color: #0f172a; 
                font-family: 'Inter', system-ui, sans-serif;
                line-height: 1;
                margin-bottom: 0.25rem;
            }
            
            .kpi-label { 
                font-size: 0.75rem; 
                color: #64748b; 
                font-weight: 600; 
                text-transform: uppercase; 
                letter-spacing: 0.05em; 
            }
            
            .kpi-content { flex: 1; }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .analytics-charts-row {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            .analytics-chart-card {
                background: white;
                border-radius: 20px;
                padding: 1.75rem;
                box-shadow: 0 10px 30px rgba(0,0,0,0.04);
                border: 1px solid rgba(241, 245, 249, 0.8);
            }

            .chart-container {
                position: relative;
                height: 320px; /* Fixed height to prevent infinite growth */
                width: 100%;
                margin-top: 1rem;
            }

            .chart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .chart-header h3 {
                font-size: 1.1rem;
                font-weight: 700;
                color: #1e293b;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .chart-badge {
                background: #ecfdf5;
                color: #10b981;
                padding: 0.35rem 0.85rem;
                border-radius: 50px;
                font-size: 0.65rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                border: 1px solid #d1fae5;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }

            .referrer-list, .top-pages-list {
                max-height: 280px;
                overflow-y: auto;
            }

            .referrer-item, .top-page-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 0;
                border-bottom: 1px solid #F1F5F9;
            }

            .referrer-item:last-child, .top-page-item:last-child { border-bottom: none; }

            .referrer-name, .page-name {
                font-size: 0.9rem;
                color: #334155;
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 200px;
            }

            .referrer-count, .page-count {
                background: #F1F5F9;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 700;
                color: #475569;
                min-width: 40px;
                text-align: center;
            }

            .analytics-live-bar {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem 1.5rem;
                background: linear-gradient(135deg, #1E293B, #334155);
                border-radius: 12px;
                color: white;
                font-size: 0.85rem;
                margin-top: 1rem;
            }

            .live-dot {
                width: 10px;
                height: 10px;
                background: #10B981;
                border-radius: 50%;
                animation: pulse 1.5s infinite;
            }

            .live-auto {
                margin-left: auto;
                opacity: 0.6;
                font-size: 0.75rem;
            }

            @media (max-width: 900px) {
                .analytics-charts-row { grid-template-columns: 1fr; }
                .analytics-kpi-grid { grid-template-columns: repeat(2, 1fr); }
            }

            @media (max-width: 600px) {
                .analytics-kpi-grid { grid-template-columns: 1fr; }
            }
        </style>
    `;

    // Charger Chart.js et initialiser les graphiques après le rendu
    setTimeout(() => {
        loadChartJS().then(() => initCharts(statsData));
    }, 100);

    // Auto-refresh toutes les 60 secondes
    startAutoRefresh();

    return html;
}

function renderReferrerList(referrers) {
    if (!referrers || referrers.length === 0) {
        return '<div class="empty-state text-center" style="padding:2rem;color:#94A3B8;">Aucune donnée de source disponible</div>';
    }
    return referrers.map(r => `
        <div class="referrer-item">
            <span class="referrer-name" title="${r.source}">
                ${r.source === 'direct' ? '<img src="../public/images/analytics/globe.png" style="height:16px; margin-right:8px;"> Accès direct' : '<img src="../public/images/analytics/globe.png" style="height:16px; margin-right:8px; filter:hue-rotate(180deg);"> ' + r.source}
            </span>
            <span class="referrer-count">${r.count}</span>
        </div>
    `).join('');
}

function renderTopPages(pages) {
    if (!pages || pages.length === 0) {
        return '<div class="empty-state text-center" style="padding:2rem;color:#94A3B8;">Aucune page visitée enregistrée</div>';
    }
    return pages.map(p => `
        <div class="top-page-item">
            <span class="page-name" title="${p.url}"><img src="../public/images/analytics/set.png" style="height:16px; width:16px; object-fit:cover; margin-right:8px; border-radius:2px;"> ${p.title || p.url}</span>
            <span class="page-count">${p.count}</span>
        </div>
    `).join('');
}

async function loadChartJS() {
    if (window.Chart) return;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function initCharts(stats) {
    if (!window.Chart) return;

    // Détruire les graphiques existants
    Object.values(chartInstances).forEach(c => c.destroy());
    chartInstances = {};

    // 1. Graphique horaire (24h)
    const hourlyCtx = document.getElementById('chart-hourly');
    if (hourlyCtx) {
        chartInstances.hourly = new Chart(hourlyCtx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
                datasets: [{
                    label: 'Visites',
                    data: stats.hourlyData,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#3B82F6',
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1E293B',
                        titleColor: '#F8FAFC',
                        bodyColor: '#F8FAFC',
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { precision: 0 } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // 2. Graphique appareils (Doughnut)
    const devicesCtx = document.getElementById('chart-devices');
    if (devicesCtx) {
        chartInstances.devices = new Chart(devicesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Mobile', 'Tablette', 'Desktop'],
                datasets: [{
                    data: [stats.devices.mobile, stats.devices.tablet, stats.devices.desktop],
                    backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 16, usePointStyle: true, font: { size: 12 } }
                    }
                }
            }
        });
    }

    // 3. Graphique journalier (30 jours) - Bar chart
    const dailyCtx = document.getElementById('chart-daily');
    if (dailyCtx) {
        const dailyLabels = Object.keys(stats.dailyData).sort();
        const dailyValues = dailyLabels.map(d => stats.dailyData[d]);

        // Si pas de données, remplir les 30 derniers jours avec 0
        if (dailyLabels.length === 0) {
            const now = new Date();
            for (let i = 29; i >= 0; i--) {
                const d = new Date(now - i * 86400000);
                dailyLabels.push(d.toISOString().split('T')[0]);
                dailyValues.push(0);
            }
        }

        chartInstances.daily = new Chart(dailyCtx, {
            type: 'bar',
            data: {
                labels: dailyLabels.map(d => {
                    const date = new Date(d);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                }),
                datasets: [{
                    label: 'Visites',
                    data: dailyValues,
                    backgroundColor: 'rgba(139, 92, 246, 0.6)',
                    borderColor: '#8B5CF6',
                    borderWidth: 1,
                    borderRadius: 6,
                    hoverBackgroundColor: '#8B5CF6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#1E293B', cornerRadius: 8, padding: 12 }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { precision: 0 } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // 4. Graphique mensuel (12 mois) - Area chart
    const monthlyCtx = document.getElementById('chart-monthly');
    if (monthlyCtx) {
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const monthlyLabels = Object.keys(stats.monthlyData).sort();
        const monthlyValues = monthlyLabels.map(m => stats.monthlyData[m]);

        // Default empty data for 12 months
        if (monthlyLabels.length === 0) {
            const now = new Date();
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                monthlyLabels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
                monthlyValues.push(0);
            }
        }

        chartInstances.monthly = new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: monthlyLabels.map(m => {
                    const [year, month] = m.split('-');
                    return `${monthNames[parseInt(month) - 1]} ${year}`;
                }),
                datasets: [{
                    label: 'Visites mensuelles',
                    data: monthlyValues,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#EF4444',
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#1E293B', cornerRadius: 8, padding: 12 }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { precision: 0 } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

function startAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    autoRefreshInterval = setInterval(async () => {
        const liveTime = document.getElementById('analytics-live-time');
        if (liveTime) {
            liveTime.textContent = `Dernière mise à jour: ${new Date().toLocaleString('fr-FR')}`;
        }
        // Refresh data silently
        try {
            statsData = await getDashboardStats();
            updateKPIs(statsData);
        } catch (e) { /* silent */ }
    }, 60000);
}

function updateKPIs(stats) {
    const updates = {
        'kpi-today': stats.today,
        'kpi-unique': stats.uniqueToday,
        'kpi-week': stats.week,
        'kpi-month': stats.month,
        'kpi-year': stats.year,
        'kpi-total': stats.total
    };
    Object.entries(updates).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value.toLocaleString();
    });
}

// Global handlers
window.adminAnalytics = {
    async changePeriod(period) {
        currentPeriod = period;
        await this.refreshStats();
    },
    async refreshStats() {
        statsData = await getDashboardStats();
        updateKPIs(statsData);
        initCharts(statsData);
        const liveTime = document.getElementById('analytics-live-time');
        if (liveTime) {
            liveTime.textContent = `Dernière mise à jour: ${new Date().toLocaleString('fr-FR')}`;
        }
    }
};

export function cleanupAnalytics() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
    Object.values(chartInstances).forEach(c => c.destroy());
    chartInstances = {};
}
