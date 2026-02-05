// Tips Page Management with Personalized Recommendations

document.addEventListener('DOMContentLoaded', () => {
    loadTips();
    loadPersonalizedTips();
    loadQuickTips();
});

function loadPersonalizedTips() {
    const stats = getUserStats();
    
    if (!stats || stats.progress.lastQuizScore === null) {
        // Show no quiz section
        document.getElementById('personalized-section').style.display = 'none';
        document.getElementById('no-quiz-section').style.display = 'block';
        return;
    }

    // User has completed quiz
    document.getElementById('no-quiz-section').style.display = 'none';
    document.getElementById('personalized-section').style.display = 'block';

    // Calculate stress level (lower score = higher stress)
    const score = stats.progress.lastQuizScore;
    let stressLevel = 'low';
    let stressPercentage = 20;

    if (score < 30) {
        stressLevel = 'high';
        stressPercentage = 85;
    } else if (score < 60) {
        stressLevel = 'medium';
        stressPercentage = 55;
    }

    // Update stress level indicator
    const stressText = document.getElementById('stress-level-text');
    const stressBar = document.getElementById('stress-bar');
    
    const stressLabels = {
        'high': 'High - Immediate stress relief needed',
        'medium': 'Medium - Gradual stress management needed',
        'low': 'Low - Maintaining wellness'
    };
    
    stressText.textContent = stressLabels[stressLevel];
    stressBar.style.backgroundPosition = `${stressPercentage}%`;

    // Load personalized tips based on stress level
    loadPersonalizedTipsByStressLevel(stressLevel);
}

function loadPersonalizedTipsByStressLevel(stressLevel) {
    const tips = [
        {
            stress: 'high',
            icon: '🫁',
            title: 'Immediate Breathing Support',
            description: 'Your stress levels indicate you need immediate relief.',
            details: 'Try the 4-7-8 breathing exercise: Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 5-10 times daily.',
            action: 'Go to Breathing Exercise'
        },
        {
            stress: 'high',
            icon: '🎮',
            title: 'Stress Relief Games',
            description: 'Engage your mind with relaxing games to reduce anxiety.',
            details: 'Play memory games or breathing balloon game to shift focus and calm your mind.',
            action: 'Play Games'
        },
        {
            stress: 'high',
            icon: '💤',
            title: 'Sleep & Rest',
            description: 'Prioritize quality sleep and regular rest breaks.',
            details: 'Aim for 7-9 hours of sleep. Take short 5-10 minute breaks every hour during work or study.',
            action: 'Learn More'
        },
        {
            stress: 'medium',
            icon: '🧘',
            title: 'Regular Meditation',
            description: 'Build a daily meditation practice.',
            details: 'Start with 5-10 minutes of daily meditation. This helps manage moderate stress levels effectively.',
            action: 'Start Meditation'
        },
        {
            stress: 'medium',
            icon: '🏃',
            title: 'Physical Activity',
            description: 'Exercise helps reduce stress hormones.',
            details: 'Try 30 minutes of exercise: walking, yoga, dancing, or any physical activity you enjoy.',
            action: 'Exercise Tips'
        },
        {
            stress: 'medium',
            icon: '📱',
            title: 'Digital Detox',
            description: 'Reduce screen time and social media use.',
            details: 'Set boundaries: No phones 1 hour before bed. Limit social media to 30 minutes per day.',
            action: 'Learn More'
        },
        {
            stress: 'low',
            icon: '🌟',
            title: 'Maintain Your Wellness',
            description: 'You are doing well! Keep your stress levels low.',
            details: 'Continue your current practices. Maintain regular exercise, sleep, and mindfulness activities.',
            action: 'Continue'
        },
        {
            stress: 'low',
            icon: '🎯',
            title: 'Goal Setting',
            description: 'Set positive goals for continued growth.',
            details: 'Focus on small, achievable goals. Celebrate your progress regularly.',
            action: 'Set Goals'
        },
        {
            stress: 'low',
            icon: '🤝',
            title: 'Social Connection',
            description: 'Maintain healthy relationships and social support.',
            details: 'Spend time with friends, family, or support groups. Social connection is vital for mental health.',
            action: 'Build Community'
        }
    ];

    const container = document.getElementById('personalized-tips');
    container.innerHTML = '';

    const filteredTips = tips.filter(tip => tip.stress === stressLevel);
    
    filteredTips.forEach(tip => {
        const card = document.createElement('div');
        card.className = `tip-card stress-${stressLevel}`;
        card.innerHTML = `
            <span class="tip-level level-${stressLevel}">${stressLevel.toUpperCase()}</span>
            <div class="tip-icon">${tip.icon}</div>
            <h3>${tip.title}</h3>
            <p>${tip.description}</p>
            <div class="tip-details">${tip.details}</div>
            <button class="btn btn-small btn-primary" style="width: 100%;">${tip.action}</button>
        `;
        
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
        
        container.appendChild(card);
    });
}

