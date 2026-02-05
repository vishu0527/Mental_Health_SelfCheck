class BreathingExercise {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentCycle = 0;
        this.totalCycles = 0;
        this.sessionStartTime = null;
        this.totalSessionTime = 0; // in seconds
        this.timeLeft = 300; // 5 minutes default
        this.currentPhase = 'ready';
        this.selectedType = '4-7-8';
        this.soundEnabled = true;
        
        this.exerciseTypes = {
            '4-7-8': {
                inhale: 4,
                hold: 7,
                exhale: 8,
                name: '4-7-8 Exercise'
            },
            'box': {
                inhale: 4,
                hold: 4,
                exhale: 4,
                holdEmpty: 4,
                name: 'Box Breathing'
            },
            'relax': {
                inhale: 4,
                hold: 4,
                exhale: 6,
                name: 'Deep Breathing'
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudioContext();
        this.updateTimerDisplay();
        this.updateInstructions();
        this.setupSessionInfo();
    }

    setupEventListeners() {
        // Exercise type buttons
        document.querySelectorAll('.exercise-type button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.exercise-type button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedType = e.target.dataset.type;
                this.updateInstructions();
                if (!this.isRunning) {
                    this.reset();
                }
            });
        });

        // Timer controls
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('pause-btn').addEventListener('click', () => this.pause());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        
        // Sound toggle
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                this.soundEnabled = e.target.checked;
            });
        }
    }

    setupAudioContext() {
        // Initialize Web Audio API for sound generation
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.audioContext = null;
        }
    }

    playSound(frequency = 440, duration = 200) {
        if (!this.soundEnabled || !this.audioContext) return;

        try {
            const ctx = this.audioContext;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            // Fade in and out for smooth sound
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration / 1000);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration / 1000);
        } catch (e) {
            console.warn('Could not play sound:', e);
        }
    }

    playInhaleSound() {
        this.playSound(523, 150); // C5 note, 150ms
    }

    playExhaleSound() {
        this.playSound(392, 200); // G4 note, 200ms
    }

    playCompleteSound() {
        this.playSound(659, 100); // E5 note
        setTimeout(() => this.playSound(784, 100), 120); // G5 note
    }

    start() {
        if (this.isPaused) {
            this.isPaused = false;
            this.resume();
            return;
        }

        if (!this.isRunning) {
            this.sessionStartTime = Date.now();
            this.isRunning = true;
            this.updateButtonStates();
            this.playInhaleSound();
            this.startCycle();
        }
    }

    pause() {
        this.isPaused = true;
        this.isRunning = false;
        this.updateButtonStates();
        clearTimeout(this.timer);
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentCycle = 0;
        this.timeLeft = this.getDefaultDuration();
        this.currentPhase = 'ready';
        this.sessionStartTime = null;
        this.totalSessionTime = 0;
        
        this.clearBreathingAnimation();
        this.updateTimerDisplay();
        this.updateButtonStates();
        this.updateBreathingCircle();
        this.updateSessionInfo();
    }

    resume() {
        this.isRunning = true;
        this.updateButtonStates();
        this.startCycle();
    }

    getDefaultDuration() {
        return 300; // 5 minutes
    }

    startCycle() {
        if (this.timeLeft <= 0) {
            this.complete();
            return;
        }

        const exercise = this.exerciseTypes[this.selectedType];
        
        switch (this.currentPhase) {
            case 'inhale':
                this.performPhase('inhale', exercise.inhale, () => {
                    this.currentPhase = 'hold';
                    this.startCycle();
                });
                break;
            case 'hold':
                const holdDuration = exercise.hold || 0;
                this.performPhase('hold', holdDuration, () => {
                    if (exercise.holdEmpty) {
                        this.currentPhase = 'holdEmpty';
                        this.startCycle();
                    } else {
                        this.currentPhase = 'exhale';
                        this.startCycle();
                    }
                });
                break;
            case 'holdEmpty':
                this.performPhase('ready', exercise.holdEmpty, () => {
                    this.currentPhase = 'inhale';
                    this.startCycle();
                });
                break;
            case 'exhale':
                this.performPhase('exhale', exercise.exhale, () => {
                    this.currentPhase = 'inhale';
                    this.currentCycle++;
                    this.updateSessionInfo();
                    this.startCycle();
                });
                break;
            default:
                this.currentPhase = 'inhale';
                this.startCycle();
        }
    }

    performPhase(phase, duration, callback) {
        this.updateBreathingCircle(phase);
        const phaseText = this.getPhaseText(phase);
        document.getElementById('breathing-text').textContent = phaseText;
        
        // Play sound for inhale and exhale
        if (phase === 'inhale') {
            this.playInhaleSound();
        } else if (phase === 'exhale') {
            this.playExhaleSound();
        }
        
        const phaseDuration = duration * 1000; // Convert to milliseconds
        
        if (phase === 'exhale' || phase === 'inhale') {
            this.animatePhase(phase, phaseDuration, callback);
        } else {
            this.timer = setTimeout(callback, phaseDuration);
        }
        
        // Update time left
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.totalSessionTime++;
            this.updateTimerDisplay();
            this.updateSessionInfo();
        }
    }

    animatePhase(phase, duration, callback) {
        const startTime = Date.now();
        const circle = document.getElementById('breathing-circle');
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                this.animateBreathingCircle(phase, progress);
                requestAnimationFrame(animate);
            } else {
                this.clearBreathingAnimation();
                callback();
            }
        };
        
        animate();
    }

    animateBreathingCircle(phase, progress) {
        const circle = document.getElementById('breathing-circle');
        let scale = 1;
        
        if (phase === 'inhale') {
            scale = 1 + (0.3 * progress);
        } else if (phase === 'exhale') {
            scale = 1.3 - (0.5 * progress);
        }
        
        circle.style.transform = `scale(${scale})`;
    }

    clearBreathingAnimation() {
        const circle = document.getElementById('breathing-circle');
        circle.style.transform = 'scale(1)';
        circle.className = 'breathing-circle';
    }

    updateBreathingCircle(phase = 'ready') {
        const circle = document.getElementById('breathing-circle');
        circle.className = `breathing-circle ${phase}`;
    }

    getPhaseText(phase) {
        const texts = {
            'inhale': 'Breathe In',
            'hold': 'Hold',
            'holdEmpty': 'Rest',
            'exhale': 'Breathe Out',
            'ready': 'Ready'
        };
        return texts[phase] || 'Ready';
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('time-display').textContent = display;
    }

    updateSessionInfo() {
        const sessionTimeElement = document.getElementById('session-time');
        const sessionCyclesElement = document.getElementById('session-cycles');
        
        if (sessionTimeElement) {
            const minutes = Math.floor(this.totalSessionTime / 60);
            const seconds = this.totalSessionTime % 60;
            sessionTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (sessionCyclesElement) {
            sessionCyclesElement.textContent = this.currentCycle;
        }
    }

    setupSessionInfo() {
        this.updateSessionInfo();
    }

    updateButtonStates() {
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');
        
        if (this.isRunning) {
            startBtn.textContent = 'Running...';
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
        } else if (this.isPaused) {
            startBtn.textContent = 'Resume';
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
        } else {
            startBtn.textContent = 'Start';
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
        }
    }

    updateInstructions() {
        const exercise = this.exerciseTypes[this.selectedType];
        let instructions = `<p><strong>${exercise.name}:</strong> `;
        
        if (this.selectedType === '4-7-8') {
            instructions += 'Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds';
        } else if (this.selectedType === 'box') {
            instructions += 'Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, rest for 4 seconds';
        } else if (this.selectedType === 'relax') {
            instructions += 'Inhale for 4 seconds, hold for 4 seconds, exhale for 6 seconds';
        }
        
        instructions += '</p><p>Follow the circle animation and breathing guide to help reduce stress and anxiety.</p>';
        
        document.getElementById('instruction-text').innerHTML = instructions;
    }

    complete() {
        this.isRunning = false;
        this.isPaused = false;
        this.updateButtonStates();
        this.updateBreathingCircle('ready');
        document.getElementById('breathing-text').textContent = 'Complete!';
        
        // Play completion sound
        this.playCompleteSound();
        
        // Save session to user progress
        if (window.userSession && window.userSession.currentUser) {
            const minutesSpent = Math.floor(this.totalSessionTime / 60);
            window.userSession.addBreathingSession(minutesSpent);
        }
        
        // Show completion message
        setTimeout(() => {
            alert(`Great job! You completed your ${this.selectedType === '4-7-8' ? '4-7-8' : this.selectedType} breathing exercise.\n\nTime spent: ${Math.floor(this.totalSessionTime / 60)}:${(this.totalSessionTime % 60).toString().padStart(2, '0')}\nCycles completed: ${this.currentCycle}`);
        }, 500);
    }
}

// Initialize breathing exercise when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BreathingExercise();
});