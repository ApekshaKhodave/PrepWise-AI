// Authentication JavaScript

// API Configuration - works for both local and production
const API_URL = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api';

// Toggle Password Visibility
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('[type="submit"]');
        const originalHTML = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                data = { error: 'Unable to parse server response' };
            }
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                const isDemo = data.message && data.message.includes('Demo Mode');
                showToast(isDemo ? '⚠️ Demo Mode: No database connected. Data won\'t persist.' : 'Login successful! Redirecting...', isDemo ? 'warning' : 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, isDemo ? 2000 : 1000);
            } else {
                showToast(data.error || 'Login failed. Check your credentials.', 'error');
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Cannot reach server. Make sure the backend is running.', 'error');
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    });
}

// Signup Form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const btn = signupForm.querySelector('[type="submit"]');
        const originalHTML = btn.innerHTML;

        if (!name) {
            showToast('Please enter your full name', 'error');
            return;
        }
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                data = { error: 'Unable to parse server response' };
            }
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                const isDemo = data.message && data.message.includes('Demo Mode');
                showToast(isDemo ? '⚠️ Demo Mode: No database connected. Data won\'t persist.' : 'Account created! Redirecting...', isDemo ? 'warning' : 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, isDemo ? 2000 : 1000);
            } else {
                showToast(data.error || 'Signup failed. Please try again.', 'error');
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        } catch (error) {
            console.error('Signup error:', error);
            showToast('Cannot reach server. Make sure the backend is running.', 'error');
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    });
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

// Google Sign In (Mock)
// Handle OAuth token returned in URL (callback)
(function() {
    try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            // Remove token from URL
            window.history.replaceState({}, document.title, window.location.pathname);
            window.location.href = 'dashboard.html';
            return;
        }
    } catch (e) {
        // ignore
    }
})();

// Start real Google OAuth flow by redirecting to backend
document.querySelectorAll('.btn-google').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = `${API_URL}/auth/google`;
    });
});

// Forgot Password
const forgotLink = document.getElementById('forgotPasswordLink');
if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('forgotModal');
        if (modal) modal.style.display = 'flex';
    });
}

const sendResetBtn = document.getElementById('sendResetBtn');
if (sendResetBtn) {
    sendResetBtn.addEventListener('click', async () => {
        const email = document.getElementById('forgotEmail').value.trim();
        if (!email) {
            showToast('Please enter your email address', 'error');
            return;
        }

        sendResetBtn.textContent = 'Sending...';
        sendResetBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json().catch(() => ({}));
            document.getElementById('forgotModal').style.display = 'none';

            if (response.ok) {
                showToast('Password reset link sent! Check your email.', 'success');
            } else {
                // Don't reveal whether email exists — show generic message
                showToast('If that email is registered, a reset link has been sent.', 'success');
            }
        } catch (err) {
            showToast('If that email is registered, a reset link has been sent.', 'success');
            document.getElementById('forgotModal').style.display = 'none';
        } finally {
            sendResetBtn.textContent = 'Send Link';
            sendResetBtn.disabled = false;
        }
    });
}
