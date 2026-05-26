// Leaderboard JavaScript

// API Configuration - works for both local and production
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api';

// Check Auth
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

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    await loadLeaderboard();
    setupEventListeners();
});

// Load Leaderboard
async function loadLeaderboard(period = 'all') {
    try {
        const response = await fetch(`${API_URL}/leaderboard?period=${period}`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            displayLeaderboard(data.leaderboard);
        } else {
            displayLeaderboard(getMockLeaderboard());
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        displayLeaderboard(getMockLeaderboard());
    }
}

// Get Mock Leaderboard
function getMockLeaderboard() {
    const names = [
        'Rahul Kumar', 'Priya Sharma', 'Arjun Patel', 'Sneha Reddy', 'Vikram Singh',
        'Ananya Gupta', 'Rohan Mehta', 'Divya Iyer', 'Karthik Rao', 'Pooja Nair',
        'Aditya Verma', 'Riya Kapoor', 'Sanjay Desai', 'Meera Joshi', 'Nikhil Shah'
    ];
    
    return names.map((name, index) => ({
        rank: index + 1,
        name,
        email: name.toLowerCase().replace(' ', '.') + '@example.com',
        profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6C63FF&color=fff`,
        xp: 10000 - (index * 500),
        streak: Math.floor(Math.random() * 50) + 10,
        testsCompleted: Math.floor(Math.random() * 100) + 20,
        codingProblemsSolved: Math.floor(Math.random() * 200) + 50
    }));
}

// Display Leaderboard
function displayLeaderboard(leaderboard) {
    // Update top 3 podium with real data
    const top3 = leaderboard.slice(0, 3);
    const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd display order
    document.querySelectorAll('.podium-card').forEach((card, i) => {
        const user = top3[podiumOrder[i]];
        if (!user) return;
        const img = card.querySelector('img');
        const name = card.querySelector('h4');
        const xp = card.querySelector('.xp-count');
        const streakEl = card.querySelector('.stats-mini span:first-child');
        const testsEl = card.querySelector('.stats-mini span:last-child');
        if (img) img.src = user.profilePhoto && user.profilePhoto !== 'default-avatar.png'
            ? user.profilePhoto
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6C63FF&color=fff`;
        if (name) name.textContent = user.name;
        if (xp) xp.innerHTML = `<i class="fas fa-star"></i> ${user.xp.toLocaleString()} XP`;
        if (streakEl) streakEl.innerHTML = `<i class="fas fa-fire"></i> ${user.streak}`;
        if (testsEl) testsEl.innerHTML = `<i class="fas fa-trophy"></i> ${user.testsCompleted}`;
    });

    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    
    // Skip top 3 as they're displayed separately
    leaderboard.slice(3).forEach(user => {
        const avatarSrc = user.profilePhoto && user.profilePhoto !== 'default-avatar.png'
            ? user.profilePhoto
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6C63FF&color=fff`;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="rank-cell">#${user.rank}</td>
            <td>
                <div class="user-cell">
                    <img src="${avatarSrc}" alt="${user.name}">
                    <div class="user-info">
                        <h5>${user.name}</h5>
                        <p>${user.email}</p>
                    </div>
                </div>
            </td>
            <td class="xp-cell">${user.xp.toLocaleString()}</td>
            <td class="streak-cell">
                <i class="fas fa-fire"></i> ${user.streak}
            </td>
            <td>${user.testsCompleted}</td>
            <td>${user.codingProblemsSolved}</td>
        `;
        tbody.appendChild(tr);
    });
    
    // Update your rank — safe even if user is not in top 50
    try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser && currentUser.email) {
            const yourIndex = leaderboard.findIndex(u => u.email === currentUser.email);
            if (yourIndex >= 0) {
                const yourRank = yourIndex + 1;
                document.getElementById('yourRank').textContent = yourRank;
                document.getElementById('yourXP').textContent = leaderboard[yourIndex].xp.toLocaleString();
                if (yourIndex > 0) {
                    const xpToNext = leaderboard[yourIndex - 1].xp - leaderboard[yourIndex].xp;
                    document.getElementById('xpToNext').textContent = xpToNext.toLocaleString();
                } else {
                    document.getElementById('xpToNext').textContent = '0';
                }
            } else {
                document.getElementById('yourRank').textContent = '50+';
                document.getElementById('yourXP').textContent = currentUser.xp ? currentUser.xp.toLocaleString() : '0';
                document.getElementById('xpToNext').textContent = '--';
            }
        }
    } catch (e) {
        // localStorage parse error — leave defaults
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter tabs
    document.querySelectorAll('.filter-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const period = this.getAttribute('data-period');
            loadLeaderboard(period);
        });
    });
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
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

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}
