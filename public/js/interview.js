// AI Mock Interview JavaScript

// API Configuration - works for both local and production
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api';
let interviewType = 'technical';
let questions = [];
let currentQuestionIndex = 0;
let answers = [];
let startTime;
let timerInterval;
let questionStartTime;

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
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    viewHistory(); // load history on page load
});

// Setup Event Listeners
function setupEventListeners() {
    // Interview type selection
    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            interviewType = this.getAttribute('data-type');
        });
    });
    
    // Start interview
    document.getElementById('startInterviewBtn').addEventListener('click', startInterview);
    
    // Microphone button
    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
        micBtn.addEventListener('click', toggleMicrophone);
    }
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

// Start Interview
async function startInterview() {
    startTime = Date.now();
    
    // Fetch questions
    await fetchQuestions();
    
    // Show interview interface
    document.getElementById('setupSection').style.display = 'none';
    document.getElementById('interviewSection').style.display = 'block';
    
    // Load first question
    loadQuestion(0);
}

// Fetch Questions
async function fetchQuestions() {
    try {
        const response = await fetch(
            `${API_URL}/interview/questions?type=${interviewType}`,
            { headers: getAuthHeaders() }
        );
        
        if (response.ok) {
            const data = await response.json();
            questions = data.questions;
        } else {
            questions = getMockQuestions();
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
        questions = getMockQuestions();
    }
}

// Get Mock Questions
function getMockQuestions() {
    const questionSets = {
        technical: [
            'Explain the difference between var, let, and const in JavaScript.',
            'What is the virtual DOM in React?',
            'Explain the concept of closures in JavaScript.',
            'What are promises and how do they work?',
            'Describe the SOLID principles in software engineering.'
        ],
        hr: [
            'Tell me about yourself.',
            'Why do you want to work for our company?',
            'What are your strengths and weaknesses?',
            'Where do you see yourself in 5 years?',
            'Describe a challenging situation and how you handled it.'
        ],
        behavioral: [
            'Describe a time when you worked in a team.',
            'How do you handle conflicts with team members?',
            'Tell me about a project you are most proud of.',
            'How do you prioritize tasks when working on multiple projects?',
            'Describe a time when you failed and what you learned.'
        ]
    };
    
    return questionSets[interviewType] || questionSets.technical;
}

// Load Question
function loadQuestion(index) {
    currentQuestionIndex = index;
    questionStartTime = Date.now();
    
    document.getElementById('questionNumber').textContent = index + 1;
    document.getElementById('totalQuestions').textContent = questions.length;
    document.getElementById('currentQuestion').textContent = questions[index];
    document.getElementById('answerInput').value = answers[index] || '';
    
    // Start timer for this question
    startQuestionTimer();
}

// Start Question Timer
function startQuestionTimer() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Update timer every second
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        const timerElement = document.getElementById('questionTimer');
        if (timerElement) {
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// Submit Answer
function submitAnswer() {
    const answer = document.getElementById('answerInput').value;
    
    if (!answer.trim()) {
        showToast('Please provide an answer', 'error');
        return;
    }
    
    answers[currentQuestionIndex] = answer;
    
    if (currentQuestionIndex < questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
        showToast('Answer saved!', 'success');
    } else {
        endInterview();
    }
}

// Skip Question
function skipQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        endInterview();
    }
}

// End Interview
async function endInterview() {
    // Stop the timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    const interviewData = {
        interviewType,
        questions: questions.map((q, i) => ({
            question: q,
            answer: answers[i] || '',
            aiScore: Math.floor(Math.random() * 30) + 70
        })),
        duration
    };
    
    try {
        const response = await fetch(`${API_URL}/interview/submit`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(interviewData)
        });
        
        if (response.ok) {
            const data = await response.json();
            showFeedback(data.feedback);
        } else {
            showFeedback(getMockFeedback());
        }
    } catch (error) {
        console.error('Error submitting interview:', error);
        showFeedback(getMockFeedback());
    }
}

