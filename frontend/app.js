// API Configuration
const API_URL = 'http://localhost:5000/api';

// Check if user is logged in
const token = localStorage.getItem('token');
if (window.location.pathname.includes('dashboard.html') && !token) {
    window.location.href = 'index.html';
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Server error. Please try again.');
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('reg-name').value,
        aadhar: document.getElementById('reg-aadhar').value,
        location: document.getElementById('reg-location').value,
        phone: document.getElementById('reg-phone').value,
        pregnancyMonth: parseInt(document.getElementById('reg-month').value),
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value
    };
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('Server error. Please try again.');
    }
}

// Load Dashboard
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        loadUserData();
        loadSymptoms();
        loadPregnancyTips();
        setupHydrationReminder();
    });
}

// Load User Data
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('welcome-name').textContent = user.name;
        document.getElementById('user-name').textContent = `👋 ${user.name}`;
        document.getElementById('pregnancy-month').textContent = `${user.pregnancyMonth} month`;
        document.getElementById('user-location').textContent = user.location;
        document.getElementById('tip-month').textContent = user.pregnancyMonth;
        
        // Set reminder toggle
        const reminderToggle = document.getElementById('reminder-toggle');
        if (reminderToggle) {
            reminderToggle.checked = user.hydrationReminder;
        }
    }
}

// Load Symptoms (based on pregnancy month)
function loadSymptoms() {
    const user = JSON.parse(localStorage.getItem('user'));
    const month = user?.pregnancyMonth || 5;
    
    const symptoms = [
        { id: 'headache', text: 'Severe Headache', months: [1,2,3,4,5,6,7,8,9] },
        { id: 'swelling', text: 'Swelling in Hands/Feet', months: [5,6,7,8,9] },
        { id: 'bleeding', text: 'Vaginal Bleeding', months: [1,2,3,4,5,6,7,8,9] },
        { id: 'bp', text: 'High Blood Pressure', months: [5,6,7,8,9] },
        { id: 'movement', text: 'Reduced Baby Movement', months: [6,7,8,9] },
        { id: 'vision', text: 'Blurred Vision', months: [5,6,7,8,9] },
        { id: 'pain', text: 'Abdominal Pain', months: [1,2,3,4,5,6,7,8,9] },
        { id: 'nausea', text: 'Severe Nausea', months: [1,2,3] },
        { id: 'backpain', text: 'Severe Back Pain', months: [4,5,6,7,8,9] },
        { id: 'fatigue', text: 'Extreme Fatigue', months: [1,2,3,7,8,9] }
    ];
    
    const relevantSymptoms = symptoms.filter(s => s.months.includes(month));
    
    const symptomGrid = document.getElementById('symptom-list');
    if (symptomGrid) {
        symptomGrid.innerHTML = relevantSymptoms.map(s => `
            <label class="symptom-item">
                <input type="checkbox" id="sym-${s.id}" value="${s.id}">
                <span>${s.text}</span>
            </label>
        `).join('');
    }
}