function loadTips() {
    const generalTips = [
        {
            icon: '🧠',
            title: 'Practice Mindfulness',
            description: 'Be present in the moment and observe thoughts without judgment.',
            details: 'Spend 5-10 minutes daily focusing on your breath or surroundings.'
        },
        {
            icon: '🏃',
            title: 'Regular Exercise',
            description: 'Physical activity reduces stress hormones and improves mood.',
            details: 'Aim for at least 30 minutes of moderate exercise, 5 days a week.'
        },
        {
            icon: '💤',
            title: 'Quality Sleep',
            description: 'Sleep is essential for mental health and stress recovery.',
            details: 'Maintain a consistent sleep schedule. Aim for 7-9 hours each night.'
        },
        {
            icon: '🎵',
            title: 'Music Therapy',
            description: 'Listening to music can calm your nervous system.',
            details: 'Listen to relaxing music for 15-20 minutes during stressful moments.'
        },
        {
            icon: '📖',
            title: 'Journaling',
            description: 'Writing helps process emotions and organize thoughts.',
            details: 'Spend 10-15 minutes daily writing about your feelings and experiences.'
        },
        {
            icon: '🌿',
            title: 'Connect with Nature',
            description: 'Spending time in nature reduces stress and anxiety.',
            details: 'Take walks outdoors, sit in parks, or practice gardening.'
        },
        {
            icon: '🤝',
            title: 'Social Support',
            description: 'Connecting with others is healing and supportive.',
            details: 'Share your feelings with trusted friends, family, or counselors.'
        },
        {
            icon: '🍎',
            title: 'Healthy Nutrition',
            description: 'Good nutrition supports mental health and stress management.',
            details: 'Eat balanced meals with plenty of fruits, vegetables, and hydration.'
        }
    ];

    const container = document.getElementById('general-tips-container');
    container.innerHTML = '';

    generalTips.forEach(tip => {
        const card = document.createElement('div');
        card.className = 'tip-card';
        card.innerHTML = `
            <div class="tip-icon">${tip.icon}</div>
            <h3>${tip.title}</h3>
            <p>${tip.description}</p>
            <div class="tip-details">${tip.details}</div>
        `;
        
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
        
        container.appendChild(card);
    });
}

function loadQuickTips() {
    const quickTips = [
        {
            emoji: '⏰',
            title: '5-4-3-2-1 Grounding',
            description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
            time: '5 minutes'
        },
        {
            emoji: '🧊',
            title: 'Cold Water Therapy',
            description: 'Splash cold water on your face or hold ice cubes to activate your calm response.',
            time: '2 minutes'
        },
        {
            emoji: '🚶',
            title: 'Take a Walk',
            description: 'A 10-minute walk can significantly reduce stress and clear your mind.',
            time: '10 minutes'
        },
        {
            emoji: '🎵',
            title: 'Listen to Music',
            description: 'Play your favorite relaxing song and let it soothe your nervous system.',
            time: '3-5 minutes'
        },
        {
            emoji: '🤗',
            title: 'Progressive Relaxation',
            description: 'Tense and release each muscle group from toes to head.',
            time: '10 minutes'
        },
        {
            emoji: '☕',
            title: 'Mindful Beverage',
            description: 'Slowly sip a warm drink while focusing on the taste and sensation.',
            time: '5-10 minutes'
        },
        {
            emoji: '📝',
            title: 'Brain Dump',
            description: 'Write down all your worries without filtering. Get them out of your head.',
            time: '5 minutes'
        },
        {
            emoji: '🌬️',
            title: 'Box Breathing',
            description: 'Breathe in for 4, hold for 4, exhale for 4, hold for 4. Repeat 5 times.',
            time: '3 minutes'
        }
    ];

    const container = document.getElementById('quick-tips-container');
    container.innerHTML = '';

    quickTips.forEach(tip => {
        const box = document.createElement('div');
        box.className = 'quick-tip-box';
        box.innerHTML = `
            <div class="quick-tip-title" style="--emoji: '${tip.emoji}'">
                ${tip.emoji} ${tip.title}
            </div>
            <p class="quick-tip-description">${tip.description}</p>
            <div class="quick-tip-time">⏱️ ${tip.time}</div>
        `;
        
        container.appendChild(box);
    });
}

