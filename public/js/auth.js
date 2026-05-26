/* ============================================================
   PREPWISE AI — Authentication JavaScript
   Handles login, signup, forgot password, Google OAuth
   ============================================================ */

// ─── API URL ──────────────────────────────────────────────────
const API_URL = (window.location.protocol === 'file:' ||
                 window.location.hostname === 'localhost' ||
                 window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : '/api';

// ─── Helpers ──────────────────────────────────────────────────

/** Find an input by trying multiple IDs (handles old + new HTML IDs) */
function getVal(...ids) {
    for (const id of ids) {
        const el = document.getElementById(id);
        if (el) return el.value.trim ? el.value.trim() : el.value;
    }
    return '';
}

/** Show a toast notification */
function showToast(message, type = 'success', duration = 3500) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const icons = {
        success: 'fa-circle-check',
        error:   'fa-circle-xmark',
        warning: 'fa-triangle-exclamation',
        info:    'fa-circle-info'
    };
    const colors = {
        success: 'var(--success)',
        error:   'var(--danger)',
        warning: 'var(--warning)',
        info:    'var(--info)'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.success}" style="color:${colors[type] || colors.success};font-size:1.1rem;flex-shrink:0;"></i>
        <span>${message}</span>
    `;
    toast.className = `toast ${type} show`;

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/** Set button to loading state, return restore function */
function setLoading(btn, loadingText) {
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
    return () => {
        btn.disabled = false;
        btn.innerHTML = original;
    };
}

// ─── Google OAuth callback (token in URL) ────────────────────
(function () {
    try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            window.history.replaceState({}, document.title, window.location.pathname);
            window.location.href = 'dashboard.html';
        }
    } catch (_) {}
})();

// ─── Google OAuth button ──────────────────────────────────────
document.querySelectorAll('.btn-google').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = `${API_URL}/auth/google`;
    });
});

// ─── Password toggle (in auth.js as fallback) ─────────────────
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function () {
        const input = this.closest('.input-group')?.querySelector('input[type="password"], input[type="text"]');
        const icon  = this.querySelector('i');
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            icon?.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon?.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// ─── LOGIN ────────────────────────────────────────────────────
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Support both old IDs (email/password) and new IDs (loginEmail/loginPassword)
        const email    = getVal('loginEmail', 'email');
        const password = getVal('loginPassword', 'password');

        if (!email || !password) {
            showToast('Please fill in all fields.', 'error');
            return;
        }

        const btn = loginForm.querySelector('[type="submit"]');
        const restore = setLoading(btn, 'Signing in...');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email, password })
            });

            let data;
            try { data = await response.json(); }
            catch (_) { data = { error: 'Could not parse server response.' }; }

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                const isDemo = data.message?.includes('Demo Mode');
                showToast(
                    isDemo ? '⚠️ Demo Mode — data won\'t persist.' : `Welcome back, ${data.user?.name?.split(' ')[0] || ''}! Redirecting...`,
                    isDemo ? 'warning' : 'success'
                );
                setTimeout(() => { window.location.href = 'dashboard.html'; }, isDemo ? 2000 : 1200);
            } else {
                showToast(data.error || 'Login failed. Check your credentials.', 'error');
                restore();
            }
        } catch (err) {
            console.error('Login error:', err);
            showToast('Cannot reach server. Is the backend running?', 'error');
            restore();
        }
    });
}

// ─── SIGNUP ───────────────────────────────────────────────────
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Support both old IDs (name/email/password) and new IDs (signupName/signupEmail/signupPassword)
        const name     = getVal('signupName', 'name');
        const email    = getVal('signupEmail', 'email');
        const password = getVal('signupPassword', 'password');
        const terms    = document.getElementById('termsCheck') || document.querySelector('input[name="terms"]');

        if (!name) {
            showToast('Please enter your full name.', 'error');
            return;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }
        if (password.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }
        if (terms && !terms.checked) {
            showToast('Please accept the Terms & Conditions.', 'error');
            return;
        }

        const btn = signupForm.querySelector('[type="submit"]');
        const restore = setLoading(btn, 'Creating account...');

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name, email, password })
            });

            let data;
            try { data = await response.json(); }
            catch (_) { data = { error: 'Could not parse server response.' }; }

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                const isDemo = data.message?.includes('Demo Mode');
                showToast(
                    isDemo ? '⚠️ Demo Mode — data won\'t persist.' : `Account created! Welcome, ${data.user?.name?.split(' ')[0] || ''}!`,
                    isDemo ? 'warning' : 'success'
                );
                setTimeout(() => { window.location.href = 'dashboard.html'; }, isDemo ? 2000 : 1200);
            } else {
                showToast(data.error || 'Signup failed. Please try again.', 'error');
                restore();
            }
        } catch (err) {
            console.error('Signup error:', err);
            showToast('Cannot reach server. Is the backend running?', 'error');
            restore();
        }
    });
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────
const forgotLink = document.getElementById('forgotPasswordLink');
if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('forgotModal');
        if (modal) modal.classList.add('show');
    });
}

const sendResetBtn = document.getElementById('sendResetBtn');
if (sendResetBtn) {
    sendResetBtn.addEventListener('click', async () => {
        const email = document.getElementById('forgotEmail')?.value?.trim();
        if (!email) {
            showToast('Please enter your email address.', 'error');
            return;
        }

        const restore = setLoading(sendResetBtn, 'Sending...');

        try {
            await fetch(`${API_URL}/auth/forgot-password`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email })
            });
        } catch (_) {}

        // Always show generic message (don't reveal whether email exists)
        document.getElementById('forgotModal')?.classList.remove('show');
        showToast('If that email is registered, a reset link has been sent.', 'info');
        restore();
    });
}
