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
    
    // Load dashboard stats
    await loadDashboardStats();
    
    // Initialize charts
    initializeCharts();
    
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
            document.getElementById('xpCount').textContent = user.xp;
            document.getElementById('testsCount').textContent = user.testsCompleted;
            document.getElementById('codingCount').textContent = user.codingProblemsSolved;
            document.getElementById('resumeScore').textContent = user.resumeScore + '%';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load Dashboard Stats
async function loadDashboardStats() {
    // This would fetch real data from API
    // For now, using mock data
    const stats = {
        xp: 5420,
        tests: 45,
        coding: 128,
        resumeScore: 85
    };
    
    // Animate stats
    animateValue('xpCount', 0, stats.xp, 1000);
    animateValue('testsCount', 0, stats.tests, 1000);
    animateValue('codingCount', 0, stats.coding, 1000);
    animateValue('resumeScore', 0, stats.resumeScore, 1000);
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

// Initialize Charts
function initializeCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'XP Earned',
                    data: [120, 190, 150, 220, 180, 250, 200],
                    borderColor: '#6C63FF',
                    backgroundColor: 'rgba(108, 99, 255, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 300,
                        ticks: {
                            stepSize: 50
                        },
                        grid: {
                            display: true,
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Skill Chart
    const skillCtx = document.getElementById('skillChart');
    if (skillCtx) {
        new Chart(skillCtx, {
            type: 'doughnut',
            data: {
                labels: ['Aptitude', 'Coding', 'Interview', 'Resume'],
                datasets: [{
                    data: [30, 40, 20, 10],
                    backgroundColor: [
                        '#6C63FF',
                        '#8B5CF6',
                        '#00D4FF',
                        '#10B981'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
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
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

// Load Theme Preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
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
