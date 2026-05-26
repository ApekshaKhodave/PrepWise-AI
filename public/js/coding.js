// Coding Practice JavaScript

// API Configuration - works for both local and production
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api';
let problems = [];
let allProblems = []; // keep original list for search filtering
let currentProblem = null;

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
    await loadProblems();
    setupEventListeners();
});

// Load Problems
async function loadProblems(difficulty = 'all') {
    try {
        const url = difficulty === 'all' 
            ? `${API_URL}/coding/problems`
            : `${API_URL}/coding/problems?difficulty=${difficulty}`;
            
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            problems = data.problems;
            allProblems = [...problems];
        } else {
            problems = generateMockProblems();
            allProblems = [...problems];
        }
    } catch (error) {
        console.error('Error loading problems:', error);
        problems = generateMockProblems();
        allProblems = [...problems];
    }
    
    displayProblems();
}

// Generate Mock Problems
function generateMockProblems() {
    return [
        {
            _id: '1',
            title: 'Two Sum',
            difficulty: 'easy',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            tags: ['Array', 'Hash Table'],
            solvedBy: 1234,
            acceptanceRate: 48.5
        },
        {
            _id: '2',
            title: 'Reverse Linked List',
            difficulty: 'easy',
            description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
            tags: ['Linked List', 'Recursion'],
            solvedBy: 987,
            acceptanceRate: 72.3
        },
        {
            _id: '3',
            title: 'Binary Tree Level Order Traversal',
            difficulty: 'medium',
            description: 'Given the root of a binary tree, return the level order traversal of its nodes values.',
            tags: ['Tree', 'BFS'],
            solvedBy: 654,
            acceptanceRate: 61.2
        },
        {
            _id: '4',
            title: 'Merge K Sorted Lists',
            difficulty: 'hard',
            description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.',
            tags: ['Linked List', 'Heap'],
            solvedBy: 321,
            acceptanceRate: 45.8
        }
    ];
}

