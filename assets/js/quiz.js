class MoodQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.questions = questions;
        this.container = document.getElementById('quiz-container');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('retake-quiz').addEventListener('click', () => this.resetQuiz());
    }

    startQuiz() {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        this.showQuestion();
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const progressText = document.getElementById('progress-text');
        const progressFill = document.getElementById('progress-fill');

        questionText.textContent = question.text;
        
        optionsContainer.innerHTML = '';
        
        question.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <input type="radio" name="question${question.id}" value="${option.value}" id="option${option.value}">
                <label for="option${option.value}">${option.label}</label>
            `;
            
            optionElement.addEventListener('click', () => this.selectOption(optionElement, option.value));
            optionsContainer.appendChild(optionElement);
        });

        progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
        const progressPercentage = ((this.currentQuestion + 1) / this.questions.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;

        // Load previous answer if exists
        const previousAnswer = this.answers[this.currentQuestion];
        if (previousAnswer) {
            const selectedOption = document.querySelector(`input[value="${previousAnswer}"]`);
            if (selectedOption) {
                selectedOption.checked = true;
                selectedOption.parentElement.classList.add('selected');
            }
        }
    }

    selectOption(optionElement, value) {
        // Remove previous selection
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        optionElement.classList.add('selected');
        optionElement.querySelector('input').checked = true;
        
        // Save answer
        this.answers[this.currentQuestion] = value;
        
        // Auto-advance after a short delay
        setTimeout(() => {
            this.nextQuestion();
        }, 500);
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('results-screen').style.display = 'block';
        
        this.calculateScore();
        this.displayResults();
        this.saveResults();
    }

    calculateScore() {
        this.score = this.answers.reduce((total, answer) => total + answer, 0);
        this.average = (this.score / this.questions.length).toFixed(1);
    }

    displayResults() {
        const resultsContent = document.getElementById('results-content');
        let moodLevel, moodDescription, recommendations, colorClass;

        if (this.average <= 1.5) {
            moodLevel = "Excellent";
            moodDescription = "You're feeling great! Keep up the positive momentum and continue self-care practices.";
            recommendations = this.generateRecommendations(1);
            colorClass = "excellent";
        } else if (this.average <= 2.5) {
            moodLevel = "Good";
            moodDescription = "You're doing well overall. Consider implementing some minor self-care adjustments.";
            recommendations = this.generateRecommendations(2);
            colorClass = "good";
        } else if (this.average <= 3.5) {
            moodDescription = "Your mood is neutral. This is a good time to focus on self-care and stress management.";
            moodLevel = "Neutral";
            recommendations = this.generateRecommendations(3);
            colorClass = "neutral";
        } else if (this.average <= 4.5) {
            moodLevel = "Concerning";
            moodDescription = "You're experiencing some challenges. Consider reaching out for support and implementing stress-reduction techniques.";
            recommendations = this.generateRecommendations(4);
            colorClass = "concerning";
        } else {
            moodLevel = "Critical";
            moodDescription = "You're in a difficult place. Please consider reaching out to mental health resources or professionals.";
            recommendations = this.generateRecommendations(5);
            colorClass = "critical";
        }

        resultsContent.innerHTML = `
            <div class="results-summary ${colorClass}">
                <div class="score-display">${this.average}/5</div>
                <div class="mood-level">${moodLevel}</div>
                <div class="mood-description">${moodDescription}</div>
                
                <div class="recommendations">
                    <h4>Recommendations:</h4>
                    <ul>
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                
                ${this.average >= 4 ? `
                    <div class="emergency-prompt">
                        <p><strong>If you're in crisis, please reach out immediately:</strong></p>
                        <p><a href="help.html" class="btn btn-danger">Get Emergency Help</a></p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    generateRecommendations(moodLevel) {
        const recommendations = {
            1: [
                "Maintain your current self-care routine",
                "Continue connecting with supportive friends",
                "Set new goals and challenges to stay motivated",
                "Practice gratitude daily"
            ],
            2: [
                "Incorporate regular exercise into your routine",
                "Practice mindfulness for 5-10 minutes daily",
                "Ensure you're getting adequate sleep",
                "Consider journaling to process emotions"
            ],
            3: [
                "Try breathing exercises when feeling stressed",
                "Set boundaries to protect your energy",
                "Connect with friends or family regularly",
                "Consider trying meditation or yoga"
            ],
            4: [
                "Use the breathing exercises available on this site",
                "Reach out to campus counseling services",
                "Practice self-compassion and avoid self-criticism",
                "Consider talking to a trusted friend or mentor"
            ],
            5: [
                "Please contact emergency services if you're in immediate danger",
                "Call 988 or text HOME to 741741 for crisis support",
                "Reach out to campus mental health resources",
                "Consider speaking with a mental health professional"
            ]
        };
        
        return recommendations[moodLevel] || recommendations[3];
    }

    saveResults() {
        const results = {
            date: new Date().toISOString(),
            score: this.score,
            average: this.average,
            answers: this.answers
        };
        
        // Save to localStorage
        const previousResults = JSON.parse(localStorage.getItem('moodQuizResults') || '[]');
        previousResults.push(results);
        localStorage.setItem('moodQuizResults', JSON.stringify(previousResults));
    }

    resetQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        document.getElementById('results-screen').style.display = 'none';
        document.getElementById('welcome-screen').style.display = 'block';
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MoodQuiz();
});