// Add CSS for tip cards and modal
const tipStyles = document.createElement('style');
tipStyles.textContent = `
    .tips-categories {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 30px;
    }
    
    .category {
        padding: 10px 20px;
        background: #f0f0f0;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .category.active {
        background: #4CAF50;
        color: white;
    }
    
    .category:hover {
        background: #e0e0e0;
    }
    
    .category.active:hover {
        background: #45a049;
    }
    
    .tips-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }
    
    .tip-card {
        background: white;
        border-radius: 10px;
        padding: 25px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }
    
    .tip-card:hover {
        transform: translateY(-5px);
    }
    
    .tip-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
    }
    
    .tip-header h3 {
        color: #333;
        font-size: 1.2rem;
        margin: 0;
    }
    
    .difficulty {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .difficulty-easy {
        background: #e8f5e8;
        color: #2e7d32;
    }
    
    .difficulty-medium {
        background: #fff3e0;
        color: #f57c00;
    }
    
    .difficulty-hard {
        background: #ffebee;
        color: #c62828;
    }
    
    .tip-description {
        color: #666;
        line-height: 1.6;
        margin-bottom: 15px;
    }
    
    .tip-meta {
        display: flex;
        gap: 15px;
        font-size: 0.9rem;
        color: #888;
    }
    
    .custom-tip-section {
        background: #f8f9fa;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
    }
    
    .custom-tip-section h3 {
        color: #333;
        margin-bottom: 15px;
    }
    
    .custom-tip-section p {
        color: #666;
        margin-bottom: 20px;
    }
    
    .quick-tips {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 15px;
    }
    
    .quick-tip-btn {
        background: #2196F3;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .quick-tip-btn:hover {
        background: #1976D2;
    }
    
    /* Modal Styles */
    .tip-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    }
    
    .close-modal {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 24px;
        cursor: pointer;
        color: #999;
    }
    
    .close-modal:hover {
        color: #333;
    }
    
    .modal-content h2 {
        color: #333;
        margin-bottom: 15px;
    }
    
    .modal-content p {
        color: #666;
        margin-bottom: 20px;
    }
    
    .modal-content h3 {
        color: #333;
        margin-bottom: 15px;
    }
    
    .modal-content ol {
        color: #666;
        padding-left: 20px;
    }
    
    .modal-content li {
        margin-bottom: 8px;
    }
    
    .close-modal-btn {
        margin-top: 20px;
    }
    
    @media (max-width: 768px) {
        .tips-categories {
            flex-direction: column;
            align-items: center;
        }
        
        .category {
            width: 200px;
        }
        
        .tips-grid {
            grid-template-columns: 1fr;
        }
        
        .quick-tips {
            flex-direction: column;
            align-items: center;
        }
        
        .quick-tip-btn {
            width: 200px;
        }
    }
`;

document.head.appendChild(tipStyles);

// Load tips data and initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load tips JSON if not already available
    if (!window.tipsData) {
        fetch('data/tips.json')
            .then(response => response.json())
            .then(data => {
                window.tipsData = data;
                new TipsManager();
            })
            .catch(error => {
                console.error('Error loading tips:', error);
                // Fallback data if fetch fails
                window.tipsData = {
                    immediate: [],
                    daily: [],
                    long_term: [],
                    quick_tips: {}
                };
                new TipsManager();
            });
    } else {
        new TipsManager();
    }
});