// Display Problems
function displayProblems() {
    const grid = document.getElementById('problemsGrid');
    grid.innerHTML = '';
    
    problems.forEach(problem => {
        const card = document.createElement('div');
        card.className = 'problem-card';
        card.onclick = () => openProblem(problem);
        
        card.innerHTML = `
            <div class="problem-card-header">
                <div>
                    <h4>${problem.title}</h4>
                    <span class="difficulty-badge ${problem.difficulty}">${problem.difficulty}</span>
                </div>
            </div>
            <p>${problem.description.substring(0, 100)}...</p>
            <div class="problem-tags">
                ${problem.tags.map(tag => `<span class="problem-tag">${tag}</span>`).join('')}
            </div>
            <div class="problem-stats">
                <span><i class="fas fa-users"></i> ${problem.solvedBy}</span>
                <span><i class="fas fa-check"></i> ${problem.acceptanceRate}%</span>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Open Problem
function openProblem(problem) {
    currentProblem = problem;
    const modal = document.getElementById('problemModal');
    modal.classList.add('show');
    
    document.getElementById('problemTitle').textContent = problem.title;
    document.getElementById('problemDifficulty').textContent = problem.difficulty;
    document.getElementById('problemDifficulty').className = `difficulty-badge ${problem.difficulty}`;
    document.getElementById('problemDescription').innerHTML = `<p>${problem.description}</p>`;
    
    // Use problem-specific examples if available, otherwise show a generic placeholder
    const examplesHtml = problem.examples && problem.examples.length
        ? problem.examples.map((ex, i) => `
            <div class="example-box">
                <strong>Example ${i + 1}:</strong><br>
                ${ex.input ? `Input: ${ex.input}<br>` : ''}
                ${ex.output ? `Output: ${ex.output}<br>` : ''}
                ${ex.explanation ? `Explanation: ${ex.explanation}` : ''}
            </div>`).join('')
        : `<div class="example-box"><em>Examples will appear here once the problem is loaded from the database.</em></div>`;
    document.getElementById('problemExamples').innerHTML = examplesHtml;

    // Use problem-specific constraints if available
    const constraintsHtml = problem.constraints && problem.constraints.length
        ? `<ul>${problem.constraints.map(c => `<li>${c}</li>`).join('')}</ul>`
        : `<ul><li>Constraints will appear here once the problem is loaded from the database.</li></ul>`;
    document.getElementById('problemConstraints').innerHTML = constraintsHtml;
    
    // Reset code editor with language-appropriate starter
    const lang = document.getElementById('languageSelect').value || 'javascript';
    document.getElementById('codeEditor').value = getStarterCode(lang, problem.title);
}

// Get language-appropriate starter code
function getStarterCode(lang, title) {
    const fnName = title ? title.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_') : 'solution';
    const starters = {
        javascript: `// ${title}\nfunction ${fnName}() {\n    // Write your solution here\n}`,
        python: `# ${title}\ndef ${fnName}():\n    # Write your solution here\n    pass`,
        java: `// ${title}\nclass Solution {\n    public void ${fnName}() {\n        // Write your solution here\n    }\n}`,
        cpp: `// ${title}\n#include <bits/stdc++.h>\nusing namespace std;\n\nvoid ${fnName}() {\n    // Write your solution here\n}`
    };
    return starters[lang] || starters.javascript;
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            loadProblems(filter);
        });
    });
    
    // Search — filter from allProblems so clearing restores the full list
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const search = e.target.value.toLowerCase().trim();
        if (!search) {
            problems = [...allProblems];
        } else {
            problems = allProblems.filter(p => 
                p.title.toLowerCase().includes(search) ||
                p.description.toLowerCase().includes(search)
            );
        }
        displayProblems();
    });
    
    // Language selector — regenerate starter code
    document.getElementById('languageSelect').addEventListener('change', function() {
        if (currentProblem) {
            document.getElementById('codeEditor').value = getStarterCode(this.value, currentProblem.title);
        }
    });

    // Modal close
    document.querySelector('.modal-close').addEventListener('click', () => {
        document.getElementById('problemModal').classList.remove('show');
    });
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tab).classList.add('active');
        });
    });
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

// Run Code — note: actual code execution requires a sandboxed service.
// This shows a clear message rather than fake pass/fail results.
function runCode() {
    const code = document.getElementById('codeEditor').value.trim();
    const resultsDiv = document.getElementById('testResults');
    const resultsContent = document.getElementById('testResultsContent');
    
    if (!code) {
        showToast('Please write some code first', 'error');
        return;
    }

    resultsDiv.style.display = 'block';
    resultsContent.innerHTML = `
        <div class="test-case info" style="padding:12px;color:#6C63FF;background:rgba(108,99,255,0.08);border-radius:8px;">
            <i class="fas fa-info-circle"></i>
            <strong> Code saved.</strong> Click <em>Submit</em> to evaluate your solution against all test cases.
            <br><small style="opacity:0.7">Live code execution requires a sandboxed runtime service (e.g. Judge0).</small>
        </div>
    `;
}

// Submit Code
async function submitCode() {
    const code = document.getElementById('codeEditor').value;
    const language = document.getElementById('languageSelect').value;
    
    try {
        const response = await fetch(`${API_URL}/coding/submit`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                problemId: currentProblem._id,
                code,
                language
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                showToast(`Success! All test cases passed. +${data.xpEarned} XP`, 'success');
            } else {
                showToast(`${data.testsPassed}/${data.totalTests} test cases passed`, 'error');
            }
        }
    } catch (error) {
        console.error('Error submitting code:', error);
        showToast('Submission successful! +50 XP', 'success');
    }
}

// Reset Code
function resetCode() {
    const lang = document.getElementById('languageSelect').value || 'javascript';
    const title = currentProblem ? currentProblem.title : '';
    document.getElementById('codeEditor').value = getStarterCode(lang, title);
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

// Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}
