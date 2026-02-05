// Global App Session Management
// This file manages user session and ensures login is required for accessing the app

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = window.userSession ? window.userSession.getCurrentUser() : null;
    
    // Only redirect to login if not on login page
    if (!currentUser && !window.location.pathname.includes('login.html')) {
        // Allow access to help.html without login (for emergency purposes)
        if (!window.location.pathname.includes('help.html')) {
            // Redirect to login
            window.location.href = 'login.html';
        }
    }

    // Update user greeting in nav
    updateUserGreeting();
    
    // Setup logout functionality
    setupLogout();
});

function updateUserGreeting() {
    const currentUser = window.userSession ? window.userSession.getCurrentUser() : null;
    const greetingElement = document.getElementById('user-greeting');
    const profileBtn = document.getElementById('profile-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (greetingElement) {
        if (currentUser) {
            greetingElement.textContent = `Welcome, ${currentUser.name}!`;
            if (profileBtn) profileBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
        } else {
            greetingElement.textContent = 'Welcome';
        }
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        if (window.userSession) {
            window.userSession.logout();
        }
        window.location.href = 'login.html';
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Utility function to format time
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Utility function to get user statistics
function getUserStats() {
    if (window.userSession) {
        return window.userSession.getUserStats();
    }
    return null;
}

// Utility function to save quiz completion
function saveQuizCompletion(score, totalQuestions) {
    if (window.userSession && window.userSession.currentUser) {
        window.userSession.addQuizCompletion(score, totalQuestions);
    }
}

// Utility function to save breathing session
function saveBreathingSession(minutes) {
    if (window.userSession && window.userSession.currentUser) {
        window.userSession.addBreathingSession(minutes);
    }
}
