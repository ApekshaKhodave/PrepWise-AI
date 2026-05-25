// Company Roadmap JavaScript

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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Modal close
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

// View Roadmap
function viewRoadmap(company) {
    const roadmaps = {
        google: {
            title: 'Google Preparation Roadmap',
            steps: [
                {
                    phase: 'Phase 1',
                    title: 'Foundation Building',
                    description: 'Master data structures and algorithms fundamentals',
                    duration: '2-3 months',
                    skills: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'],
                    resources: [
                        'LeetCode Easy & Medium problems',
                        'Cracking the Coding Interview',
                        'Google Tech Dev Guide'
                    ]
                },
                {
                    phase: 'Phase 2',
                    title: 'System Design',
                    description: 'Learn to design scalable systems',
                    duration: '1-2 months',
                    skills: ['Scalability', 'Load Balancing', 'Caching', 'Database Design', 'Microservices'],
                    resources: [
                        'System Design Primer',
                        'Designing Data-Intensive Applications',
                        'Google SRE Book'
                    ]
                },
                {
                    phase: 'Phase 3',
                    title: 'Behavioral Preparation',
                    description: 'Prepare for Googleyness and Leadership interviews',
                    duration: '2-4 weeks',
                    skills: ['STAR Method', 'Leadership', 'Teamwork', 'Problem Solving'],
                    resources: [
                        'Google Interview Warmup',
                        'Behavioral Interview Questions',
                        'Mock Interviews'
                    ]
                },
                {
                    phase: 'Phase 4',
                    title: 'Mock Interviews',
                    description: 'Practice with real interview scenarios',
                    duration: '2-3 weeks',
                    skills: ['Coding Under Pressure', 'Communication', 'Time Management'],
                    resources: [
                        'Pramp',
                        'Interviewing.io',
                        'PrepWise AI Mock Interviews'
                    ]
                }
            ]
        },
        microsoft: {
            title: 'Microsoft Preparation Roadmap',
            steps: [
                {
                    phase: 'Phase 1',
                    title: 'Core Programming',
                    description: 'Strong foundation in programming and problem solving',
                    duration: '2 months',
                    skills: ['C++/Java', 'OOP', 'Data Structures', 'Algorithms'],
                    resources: ['LeetCode', 'HackerRank', 'GeeksforGeeks']
                },
                {
                    phase: 'Phase 2',
                    title: 'Microsoft Technologies',
                    description: 'Familiarize with Microsoft tech stack',
                    duration: '1 month',
                    skills: ['.NET', 'Azure', 'C#', 'SQL Server'],
                    resources: ['Microsoft Learn', 'Azure Documentation']
                },
                {
                    phase: 'Phase 3',
                    title: 'Interview Practice',
                    description: 'Practice coding and behavioral questions',
                    duration: '1 month',
                    skills: ['Problem Solving', 'Communication', 'Teamwork'],
                    resources: ['Mock Interviews', 'Glassdoor Reviews']
                }
            ]
        },
        amazon: {
            title: 'Amazon Preparation Roadmap',
            steps: [
                {
                    phase: 'Phase 1',
                    title: 'Leadership Principles',
                    description: 'Understand and prepare for Amazon\'s 16 Leadership Principles',
                    duration: '2-3 weeks',
                    skills: ['Customer Obsession', 'Ownership', 'Invent and Simplify', 'Bias for Action'],
                    resources: ['Amazon Leadership Principles', 'STAR Method Examples']
                },
                {
                    phase: 'Phase 2',
                    title: 'Coding Skills',
                    description: 'Master algorithms and data structures',
                    duration: '2 months',
                    skills: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
                    resources: ['LeetCode Amazon Tagged', 'AlgoExpert']
                },
                {
                    phase: 'Phase 3',
                    title: 'System Design',
                    description: 'Learn to design scalable e-commerce systems',
                    duration: '1 month',
                    skills: ['Distributed Systems', 'Scalability', 'AWS Services'],
                    resources: ['System Design Interview', 'AWS Documentation']
                }
            ]
        },
        tcs: {
            title: 'TCS Preparation Roadmap',
            steps: [
                {
                    phase: 'Phase 1',
                    title: 'TCS NQT Preparation',
                    description: 'Prepare for TCS National Qualifier Test',
                    duration: '1 month',
                    skills: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'],
                    resources: ['TCS NQT Previous Papers', 'IndiaBix', 'PrepInsta']
                },
                {
                    phase: 'Phase 2',
                    title: 'Programming Basics',
                    description: 'Learn C, Java, or Python basics',
                    duration: '2-3 weeks',
                    skills: ['Basic Programming', 'Problem Solving'],
                    resources: ['HackerRank', 'CodeChef']
                },
                {
                    phase: 'Phase 3',
                    title: 'Interview Preparation',
                    description: 'Prepare for technical and HR rounds',
                    duration: '2 weeks',
                    skills: ['Communication', 'Confidence', 'Basic Technical Knowledge'],
                    resources: ['Mock Interviews', 'Common Interview Questions']
                }
            ]
        },
        infosys: {
            title: 'Infosys Preparation Roadmap',
            steps: [
                {
                    phase: 'Phase 1',
                    title: 'Aptitude Test',
                    description: 'Prepare for Infosys aptitude test',
                    duration: '3-4 weeks',
                    skills: ['Quantitative', 'Logical', 'Verbal', 'Pseudocode'],
                    resources: ['InfyTQ', 'Previous Papers']
                },
                {
                    phase: 'Phase 2',
                    title: 'Programming',
                    description: 'Learn programming fundamentals',
                    duration: '1 month',
                    skills: ['Java/Python', 'Data Structures', 'Algorithms'],
                    resources: ['HackerRank', 'LeetCode Easy']
                },
                {
                    phase: 'Phase 3',
                    title: 'Interview Round',
                    description: 'Prepare for technical and HR interviews',
                    duration: '2 weeks',
                    skills: ['Communication', 'Projects', 'Resume'],
                    resources: ['Mock Interviews']
                }
            ]
        },
        wipro: {
            title: 'Wipro Preparation Roadmap',
            steps: [
                {
                    phase: 'Phase 1',
                    title: 'Written Test',
                    description: 'Prepare for Wipro WILP test',
                    duration: '1 month',
                    skills: ['Aptitude', 'Technical MCQs', 'English'],
                    resources: ['Previous Papers', 'Online Tests']
                },
                {
                    phase: 'Phase 2',
                    title: 'Coding Round',
                    description: 'Practice coding problems',
                    duration: '2-3 weeks',
                    skills: ['C/Java', 'Problem Solving'],
                    resources: ['HackerRank', 'CodeChef']
                },
                {
                    phase: 'Phase 3',
                    title: 'Interview',
                    description: 'Technical and HR interview preparation',
                    duration: '2 weeks',
                    skills: ['Communication', 'Confidence'],
                    resources: ['Mock Interviews']
                }
            ]
        }
    };
    
    const roadmap = roadmaps[company];
    if (!roadmap) return;
    
    document.getElementById('roadmapTitle').textContent = roadmap.title;
    
    const timeline = document.getElementById('roadmapTimeline');
    timeline.innerHTML = '';
    
    roadmap.steps.forEach((step, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-marker">${index + 1}</div>
            <div class="timeline-content">
                <h4>${step.phase}: ${step.title}</h4>
                <p>${step.description}</p>
                <div class="skills-required">
                    ${step.skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
                </div>
                <h5>Resources:</h5>
                <ul class="resources-list">
                    ${step.resources.map(resource => `<li>${resource}</li>`).join('')}
                </ul>
                <span class="timeline-duration">
                    <i class="fas fa-clock"></i> ${step.duration}
                </span>
            </div>
        `;
        timeline.appendChild(item);
    });
    
    document.getElementById('roadmapModal').classList.add('show');
}

// Close Modal
function closeModal() {
    document.getElementById('roadmapModal').classList.remove('show');
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
