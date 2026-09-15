/**
 * Campus Lost & Found Management System
 * Developed by Team: SQL Titans
 * Members:
 *  1. Rohit Jaganath Waghmare
 *  2. Shivraj Gautam Jagdale
 *  3. Nandkumar Ramraje Thalkari
 *  4. Sagar Manoj Wagh
 *  5. Jay Munde
 */
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://ugdopewunzkwcrmkzxdh.supabase.co/rest/v1/', 'sb_publishable_QmJg1to-bfnjuAOA5s-Wzw_CHbCrSDs')

// Add a lost item:
await supabase.from('items').insert([newItem])

// Fetch all lost items:
let { data: items } = await supabase.from('items').select('*')


const ADMIN_PASS = "Rohit@075";

// Database Storage Handler (localStorage Persistence)
let database = JSON.parse(localStorage.getItem('SQL_TITANS_LF_DB')) || {
    items: [],
    history: []
};

function saveDB() {
    localStorage.setItem('SQL_TITANS_LF_DB', JSON.stringify(database));
}

// Audio Synth Effect Generator (Web Audio API)
function playSynthesizedSFX(type) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'launch') {
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } else if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        }
    } catch(e) { console.log('Audio init skipped'); }
}

// Global Variables
let activeCategory = 'All';
let lostImgBase64 = null;
let foundImgBase64 = null;

// Initialize System
document.addEventListener('DOMContentLoaded', () => {
    // Cinematic Intro Launch Button
    document.getElementById('launch-btn').addEventListener('click', () => {
        playSynthesizedSFX('launch');
        const intro = document.getElementById('intro-screen');
        intro.style.transition = 'opacity 0.6s ease';
        intro.style.opacity = '0';
        setTimeout(() => {
            intro.classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');
            showToast('System Initialized - SQL Titans Engine Active');
        }, 600);
    });

    // File Input Handlers
    handleImageUpload('lost-file', (b64) => {
        lostImgBase64 = b64;
        document.getElementById('lost-img-preview').innerHTML = `<img src="${b64}">`;
    });

    handleImageUpload('found-file', (b64) => {
        foundImgBase64 = b64;
        document.getElementById('found-img-preview').innerHTML = `<img src="${b64}">`;
    });

    // Navigation Tabs
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.getAttribute('data-tab'));
        });
    });

    renderAllViews();
});

function switchTab(tabId) {
    document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));

    document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
    document.getElementById(tabId)?.classList.add('active');
}

function handleImageUpload(elementId, callback) {
    document.getElementById(elementId).addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => callback(evt.target.result);
            reader.readAsDataURL(file);
        }
    });
}

// 1. Report Lost Item
document.getElementById('form-lost').addEventListener('submit', (e) => {
    e.preventDefault();

    const newItem = {
        id: 'LOST-' + Math.floor(10000 + Math.random() * 90000),
        type: 'LOST',
        title: document.getElementById('lost-title').value,
        category: document.getElementById('lost-category').value,
        location: document.getElementById('lost-location').value,
        reporter: document.getElementById('lost-owner-name').value,
        contact: document.getElementById('lost-contact').value,
        secret: document.getElementById('lost-secret').value,
        desc: document.getElementById('lost-desc').value,
        image: lostImgBase64 || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500',
        date: new Date().toISOString().split('T')[0]
    };

    database.items.unshift(newItem);
    saveDB();
    
    document.getElementById('form-lost').reset();
    document.getElementById('lost-img-preview').innerHTML = '';
    lostImgBase64 = null;

    renderAllViews();
    showToast('Lost Query successfully registered in DB!');
    switchTab('tab-search');
});

