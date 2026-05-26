// Profile & Settings JavaScript

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
    await loadUserProfile();
    setupEventListeners();
});

// Load User Profile
async function loadUserProfile() {
    try {
        const response = await fetch(`${API_URL}/user/dashboard`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            displayUserProfile(data.user);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Display User Profile
function displayUserProfile(user) {
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('college').value = user.college || '';
    document.getElementById('branch').value = user.branch || '';

    // Update profile badges with real data
    const badges = document.querySelector('.profile-badges');
    if (badges) {
        badges.innerHTML = `
            <span class="badge badge-purple"><i class="fas fa-fire"></i> ${user.streak || 0} Day Streak</span>
            <span class="badge badge-blue"><i class="fas fa-star"></i> ${(user.xp || 0).toLocaleString()} XP</span>
        `;
    }

    // Update avatar
    if (user.profilePhoto && user.profilePhoto !== 'default-avatar.png') {
        const avatarEl = document.getElementById('profileAvatar');
        if (avatarEl) avatarEl.src = user.profilePhoto;
    }
    
    // Display skills
    if (user.skills && user.skills.length > 0) {
        displaySkills(user.skills);
    }
    
    // Display achievements
    displayAchievements(user.achievements || []);
}

// Display Skills
function displaySkills(skills) {
    const skillsGrid = document.getElementById('skillsGrid');
    skillsGrid.innerHTML = '';
    
    skills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'skill-item';
        item.innerHTML = `
            <div class="skill-header">
                <h5>${skill.name}</h5>
                <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="skill-progress">
                <div class="skill-progress-fill" style="width: ${skill.level}%"></div>
            </div>
        `;
        skillsGrid.appendChild(item);
    });
}

// Display Achievements — uses real unlocked achievements from user data,
// merged with the full list of possible achievements
function displayAchievements(unlockedAchievements) {
    const achievementsGrid = document.getElementById('achievementsGrid');
    achievementsGrid.innerHTML = '';
    
    const unlockedTitles = new Set((unlockedAchievements || []).map(a => a.title));

    const allAchievements = [
        { icon: 'fa-fire', title: 'First Streak', description: 'Complete a 7 day streak' },
        { icon: 'fa-trophy', title: 'Top Performer', description: 'Reach top 10 on leaderboard' },
        { icon: 'fa-code', title: 'Code Master', description: 'Solve 100 coding problems' },
        { icon: 'fa-graduation-cap', title: 'Test Champion', description: 'Score 90%+ in 10 tests' },
        { icon: 'fa-star', title: 'Rising Star', description: 'Earn 5000 XP' },
        { icon: 'fa-medal', title: 'Interview Pro', description: 'Complete 10 mock interviews' }
    ];
    
    allAchievements.forEach(achievement => {
        const unlocked = unlockedTitles.has(achievement.title);
        const card = document.createElement('div');
        card.className = `achievement-card ${unlocked ? '' : 'locked'}`;
        card.innerHTML = `
            <div class="achievement-icon">
                <i class="fas ${achievement.icon}"></i>
            </div>
            <h4>${achievement.title}</h4>
            <p>${achievement.description}</p>
            <span class="achievement-date">${unlocked ? 'Unlocked' : 'Locked'}</span>
        `;
        achievementsGrid.appendChild(card);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Profile tabs
    document.querySelectorAll('.profile-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            document.querySelectorAll('.profile-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tab).classList.add('active');
        });
    });
    
    // Profile form
    document.getElementById('profileForm').addEventListener('submit', updateProfile);
    
    // Avatar upload
    document.querySelector('.edit-avatar-btn').addEventListener('click', () => {
        document.getElementById('avatarInput').click();
    });
    
    document.getElementById('avatarInput').addEventListener('change', handleAvatarUpload);
    
    // Theme selector
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
            // Sync preference to backend
            fetch(`${API_URL}/user/preferences`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ theme })
            }).catch(() => {});
        });
    });

    // Delete Account
    const deleteBtn = document.querySelector('.btn-danger');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            const confirmed = window.confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
            );
            if (!confirmed) return;

            try {
                const response = await fetch(`${API_URL}/user/account`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });

                if (response.ok) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    showToast('Account deleted.', 'success');
                    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
                } else {
                    showToast('Failed to delete account. Please try again.', 'error');
                }
            } catch (err) {
                showToast('Error deleting account.', 'error');
            }
        });
    }
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
}

// Update Profile
async function updateProfile(e) {
    e.preventDefault();
    
    const profileData = {
        name: document.getElementById('name').value,
        college: document.getElementById('college').value,
        branch: document.getElementById('branch').value
    };
    
    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        });
        
        if (response.ok) {
            showToast('Profile updated successfully!', 'success');
            
            // Update local storage
            const user = JSON.parse(localStorage.getItem('user'));
            user.name = profileData.name;
            localStorage.setItem('user', JSON.stringify(user));
            
            // Update display
            document.getElementById('profileName').textContent = profileData.name;
        } else {
            showToast('Failed to update profile', 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Error updating profile', 'error');
    }
}

// Handle Avatar Upload — sends to server so it persists
async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('profileAvatar').src = event.target.result;
        const avatarEl = document.querySelector('.user-avatar');
        if (avatarEl) avatarEl.src = event.target.result;
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const response = await fetch(`${API_URL}/user/avatar`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            // Update stored user object
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.profilePhoto = data.profilePhoto;
            localStorage.setItem('user', JSON.stringify(user));
            showToast('Avatar updated!', 'success');
        } else {
            showToast('Avatar preview updated (not saved — server unavailable)', 'info');
        }
    } catch (err) {
        showToast('Avatar preview updated (not saved — server unavailable)', 'info');
    }
}

// Apply Theme
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    } else {
        document.body.classList.remove('dark-theme');
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    localStorage.setItem('theme', theme);
}

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}