// Analyze Symptoms
async function analyzeSymptoms() {
    const selectedSymptoms = [];
    const symptomIds = ['headache', 'swelling', 'bleeding', 'bp', 'movement', 'vision', 'pain', 'nausea', 'backpain', 'fatigue'];
    
    symptomIds.forEach(id => {
        const checkbox = document.getElementById(`sym-${id}`);
        if (checkbox && checkbox.checked) {
            selectedSymptoms.push(id);
        }
    });
    
    const user = JSON.parse(localStorage.getItem('user'));
    const month = user?.pregnancyMonth || 5;
    
    const resultDiv = document.getElementById('symptom-result');
    
    // AI-like analysis based on symptoms and pregnancy month
    let riskLevel = 'low';
    let message = '';
    
    if (selectedSymptoms.includes('bleeding') || selectedSymptoms.includes('movement')) {
        riskLevel = 'high';
        message = '🚨 HIGH RISK: Immediate medical attention required! Please go to the nearest hospital.';
    } else if (selectedSymptoms.includes('pain') && month > 6) {
        riskLevel = 'high';
        message = '🚨 HIGH RISK: Severe abdominal pain in late pregnancy requires immediate evaluation.';
    } else if (selectedSymptoms.includes('headache') && selectedSymptoms.includes('vision')) {
        riskLevel = 'high';
        message = '🚨 HIGH RISK: Possible preeclampsia. Seek medical care immediately.';
    } else if (selectedSymptoms.includes('bp') && selectedSymptoms.includes('swelling')) {
        riskLevel = 'high';
        message = '🚨 HIGH RISK: Signs of preeclampsia. Contact your doctor now.';
    } else if (selectedSymptoms.length >= 3) {
        riskLevel = 'medium';
        message = '⚠️ MEDIUM RISK: Multiple symptoms detected. Please consult your doctor within 24 hours.';
    } else if (selectedSymptoms.length > 0) {
        riskLevel = 'medium';
        message = '⚠️ MEDIUM RISK: Monitor your symptoms. Contact doctor if they persist or worsen.';
    } else {
        riskLevel = 'low';
        message = '✅ LOW RISK: No concerning symptoms detected. Continue healthy habits and regular checkups.';
    }
    
    // Add pregnancy month specific advice
    if (month >= 8 && selectedSymptoms.includes('backpain')) {
        message += ' Note: Back pain is common in late pregnancy. Try gentle stretching and proper posture.';
    }
    
    if (month <= 3 && selectedSymptoms.includes('nausea')) {
        message += ' Morning sickness is common in first trimester. Stay hydrated and eat small, frequent meals.';
    }
    
    resultDiv.innerHTML = message;
    resultDiv.className = `result ${riskLevel}`;
    
    // Store for history (optional)
    saveSymptomHistory(selectedSymptoms, riskLevel);
}

// Save symptom check history
function saveSymptomHistory(symptoms, riskLevel) {
    const history = JSON.parse(localStorage.getItem('symptomHistory') || '[]');
    history.push({
        date: new Date().toISOString(),
        symptoms: symptoms,
        riskLevel: riskLevel
    });
    // Keep only last 20 records
    if (history.length > 20) history.shift();
    localStorage.setItem('symptomHistory', JSON.stringify(history));
}

// Check Baby Kicks
function checkKicks() {
    const kicks = document.getElementById('kicks').value;
    const resultDiv = document.getElementById('kickResult');
    
    if (kicks === "") {
        resultDiv.innerHTML = "⚠️ Please enter number of baby movements";
        resultDiv.className = "result medium";
        return;
    }
    
    const kickCount = parseInt(kicks);
    
    if (isNaN(kickCount)) {
        resultDiv.innerHTML = "⚠️ Please enter a valid number";
        resultDiv.className = "result medium";
        return;
    }
    
    if (kickCount < 5) {
        resultDiv.innerHTML = "🚨 ALERT: Low fetal movement (<5 in 1 hour). Contact your doctor immediately or go to the hospital.";
        resultDiv.className = "result high";
    } else if (kickCount < 10) {
        resultDiv.innerHTML = "⚠️ CAUTION: Movement is on the lower side. Do a kick count for another hour. If still less than 10, contact your doctor.";
        resultDiv.className = "result medium";
    } else {
        resultDiv.innerHTML = "✅ NORMAL: Baby movement appears healthy. Keep tracking daily!";
        resultDiv.className = "result low";
    }
    
    // Save kick count history
    saveKickHistory(kickCount);
}

// Save kick count history
function saveKickHistory(kicks) {
    const history = JSON.parse(localStorage.getItem('kickHistory') || '[]');
    history.push({
        date: new Date().toISOString(),
        kicks: kicks
    });
    if (history.length > 30) history.shift();
    localStorage.setItem('kickHistory', JSON.stringify(history));
}

// Load Pregnancy Tips
function loadPregnancyTips() {
    const user = JSON.parse(localStorage.getItem('user'));
    const month = user?.pregnancyMonth || 5;
    
    const tips = {
        1: "• Take folic acid supplements\n• Avoid alcohol and smoking\n• Get plenty of rest\n• Eat small, frequent meals",
        2: "• Stay hydrated\n• Gentle exercise like walking\n• Prenatal vitamins daily\n• Schedule first ultrasound
