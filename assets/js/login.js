// Session and Progress Management System
class UserSession {
    constructor() {
        this.storagePrefix = 'mh_student_';
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        // Check if user is already logged in
        if (!this.currentUser) {
            this.checkForExistingUsers();
        }
    }

    // Register or login a student
    login(studentName, studentId, studentEmail = '') {
        // Validate student name and ID
        if (!studentName || !studentId) {
            return { success: false, message: 'Name and Student ID are required' };
        }

        if (studentName.length < 2) {
            return { success: false, message: 'Name must be at least 2 characters' };
        }

        if (studentId.length < 3) {
            return { success: false, message: 'Student ID must be at least 3 characters' };
        }

        // Create user object
        const user = {
            name: studentName.trim(),
            studentId: studentId.trim(),
            email: studentEmail.trim(),
            loginTime: new Date().toISOString(),
            loginCount: 0,
            progress: {
                quizCompleted: 0,
                breathingMinutes: 0,
                tipsViewed: 0,
                gamesPlayed: 0,
                lastQuizScore: null,
                lastQuizDate: null,
                breathingSessions: 0,
                totalSessionTime: 0
            }
        };

        // Check if user already exists
        const existingUser = this.getUserByStudentId(studentId);
        if (existingUser) {
            // Update existing user
            existingUser.loginCount = (existingUser.loginCount || 0) + 1;
            existingUser.lastLogin = new Date().toISOString();
            this.saveUser(existingUser);
            this.setCurrentUser(existingUser);
        } else {
            // Create new user
            user.createdAt = new Date().toISOString();
            user.loginCount = 1;
            this.saveUser(user);
            this.setCurrentUser(user);
        }

        return { success: true, message: 'Login successful', user: user };
    }

    // Save user to localStorage
    saveUser(user) {
        const key = this.storagePrefix + user.studentId;
        localStorage.setItem(key, JSON.stringify(user));
    }

    // Get user by student ID
    getUserByStudentId(studentId) {
        const key = this.storagePrefix + studentId;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    // Get all registered users
    getAllUsers() {
        const users = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.storagePrefix)) {
                const data = localStorage.getItem(key);
                users.push(JSON.parse(data));
            }
        }
        return users;
    }

    // Set current user in session
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('mh_current_user', JSON.stringify(user));
    }

    // Get current user
    getCurrentUser() {
        const data = localStorage.getItem('mh_current_user');
        return data ? JSON.parse(data) : null;
    }

    // Logout current user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('mh_current_user');
    }

    // Update user progress
    updateProgress(updates) {
        if (!this.currentUser) return false;

        this.currentUser.progress = {
            ...this.currentUser.progress,
            ...updates
        };

        this.saveUser(this.currentUser);
        this.setCurrentUser(this.currentUser);
        return true;
    }

    // Add quiz completion
    addQuizCompletion(score, totalQuestions) {
        if (!this.currentUser) return false;

        const progress = this.currentUser.progress;
        progress.quizCompleted = (progress.quizCompleted || 0) + 1;
        progress.lastQuizScore = score;
        progress.lastQuizDate = new Date().toISOString();

        this.updateProgress(progress);
        return true;
    }

    // Add breathing session
    addBreathingSession(minutes) {
        if (!this.currentUser) return false;

        const progress = this.currentUser.progress;
        progress.breathingSessions = (progress.breathingSessions || 0) + 1;
        progress.breathingMinutes = (progress.breathingMinutes || 0) + minutes;
        progress.totalSessionTime = (progress.totalSessionTime || 0) + minutes;

        this.updateProgress(progress);
        return true;
    }

    // Add generic game session (counts toward total sessions)
    addGameSession() {
        if (!this.currentUser) return false;

        const progress = this.currentUser.progress;
        progress.gamesPlayed = (progress.gamesPlayed || 0) + 1;
        this.updateProgress(progress);
        return true;
    }

    // Add tips viewed
    addTipsViewed() {
        if (!this.currentUser) return false;

        const progress = this.currentUser.progress;
        progress.tipsViewed = (progress.tipsViewed || 0) + 1;
        this.updateProgress(progress);
        return true;
    }

    // Get user statistics
    getUserStats() {
        if (!this.currentUser) return null;

        return {
            name: this.currentUser.name,
            studentId: this.currentUser.studentId,
            email: this.currentUser.email,
            createdAt: this.currentUser.createdAt,
            lastLogin: this.currentUser.lastLogin,
            loginCount: this.currentUser.loginCount,
            progress: this.currentUser.progress
        };
    }

    // Check for existing users
    checkForExistingUsers() {
        return this.getAllUsers().length > 0;
    }

    // Delete user data (with confirmation)
    deleteUser(studentId, confirm = false) {
        if (!confirm) return false;

        const key = this.storagePrefix + studentId;
        localStorage.removeItem(key);

        if (this.currentUser && this.currentUser.studentId === studentId) {
            this.logout();
        }

        return true;
    }
}

// Initialize session management
const userSession = new UserSession();

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const existingUsersList = document.getElementById('existing-users');

    // Display existing users
    displayExistingUsers();

    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentName = document.getElementById('student-name').value;
            const studentId = document.getElementById('student-id').value;
            const studentEmail = document.getElementById('student-email').value;

            // Clear previous errors
            document.getElementById('name-error').textContent = '';
            document.getElementById('id-error').textContent = '';

            const result = userSession.login(studentName, studentId, studentEmail);

            if (result.success) {
                // Show success message
                showNotification('Login successful! Welcome, ' + studentName, 'success');
                
                // Redirect to home after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                // Show error message
                if (result.message.includes('Name')) {
                    document.getElementById('name-error').textContent = result.message;
                } else if (result.message.includes('Student ID')) {
                    document.getElementById('id-error').textContent = result.message;
                } else {
                    showNotification(result.message, 'error');
                }
            }
        });
    }
});

// Display existing users
function displayExistingUsers() {
    const existingUsersList = document.getElementById('existing-users');
    if (!existingUsersList) return;

    const users = userSession.getAllUsers();

    if (users.length === 0) {
        existingUsersList.innerHTML = '<p class="no-users">No existing users. Create your account to get started!</p>';
        return;
    }

    existingUsersList.innerHTML = users.map(user => `
        <div class="user-card">
            <div class="user-info">
                <strong>${user.name}</strong>
                <small>ID: ${user.studentId}</small>
            </div>
            <div class="user-actions">
                <button class="btn btn-small" onclick="quickLogin('${user.studentId}')">Login</button>
                <button class="btn btn-small btn-danger" onclick="deleteUserConfirm('${user.studentId}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Quick login for existing users
function quickLogin(studentId) {
    const user = userSession.getUserByStudentId(studentId);
    if (user) {
        user.loginCount = (user.loginCount || 0) + 1;
        user.lastLogin = new Date().toISOString();
        userSession.saveUser(user);
        userSession.setCurrentUser(user);
        
        showNotification('Welcome back, ' + user.name, 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Delete user confirmation
function deleteUserConfirm(studentId) {
    const user = userSession.getUserByStudentId(studentId);
    if (!user) return;

    if (confirm(`Are you sure you want to delete all data for ${user.name}? This cannot be undone.`)) {
        userSession.deleteUser(studentId, true);
        showNotification('User account deleted', 'success');
        displayExistingUsers();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add styles for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export for use in other pages
window.userSession = userSession;
