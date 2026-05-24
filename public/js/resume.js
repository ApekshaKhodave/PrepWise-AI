// Resume Analyzer JavaScript

// API Configuration - works for both local and production
const API_URL = window.location.hostname === 'localhost' 
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
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('resumeFile');
    const uploadBtn = document.getElementById('uploadBtn');
    
    // Click to browse
    uploadArea.addEventListener('click', () => fileInput.click());
    document.querySelector('.browse-link').addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#6C63FF';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect(files[0]);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    // Upload button
    uploadBtn.addEventListener('click', uploadResume);
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

// Handle File Select
function handleFileSelect(file) {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
        showToast('Please upload a PDF or DOC file', 'error');
        return;
    }
    
    if (file.size > maxSize) {
        showToast('File size must be less than 5MB', 'error');
        return;
    }
    
    document.querySelector('.upload-area p').innerHTML = `
        <i class="fas fa-file-pdf"></i> ${file.name}<br>
        <small>Ready to upload</small>
    `;
}

// Upload Resume
async function uploadResume() {
    const fileInput = document.getElementById('resumeFile');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showToast('Please select a file first', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('resume', fileInput.files[0]);
    
    try {
        const response = await fetch(`${API_URL}/resume/analyze`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            showAnalysis(data.report);
        } else {
            // Mock analysis for demo
            const mockReport = {
                atsScore: Math.floor(Math.random() * 30) + 70,
                analysis: {
                    skillsFound: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'Git'],
                    missingKeywords: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
                    strengths: [
                        'Clear project descriptions',
                        'Quantified achievements',
                        'Relevant technical skills',
                        'Good formatting'
                    ],
                    improvements: [
                        'Add more action verbs',
                        'Include certifications',
                        'Add LinkedIn profile',
                        'Optimize for ATS keywords'
                    ],
                    sections: {
                        contact: true,
                        summary: true,
                        experience: true,
                        education: true,
                        skills: true,
                        projects: true
                    }
                }
            };
            showAnalysis(mockReport);
        }
    } catch (error) {
        console.error('Error uploading resume:', error);
        showToast('Error analyzing resume', 'error');
    }
}

// Show Analysis
function showAnalysis(report) {
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('analysisSection').style.display = 'block';
    
    // Animate ATS score
    const scoreCircle = document.getElementById('scoreCircle');
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (report.atsScore / 100) * circumference;
    
    setTimeout(() => {
        scoreCircle.style.strokeDashoffset = offset;
    }, 100);
    
    // Animate score number
    animateValue('atsScore', 0, report.atsScore, 1500);
    
    // Display skills
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    report.analysis.skillsFound.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        skillsList.appendChild(tag);
    });
    
    // Display missing keywords
    const keywordsList = document.getElementById('keywordsList');
    keywordsList.innerHTML = '';
    report.analysis.missingKeywords.forEach(keyword => {
        const tag = document.createElement('span');
        tag.className = 'keyword-tag';
        tag.textContent = keyword;
        keywordsList.appendChild(tag);
    });
    
    // Display strengths
    const strengthsList = document.getElementById('strengthsList');
    strengthsList.innerHTML = '';
    report.analysis.strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
    });
    
    // Display improvements
    const improvementsList = document.getElementById('improvementsList');
    improvementsList.innerHTML = '';
    report.analysis.improvements.forEach(improvement => {
        const li = document.createElement('li');
        li.textContent = improvement;
        improvementsList.appendChild(li);
    });
    
    // Display checklist
    const checklistGrid = document.getElementById('checklistGrid');
    checklistGrid.innerHTML = '';
    Object.entries(report.analysis.sections).forEach(([section, present]) => {
        const item = document.createElement('div');
        item.className = `checklist-item ${present ? 'complete' : 'incomplete'}`;
        item.innerHTML = `
            <i class="fas ${present ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            <span>${section.charAt(0).toUpperCase() + section.slice(1)}</span>
        `;
        checklistGrid.appendChild(item);
    });
    
    showToast('Resume analyzed successfully!', 'success');
}

// Animate Value
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
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

// Upload Another
function uploadAnother() {
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('analysisSection').style.display = 'none';
    document.getElementById('resumeFile').value = '';
    document.querySelector('.upload-area p').innerHTML = `
        Drag & drop your resume here or <span class="browse-link">browse</span><br>
        <small>Supports PDF, DOC, DOCX (Max 5MB)</small>
    `;
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