// 2. Report Found Item
document.getElementById('form-found').addEventListener('submit', (e) => {
    e.preventDefault();

    const newItem = {
        id: 'FOUND-' + Math.floor(10000 + Math.random() * 90000),
        type: 'FOUND',
        title: document.getElementById('found-title').value,
        category: document.getElementById('found-category').value,
        location: document.getElementById('found-location').value,
        founderName: document.getElementById('found-founder-name').value,
        founderContact: document.getElementById('found-contact').value,
        meetingSpot: document.getElementById('found-meeting-spot').value,
        secretQuestion: document.getElementById('found-secret-q').value,
        desc: document.getElementById('found-desc').value,
        image: foundImgBase64 || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        date: new Date().toISOString().split('T')[0]
    };

    database.items.unshift(newItem);
    saveDB();

    document.getElementById('form-found').reset();
    document.getElementById('found-img-preview').innerHTML = '';
    foundImgBase64 = null;

    renderAllViews();
    showToast('Found Item registered successfully!');
    switchTab('tab-search');
});

// 3. Render Search Grid
function renderActiveGrid() {
    const grid = document.getElementById('active-items-grid');
    const keyword = document.getElementById('search-keyword').value.toLowerCase();
    grid.innerHTML = '';

    const filtered = database.items.filter(item => {
        const catMatch = activeCategory === 'All' || item.category === activeCategory;
        const textMatch = item.title.toLowerCase().includes(keyword) || 
                          item.desc.toLowerCase().includes(keyword) || 
                          item.location.toLowerCase().includes(keyword);
        return catMatch && textMatch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">No records found in database.</p>`;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="item-card-body">
                <span class="type-tag ${item.type}">${item.type}</span>
                <h3>${item.title}</h3>
                <p style="font-size:0.85rem;"><i class="fa-solid fa-location-dot"></i> ${item.location}</p>
                <p style="font-size:0.8rem; color:var(--text-muted);">${item.desc}</p>
                <button class="claim-btn" onclick="initiateClaimModal('${item.id}')">
                    <i class="fa-solid fa-shield-check"></i> Verify & Reclaim
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Category Filter Pills & Search Input
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter');
        renderActiveGrid();
    });
});
document.getElementById('search-keyword').addEventListener('input', renderActiveGrid);

// 4. Claim & Verification Modal Flow
function initiateClaimModal(itemId) {
    const item = database.items.find(i => i.id === itemId);
    if (!item) return;

    document.getElementById('claim-item-id').value = item.id;
    document.getElementById('claim-item-summary').innerHTML = `
        <strong>Target Item:</strong> ${item.title} <br>
        <strong>Category:</strong> ${item.category} | <strong>Spot:</strong> ${item.location}
    `;

    document.getElementById('display-secret-question').innerText = 
        item.type === 'FOUND' ? (item.secretQuestion || 'Verify secret marks or unique details.') : 'Describe secret proof details known to the owner.';

    document.getElementById('modal-step-1').classList.remove('hidden');
    document.getElementById('modal-step-2').classList.add('hidden');
    document.getElementById('claim-modal').classList.remove('hidden');
}

document.getElementById('close-claim-modal').addEventListener('click', () => {
    document.getElementById('claim-modal').classList.add('hidden');
});

// Verification Submission -> Generate Pass & Reveal Founder Info
document.getElementById('form-verify-claim').addEventListener('submit', (e) => {
    e.preventDefault();

    const itemId = document.getElementById('claim-item-id').value;
    const itemIndex = database.items.findIndex(i => i.id === itemId);

    if (itemIndex > -1) {
        const item = database.items[itemIndex];
        const claimantName = document.getElementById('claimant-name').value;
        const claimantPhone = document.getElementById('claimant-phone').value;
        const claimCode = 'CLAIM-' + Math.random().toString(36).substring(2, 7).toUpperCase();

        // 1. Save to Archived History Log
        database.history.unshift({
            title: item.title,
            category: item.category,
            founder: item.founderName || item.reporter || 'Campus Security',
            owner: claimantName,
            code: claimCode,
            date: new Date().toISOString().split('T')[0]
        });

        // 2. Remove from active searchable items
        database.items.splice(itemIndex, 1);
        saveDB();

        // 3. Display Step 2 Reveal Card
        document.getElementById('pass-card-content').innerHTML = `
            <h4><i class="fa-solid fa-ticket"></i> OFFICIAL RECOVERY PASS</h4>
            <p style="margin-top:8px;"><strong>Verification Code:</strong> <code style="color:var(--primary-blue); font-size:1.1rem;">${claimCode}</code></p>
            <hr style="margin:12px 0; border:0; border-top:1px solid var(--border-color);">
            <p><strong>Restored To:</strong> ${claimantName} (${claimantPhone})</p>
            <p><strong>Founder Name:</strong> ${item.founderName || item.reporter || 'N/A'}</p>
            <p><strong>Founder Contact Phone:</strong> ${item.founderContact || item.contact || 'N/A'}</p>
            <p><strong>Handoff / Meeting Location:</strong> ${item.meetingSpot || item.location}</p>
        `;

        playSynthesizedSFX('success');
        document.getElementById('modal-step-1').classList.add('hidden');
        document.getElementById('modal-step-2').classList.remove('hidden');

        renderAllViews();
    }
});

