// Dashboard JavaScript

// API Configuration - works for both local and production
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api';

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return token;
}

// Get Auth Headers
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', async () => {
    const token = checkAuth();
    if (!token) return;

    // Load user data
    await loadUserData();
    
    // Load dashboard stats (no-op — handled by loadUserData)
    await loadDashboardStats();
    
    // Initialize charts (async — uses real API data)
    await initializeCharts();

    // Load recent activity
    await loadRecentActivity();
    
    // Setup event listeners
    setupEventListeners();
});

// Load User Data
async function loadUserData() {
    try {
        const response = await fetch(`${API_URL}/user/dashboard`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            const user = data.user;
            
            // Update UI with user data
            document.getElementById('userName').textContent = user.name;
            document.getElementById('welcomeName').textContent = user.name;
            document.getElementById('streakCount').textContent = user.streak;

            // Animate real stats from API
            animateValue('xpCount', 0, user.xp || 0, 1000);
            animateValue('testsCount', 0, user.testsCompleted || 0, 1000);
            animateValue('codingCount', 0, user.codingProblemsSolved || 0, 1000);

            const resumeEl = document.getElementById('resumeScore');
            if (resumeEl) {
                resumeEl.textContent = (user.resumeScore || 0) + '%';
            }

            // Update avatar if available
            const avatarEl = document.querySelector('.user-avatar');
            const topbarAvatar = document.getElementById('topbarAvatar');
            if (user.profilePhoto && user.profilePhoto !== 'default-avatar.png') {
                const photoUrl = user.profilePhoto;
                if (avatarEl) avatarEl.src = photoUrl;
                if (topbarAvatar) topbarAvatar.src = photoUrl;
            } else {
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7C3AED&color=fff&bold=true`;
                if (avatarEl) avatarEl.src = avatarUrl;
                if (topbarAvatar) topbarAvatar.src = avatarUrl;
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load Recent Activity from test history
async function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    try {
        const res = await fetch(`${API_URL}/tests/history`, { headers: getAuthHeaders() });
        if (res.ok) {
            const data = await res.json();
            const tests = (data.tests || []).slice(0, 5);

            if (tests.length === 0) {
                activityList.innerHTML = '<p style="color:var(--text-secondary,#888);padding:8px 0;">No activity yet. Start a test to see your progress!</p>';
                return;
            }

            activityList.innerHTML = tests.map(t => {
                const timeAgo = getTimeAgo(new Date(t.createdAt));
                return `
                    <div class="activity-item">
                        <div class="activity-icon blue">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <div class="activity-info">
                            <h4>${capitalize(t.category || 'Aptitude')} Test — ${capitalize(t.difficulty || '')}</h4>
                            <p>Score: ${t.score}% • ${timeAgo}</p>
                        </div>
                        <span class="activity-xp">+${t.score} XP</span>
                    </div>
                `;
            }).join('');
        } else {
            activityList.innerHTML = '<p style="color:var(--text-secondary,#888);padding:8px 0;">Could not load activity.</p>';
        }
    } catch (e) {
        activityList.innerHTML = '<p style="color:var(--text-secondary,#888);padding:8px 0;">Could not load activity.</p>';
    }
}

function getTimeAgo(date) {
    const seconds = Math.floor((Date.now() - date) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    return Math.floor(seconds / 86400) + ' days ago';
}

function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// Load Dashboard Stats — no-op, real data is loaded by loadUserData()
async function loadDashboardStats() {
    // Stats are populated from the /api/user/dashboard response in loadUserData()
}

// Animate Number
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize Charts with real data where available
async function initializeCharts() {
    // Fetch test history for performance chart
    let perfLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let perfData = [0, 0, 0, 0, 0, 0, 0];

    try {
        const res = await fetch(`${API_URL}/tests/history`, { headers: getAuthHeaders() });
        if (res.ok) {
            const data = await res.json();
            const tests = data.tests || [];
            // Map last 7 days of test scores
            const dayMap = {};
            tests.forEach(t => {
                const d = new Date(t.createdAt);
                const day = d.toLocaleDateString('en-US', { weekday: 'short' });
                dayMap[day] = (dayMap[day] || 0) + (t.xpEarned || t.score || 0);
            });
            perfLabels.forEach((label, i) => {
                if (dayMap[label] !== undefined) perfData[i] = dayMap[label];
            });
        }
    } catch (e) { /* use zeros */ }

    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        const isDark = document.body.classList.contains('dark-theme');
        const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
        const textColor = isDark ? '#9B8FC2' : '#6B7280';
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: perfLabels,
                datasets: [{
                    label: 'XP Earned',
                    data: perfData,
                    borderColor: '#7C3AED',
                    backgroundColor: 'rgba(124,58,237,0.10)',
                    tension: 0.45,
                    fill: true,
                    borderWidth: 2.5,
                    pointBackgroundColor: '#7C3AED',
                    pointRadius: 4,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor, drawBorder: false },
                        ticks: { color: textColor, font: { size: 11 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { size: 11 } }
                    }
                }
            }
        });
    }

    // Skill Distribution Chart — built from real user data
    let skillLabels = ['Aptitude', 'Coding', 'Interview', 'Resume'];
    let skillData = [0, 0, 0, 0];
    try {
        const res = await fetch(`${API_URL}/user/dashboard`, { headers: getAuthHeaders() });
        if (res.ok) {
            const data = await res.json();
            const u = data.user;
            skillData = [
                u.testsCompleted || 0,
                u.codingProblemsSolved || 0,
                u.interviewsTaken || 0,
                u.resumeScore || 0
            ];
        }
    } catch (e) { /* use zeros */ }

    const skillCtx = document.getElementById('skillChart');
    if (skillCtx) {
        new Chart(skillCtx, {
            type: 'doughnut',
            data: {
                labels: skillLabels,
                datasets: [{
                    data: skillData,
                    backgroundColor: ['#7C3AED', '#06B6D4', '#10B981', '#F59E0B'],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 14, font: { size: 11 }, usePointStyle: true }
                    }
                }
            }
        });
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

// Toggle Theme
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    if (isDark) {
        icon?.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('prepwise-theme', 'dark');
    } else {
        icon?.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('prepwise-theme', 'light');
    }
}

// Load Theme Preference
const savedTheme = localStorage.getItem('prepwise-theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.addEventListener('DOMContentLoaded', () => {
        const icon = document.querySelector('#themeToggle i');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    });
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
