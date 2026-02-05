// Profile Page Management
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = window.userSession ? window.userSession.getCurrentUser() : null;
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    loadUserProfile();
    loadProgressStats();
    loadAchievements();
    loadRecentActivity();
});

function loadUserProfile() {
    const stats = getUserStats();
    if (!stats) return;

    document.getElementById('profile-name').textContent = stats.name;
    document.getElementById('profile-id').textContent = `Student ID: ${stats.studentId}`;
    document.getElementById('profile-email').textContent = stats.email ? `Email: ${stats.email}` : 'Email: Not provided';
    
    if (stats.createdAt) {
        const createdDate = new Date(stats.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        document.getElementById('profile-created').textContent = `Account created: ${createdDate}`;
    }
    
    document.getElementById('profile-logins').textContent = `Total logins: ${stats.loginCount}`;
}

function loadProgressStats() {
    const stats = getUserStats();
    if (!stats) return;

    const progress = stats.progress;

    // Update stat cards
    document.getElementById('quiz-count').textContent = progress.quizCompleted || 0;
    document.getElementById('breathing-minutes').textContent = progress.breathingMinutes || 0;
    document.getElementById('breathing-sessions').textContent = progress.breathingSessions || 0;
    document.getElementById('tips-viewed').textContent = progress.tipsViewed || 0;
    
    const totalSessions = (progress.quizCompleted || 0) + (progress.breathingSessions || 0);
    document.getElementById('total-sessions').textContent = totalSessions;
    
    if (progress.lastQuizScore !== null) {
        const percentage = Math.round((progress.lastQuizScore / 100) * 100);
        document.getElementById('last-quiz-score').textContent = `${percentage}%`;
    }
}

function loadAchievements() {
    const stats = getUserStats();
    if (!stats) return;

    const progress = stats.progress;
    const achievements = [];

    // Check achievement conditions
    if (progress.breathingSessions >= 1) achievements.push('1-breathing');
    if (progress.quizCompleted >= 1) achievements.push('1-quiz');
    if (progress.breathingMinutes >= 5) achievements.push('5-minutes');
    if (progress.breathingSessions >= 10) achievements.push('10-sessions');
    if (progress.quizCompleted >= 5) achievements.push('5-quizzes');

    // Display achievement badges
    document.querySelectorAll('.badge').forEach(badge => {
        const badgeId = badge.id;
        const requirement = badge.getAttribute('data-unlock');
        
        if (achievements.includes(requirement)) {
            badge.classList.add('unlocked');
        } else {
            badge.classList.add('locked');
        }
    });
}

function loadRecentActivity() {
    const stats = getUserStats();
    if (!stats) return;

    const progress = stats.progress;
    const activities = [];
    const container = document.getElementById('activities-container');
    const template = document.getElementById('activity-template');

    // Build activity list
    if (progress.quizCompleted > 0) {
        activities.push({
            text: `Completed ${progress.quizCompleted} mood check(s)`,
            date: progress.lastQuizDate
        });
    }
    
    if (progress.breathingSessions > 0) {
        activities.push({
            text: `Completed ${progress.breathingSessions} breathing exercise(s) (${progress.breathingMinutes} minutes)`,
            date: stats.lastLogin
        });
    }

    if (stats.createdAt) {
        activities.push({
            text: 'Account created',
            date: stats.createdAt
        });
    }

    // Sort by date descending
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (activities.length === 0) {
        container.innerHTML = '<p class="no-activity">No recent activity yet. Start your wellness journey!</p>';
        return;
    }

    container.innerHTML = '';
    activities.forEach(activity => {
        const clone = template.cloneNode(true);
        clone.style.display = 'flex';
        clone.querySelector('.activity-text').textContent = activity.text;
        
        const date = new Date(activity.date);
        const dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        clone.querySelector('.activity-date').textContent = dateStr;
        
        container.appendChild(clone);
    });
}

function exportUserData() {
    const stats = getUserStats();
    if (!stats) {
        alert('No user data found');
        return;
    }

    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mental-health-data-${stats.studentId}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function deleteAccountConfirm() {
    const stats = getUserStats();
    if (!stats) return;

    const confirmMsg = `Are you sure you want to delete all data for "${stats.name}"?\n\nThis action cannot be undone and all your progress will be permanently deleted.`;
    
    if (confirm(confirmMsg)) {
        const secondConfirm = confirm('This is your last chance to change your mind. Delete anyway?');
        if (secondConfirm) {
            if (window.userSession) {
                window.userSession.deleteUser(stats.studentId, true);
            }
            alert('Your account and all data have been deleted.');
            window.location.href = 'login.html';
        }
    }
}
