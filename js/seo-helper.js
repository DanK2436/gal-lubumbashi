/**
 * seo-helper.js - Assistant SEO Intelligent pour l'administration
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { SEO_KEYWORDS, GLOBAL_KEYWORDS } from './seo-keywords.js';

/**
 * Analyse un texte et suggère des mots-clés pertinents
 */
export function getRelevantKeywords(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    const suggestions = new Set();
    
    // 1. Chercher dans les mots-clés globaux
    GLOBAL_KEYWORDS.forEach(kw => {
        if (text.includes(kw.toLowerCase())) {
            suggestions.add(kw);
        }
    });

    // 2. Chercher dans toutes les catégories
    Object.values(SEO_KEYWORDS).forEach(category => {
        category.forEach(kw => {
            if (text.includes(kw.toLowerCase())) {
                suggestions.add(kw);
            }
        });
    });

    return Array.from(suggestions).slice(0, 15);
}

/**
 * Calcule un score SEO et génère des conseils
 */
export function analyzeSEO(title, description) {
    let score = 0;
    const tips = [];

    // Analyse du titre
    if (title.length >= 40 && title.length <= 70) {
        score += 30;
        tips.push({ type: 'success', text: 'Longueur du titre idéale (40-70 car.)' });
    } else if (title.length > 0) {
        score += 10;
        tips.push({ type: 'warning', text: 'Le titre devrait faire entre 40 et 70 caractères.' });
    } else {
        tips.push({ type: 'danger', text: 'Le titre est obligatoire pour le SEO.' });
    }

    // Analyse de la description
    if (description.length >= 100 && description.length <= 160) {
        score += 30;
        tips.push({ type: 'success', text: 'Longueur de description idéale (100-160 car.)' });
    } else if (description.length > 0) {
        score += 15;
        tips.push({ type: 'warning', text: 'Visez entre 100 et 160 caractères pour la description (meta-description).' });
    } else {
        tips.push({ type: 'danger', text: 'Ajoutez une description riche en détails.' });
    }

    // Analyse des mots-clés
    const keywords = getRelevantKeywords(title, description);
    if (keywords.length >= 5) {
        score += 40;
        tips.push({ type: 'success', text: `${keywords.length} mots-clés pertinents détectés.` });
    } else if (keywords.length > 0) {
        score += 20;
        tips.push({ type: 'warning', text: 'Essayez d\'inclure plus de mots-clés du dictionnaire GAL.' });
    }

    return { score, tips, keywords };
}

/**
 * Génère le HTML pour l'assistant SEO
 */
export function createSEOAssistantUI(id) {
    return `
        <div id="${id}" class="seo-assistant-box">
            <div class="seo-header">
                <span class="seo-title"><i class="ri-rocket-line"></i> Assistant SEO GAL</span>
                <span class="seo-score-badge" id="${id}-score">0%</span>
            </div>
            
            <div class="seo-progress-bar">
                <div id="${id}-progress" class="seo-progress-fill" style="width: 0%"></div>
            </div>

            <div class="seo-keywords-list" id="${id}-keywords">
                <!-- Suggérées dynamiquement -->
            </div>

            <div class="seo-tips" id="${id}-tips">
                <p class="text-xs text-muted">Commencez à rédiger pour voir les conseils...</p>
            </div>

            <style>
                .seo-assistant-box {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 1rem;
                    margin-top: 1rem;
                    font-family: 'Inter', sans-serif;
                }
                .seo-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }
                .seo-title {
                    font-weight: 700;
                    font-size: 0.85rem;
                    color: #1e293b;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .seo-score-badge {
                    background: #e2e8f0;
                    color: #475569;
                    padding: 2px 8px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 800;
                }
                .seo-progress-bar {
                    height: 6px;
                    background: #e2e8f0;
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }
                .seo-progress-fill {
                    height: 100%;
                    background: #dc2626;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .seo-tips {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                    margin-top: 0.75rem;
                }
                .seo-tip {
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .seo-tip--success { color: #16a34a; }
                .seo-tip--warning { color: #d97706; }
                .seo-tip--danger { color: #dc2626; }
                
                .seo-keywords-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                }
                .seo-keyword-tag {
                    font-size: 0.7rem;
                    background: white;
                    border: 1px solid #cbd5e1;
                    padding: 1px 6px;
                    border-radius: 4px;
                    color: #64748b;
                }
            </style>
        </div>
    `;
}

/**
 * Met à jour dynamiquement l'UI
 */
export function updateSEOAssistant(id, title, description) {
    const box = document.getElementById(id);
    if (!box) return;

    const { score, tips, keywords } = analyzeSEO(title, description);

    // Update Score & Progress
    const scoreBadge = document.getElementById(`${id}-score`);
    const progressFill = document.getElementById(`${id}-progress`);
    
    scoreBadge.textContent = `${score}%`;
    progressFill.style.width = `${score}%`;
    
    // Colors based on score
    if (score < 40) progressFill.style.background = '#dc2626';
    else if (score < 80) progressFill.style.background = '#f59e0b';
    else progressFill.style.background = '#10b981';

    // Update Keywords
    const keywordsList = document.getElementById(`${id}-keywords`);
    keywordsList.innerHTML = keywords.map(kw => `<span class="seo-keyword-tag">#${kw}</span>`).join('');

    // Update Tips
    const tipsList = document.getElementById(`${id}-tips`);
    tipsList.innerHTML = tips.map(tip => `
        <div class="seo-tip seo-tip--${tip.type}">
            <i class="ri-${tip.type === 'success' ? 'checkbox-circle' : tip.type === 'warning' ? 'error-warning' : 'close-circle'}-line"></i>
            ${tip.text}
        </div>
    `).join('');
}