document.getElementById('finish-claim-btn').addEventListener('click', () => {
    document.getElementById('claim-modal').classList.add('hidden');
});

// 5. Render History Table
function renderHistoryTable() {
    const tbody = document.getElementById('history-rows');
    tbody.innerHTML = '';

    if (database.history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No history records archived.</td></tr>`;
        return;
    }

    database.history.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${row.title}</strong></td>
            <td>${row.category}</td>
            <td>${row.founder}</td>
            <td>${row.owner}</td>
            <td><code style="color:var(--primary-blue);">${row.code}</code></td>
            <td>${row.date}</td>
            <td><span class="type-tag FOUND">Reclaimed</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// 6. Admin Section (Password: Rohit@075)
const adminModal = document.getElementById('admin-modal');
document.getElementById('admin-login-btn').addEventListener('click', () => {
    document.getElementById('admin-auth-view').classList.remove('hidden');
    document.getElementById('admin-panel-view').classList.add('hidden');
    adminModal.classList.remove('hidden');
});

document.getElementById('close-admin-modal').addEventListener('click', () => {
    adminModal.classList.add('hidden');
});

document.getElementById('form-admin-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('admin-password-input').value;

    if (pass === ADMIN_PASS) {
        document.getElementById('form-admin-login').reset();
        document.getElementById('admin-auth-view').classList.add('hidden');
        document.getElementById('admin-panel-view').classList.remove('hidden');
        renderAdminItems();
        showToast('Admin Controls Unlocked');
    } else {
        alert('❌ Incorrect Password! Access Denied.');
    }
});

document.getElementById('admin-logout-btn').addEventListener('click', () => {
    adminModal.classList.add('hidden');
});

function renderAdminItems() {
    const tbody = document.getElementById('admin-items-rows');
    tbody.innerHTML = '';

    database.items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.type}</td>
            <td>${item.founderName || item.reporter}</td>
            <td>
                <button class="btn-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="adminDeleteItem('${item.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function adminDeleteItem(id) {
    if (confirm(`Are you sure you want to delete item ${id}?`)) {
        database.items = database.items.filter(i => i.id !== id);
        saveDB();
        renderAllViews();
        renderAdminItems();
        showToast('Item deleted by Admin');
    }
}

document.getElementById('admin-clear-btn').addEventListener('click', () => {
    if (confirm('⚠️ WARNING: This will purge all active items and history from the local database! Continue?')) {
        database = { items: [], history: [] };
        saveDB();
        renderAllViews();
        renderAdminItems();
        showToast('Database Purged');
    }
});

document.getElementById('admin-export-btn').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(database, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", "SQL_Titans_Campus_LF_Backup.json");
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
});

// Helper Updates
function updateStats() {
    document.getElementById('stat-active-lost').innerText = database.items.filter(i => i.type === 'LOST').length;
    document.getElementById('stat-active-found').innerText = database.items.filter(i => i.type === 'FOUND').length;
    document.getElementById('stat-total-restored').innerText = database.history.length;
}

function renderAllViews() {
    renderActiveGrid();
    renderHistoryTable();
    updateStats();
}

function showToast(msg) {
    const host = document.getElementById('toast-host');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${msg}`;
    host.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});
