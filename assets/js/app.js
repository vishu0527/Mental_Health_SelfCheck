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
            return;
        }
    }

    // Update user greeting in nav
    updateUserGreeting();

    // Setup logout functionality
    setupLogout();

    // Add reveal animation for key sections
    initRevealAnimations();

    // Create live support chatbot widget
    initLiveChatbot();
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

function initRevealAnimations() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length || !('IntersectionObserver' in window)) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealEls.forEach((el) => observer.observe(el));
}

function initLiveChatbot() {
    if (document.getElementById('live-chatbot-toggle')) {
        return;
    }

    const toggle = document.createElement('button');
    toggle.id = 'live-chatbot-toggle';
    toggle.className = 'chatbot-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open support chatbot');
    toggle.textContent = 'AI';

    const panel = document.createElement('section');
    panel.className = 'chatbot-panel';
    panel.id = 'live-chatbot-panel';
    panel.innerHTML = `
        <header class="chatbot-head">
            <strong>Live Wellness Chat</strong>
            <small>Instant support and guidance</small>
        </header>
        <div class="chatbot-messages" id="chatbot-messages"></div>
        <div class="chatbot-quick" id="chatbot-quick"></div>
        <form class="chatbot-form" id="chatbot-form">
            <input class="chatbot-input" id="chatbot-input" type="text" placeholder="Type your message..." maxlength="300" autocomplete="off" />
            <button class="chatbot-send" type="submit">Send</button>
        </form>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    const messages = panel.querySelector('#chatbot-messages');
    const quick = panel.querySelector('#chatbot-quick');
    const form = panel.querySelector('#chatbot-form');
    const input = panel.querySelector('#chatbot-input');

    const quickReplies = [
        'I feel anxious',
        'Give me a breathing exercise',
        'I feel low',
        'Need emergency help'
    ];

    toggle.addEventListener('click', () => {
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
            input.focus();
        }
    });

    quickReplies.forEach((label) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.textContent = label;
        chip.addEventListener('click', () => {
            submitMessage(label);
        });
        quick.appendChild(chip);
    });

    addBotMessage('Hi, I am your wellness assistant. Tell me what you are feeling right now.');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = input.value.trim();
        if (!value) return;
        submitMessage(value);
    });

    function submitMessage(text) {
        input.value = '';
        addUserMessage(text);

        window.setTimeout(() => {
            const reply = getChatbotReply(text);
            addBotMessage(reply);
        }, 260);
    }

    function addUserMessage(text) {
        addMessage(text, 'user');
    }

    function addBotMessage(text) {
        addMessage(text, 'bot');
    }

    function addMessage(text, role) {
        const row = document.createElement('div');
        row.className = `chat-row ${role}`;
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.textContent = text;
        row.appendChild(bubble);
        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
    }
}

function getChatbotReply(message) {
    const text = message.toLowerCase();

    const emergencyTerms = ['suicide', 'kill myself', 'self harm', 'self-harm', 'end my life', 'want to die', 'emergency', 'crisis'];
    if (emergencyTerms.some((term) => text.includes(term))) {
        return 'Your safety comes first. Please call or text 988 now, or call 911 if there is immediate danger. You can also open the Emergency Help page right now.';
    }

    if (text.includes('anxious') || text.includes('anxiety') || text.includes('panic') || text.includes('stressed')) {
        return 'Try this right now: inhale for 4 seconds, hold for 4, exhale for 6. Repeat for 2 minutes. After that, open Breathing Exercise for guided support.';
    }

    if (text.includes('low') || text.includes('sad') || text.includes('depress') || text.includes('alone')) {
        return 'I hear you. A small first step can help: drink water, sit near natural light, and message one trusted person today. If this feeling stays intense, use the Help page to connect with support.';
    }

    if (text.includes('sleep') || text.includes('insomnia') || text.includes('tired')) {
        return 'For tonight: avoid screens for 30 minutes before bed, do 5 slow breathing cycles, and keep your room cool and dark. If sleep issues continue, consider professional guidance.';
    }

    if (text.includes('breathing')) {
        return 'Use the 4-7-8 method: inhale 4 seconds, hold 7 seconds, exhale 8 seconds. Do 4 cycles. You can also launch the Breathing Exercise page for a visual timer.';
    }

    if (text.includes('quiz') || text.includes('check')) {
        return 'Open Mood Check to get a fast, private snapshot and personalized recommendations based on your responses.';
    }

    if (text.includes('help')) {
        return 'If this is urgent, call or text 988. If there is immediate danger, call 911 now. For non-urgent support, open Emergency Help and contact a counselor resource listed there.';
    }

    return 'I can help with anxiety, low mood, sleep, breathing, quiz guidance, or emergency resources. Tell me what you are dealing with right now.';
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