// Get Mock Feedback
function getMockFeedback() {
    return {
        overallScore: Math.floor(Math.random() * 20) + 75,
        confidence: Math.floor(Math.random() * 20) + 75,
        communication: Math.floor(Math.random() * 20) + 75,
        technicalAccuracy: Math.floor(Math.random() * 20) + 75,
        clarity: Math.floor(Math.random() * 20) + 75,
        strengths: [
            'Good technical knowledge',
            'Clear communication',
            'Confident delivery'
        ],
        improvements: [
            'Provide more specific examples',
            'Work on body language',
            'Practice common questions'
        ]
    };
}

// Show Feedback
function showFeedback(feedback) {
    document.getElementById('interviewSection').style.display = 'none';
    document.getElementById('feedbackSection').style.display = 'block';
    
    // Animate overall score
    const scoreCircle = document.getElementById('overallScoreCircle');
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (feedback.overallScore / 100) * circumference;
    
    setTimeout(() => {
        scoreCircle.style.strokeDashoffset = offset;
    }, 100);
    
    animateValue('overallScore', 0, feedback.overallScore, 1500);
    
    // Animate metrics
    animateMetric('confidence', feedback.confidence);
    animateMetric('communication', feedback.communication);
    animateMetric('technical', feedback.technicalAccuracy);
    animateMetric('clarity', feedback.clarity);
    
    // Display strengths
    const strengthsList = document.getElementById('strengthsList');
    strengthsList.innerHTML = '';
    feedback.strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
    });
    
    // Display improvements
    const improvementsList = document.getElementById('improvementsList');
    improvementsList.innerHTML = '';
    feedback.improvements.forEach(improvement => {
        const li = document.createElement('li');
        li.textContent = improvement;
        improvementsList.appendChild(li);
    });
}

// Animate Metric
function animateMetric(name, value) {
    const bar = document.getElementById(`${name}Bar`);
    const score = document.getElementById(`${name}Score`);
    
    setTimeout(() => {
        bar.style.width = value + '%';
    }, 100);
    
    animateValue(`${name}Score`, 0, value, 1500, '%');
}

// Animate Value
function animateValue(id, start, end, duration, suffix = '') {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Toggle Microphone — uses Web Speech API if available
function toggleMicrophone() {
    const micBtn = document.getElementById('micBtn');
    const answerInput = document.getElementById('answerInput');

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Voice input is not supported in this browser. Please type your answer.', 'error');
        return;
    }

    if (micBtn.classList.contains('recording')) {
        // Stop recording
        if (window._recognition) {
            window._recognition.stop();
        }
        micBtn.classList.remove('recording');
        showToast('Recording stopped', 'info');
        return;
    }

    // Start recording
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        micBtn.classList.add('recording');
        showToast('Recording... speak your answer', 'info');
    };

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        answerInput.value = transcript;
    };

    recognition.onerror = (event) => {
        micBtn.classList.remove('recording');
        showToast('Voice recognition error: ' + event.error, 'error');
    };

    recognition.onend = () => {
        micBtn.classList.remove('recording');
    };

    window._recognition = recognition;
    recognition.start();
}

// View History — loads and displays past interviews
async function viewHistory() {
    try {
        const response = await fetch(`${API_URL}/interview/history`, {
            headers: getAuthHeaders()
        });

        const historyGrid = document.getElementById('historyGrid');
        if (!historyGrid) return;

        if (response.ok) {
            const data = await response.json();
            const interviews = data.interviews || [];

            if (interviews.length === 0) {
                historyGrid.innerHTML = '<p style="color:var(--text-secondary)">No past interviews yet.</p>';
            } else {
                historyGrid.innerHTML = interviews.map(iv => `
                    <div class="history-item">
                        <div class="history-type">${iv.interviewType || 'Technical'}</div>
                        <div class="history-score">${iv.overallScore || 0}%</div>
                        <div class="history-date">${new Date(iv.createdAt).toLocaleDateString()}</div>
                    </div>
                `).join('');
            }
        } else {
            historyGrid.innerHTML = '<p style="color:var(--text-secondary)">Could not load history.</p>';
        }
    } catch (err) {
        console.error('Error loading interview history:', err);
    }

    // Scroll to history section
    const historySection = document.querySelector('.history-section');
    if (historySection) historySection.scrollIntoView({ behavior: 'smooth' });
}

// Retake Interview
function retakeInterview() {
    window.location.reload();
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
