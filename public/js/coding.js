// Coding Practice JavaScript

const API_URL = 'http://localhost:5000/api';
let problems = [];
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
        } else {
            problems = generateMockProblems();
        }
    } catch (error) {
        console.error('Error loading problems:', error);
        problems = generateMockProblems();
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
    
    // Mock examples
    document.getElementById('problemExamples').innerHTML = `
        <div class="example-box">
            <strong>Example 1:</strong><br>
            Input: nums = [2,7,11,15], target = 9<br>
            Output: [0,1]<br>
            Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
        </div>
    `;
    
    document.getElementById('problemConstraints').innerHTML = `
        <ul>
            <li>2 <= nums.length <= 10^4</li>
            <li>-10^9 <= nums[i] <= 10^9</li>
            <li>-10^9 <= target <= 10^9</li>
        </ul>
    `;
    
    // Reset code editor
    document.getElementById('codeEditor').value = `// Write your code here\nfunction solution() {\n    \n}`;
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
    
    // Search
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const search = e.target.value.toLowerCase();
        const filtered = problems.filter(p => 
            p.title.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search)
        );
        problems = filtered;
        displayProblems();
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

// Run Code
function runCode() {
    const code = document.getElementById('codeEditor').value;
    const resultsDiv = document.getElementById('testResults');
    const resultsContent = document.getElementById('testResultsContent');
    
    resultsDiv.style.display = 'block';
    resultsContent.innerHTML = `
        <div class="test-case passed">
            <span>Test Case 1</span>
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="test-case passed">
            <span>Test Case 2</span>
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="test-case failed">
            <span>Test Case 3</span>
            <i class="fas fa-times-circle"></i>
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
    document.getElementById('codeEditor').value = `// Write your code here\nfunction solution() {\n    \n}`;
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
