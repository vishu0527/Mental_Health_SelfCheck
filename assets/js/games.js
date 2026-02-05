// Stress Relief Games

// Memory Match Game
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flipped = [];
        this.matched = 0;
        this.moves = 0;
        this.score = 0;
        this.symbols = ['🌟', '🎨', '🎭', '🎪', '🎬', '🎸', '🎯', '🎲'];
        this.init();
    }

    init() {
        this.createBoard();
    }

    createBoard() {
        const deck = [...this.symbols, ...this.symbols].sort(() => Math.random() - 0.5);
        const board = document.getElementById('memory-board');
        board.innerHTML = '';
        
        this.cards = deck.map((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.symbol = symbol;
            card.innerHTML = '<span class="card-inner">?</span>';
            card.addEventListener('click', () => this.flipCard(index));
            board.appendChild(card);
            return { symbol, flipped: false, matched: false };
        });
    }

    flipCard(index) {
        if (this.flipped.length >= 2 || this.cards[index].flipped || this.cards[index].matched) {
            return;
        }

        this.cards[index].flipped = true;
        this.flipped.push(index);
        const card = document.querySelector(`.memory-card[data-index="${index}"]`);
        card.classList.add('flipped');
        card.querySelector('.card-inner').textContent = this.cards[index].symbol;

        if (this.flipped.length === 2) {
            this.moves++;
            this.updateMemoryDisplay();
            setTimeout(() => this.checkMatch(), 600);
        }
    }

    checkMatch() {
        const [first, second] = this.flipped;
        const isMatch = this.cards[first].symbol === this.cards[second].symbol;

        if (isMatch) {
            this.cards[first].matched = true;
            this.cards[second].matched = true;
            this.matched++;
            this.score += 10;
            
            if (this.matched === this.symbols.length) {
                setTimeout(() => {
                    alert(`🎉 You won! Score: ${this.score}, Moves: ${this.moves}`);
                    resetMemoryGame();
                }, 500);
            }
        } else {
            const card1 = document.querySelector(`.memory-card[data-index="${first}"]`);
            const card2 = document.querySelector(`.memory-card[data-index="${second}"]`);
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.querySelector('.card-inner').textContent = '?';
            card2.querySelector('.card-inner').textContent = '?';
            this.cards[first].flipped = false;
            this.cards[second].flipped = false;
        }

        this.flipped = [];
        this.updateMemoryDisplay();
    }

    updateMemoryDisplay() {
        document.getElementById('memory-score').textContent = this.score;
        document.getElementById('memory-moves').textContent = this.moves;
    }
}

let memoryGame = null;

function startMemoryGame() {
    document.getElementById('memory-game-modal').style.display = 'flex';
    if (!memoryGame) {
        memoryGame = new MemoryGame();
    }
}

function resetMemoryGame() {
    memoryGame = new MemoryGame();
}

function closeGame(type) {
    document.getElementById(`${type}-game-modal`).style.display = 'none';
}

// Color Match Game
class ColorGame {
    constructor() {
        this.score = 0;
        this.timeLeft = 30;
        this.gameActive = false;
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
        this.init();
    }

    init() {
        this.startGame();
    }

    startGame() {
        this.gameActive = true;
        this.score = 0;
        this.timeLeft = 30;
        this.updateDisplay();
        this.generateRound();
        this.startTimer();
    }

    generateRound() {
        const targetColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        const display = document.getElementById('color-display');
        display.style.backgroundColor = targetColor;
        display.dataset.target = targetColor;

        const buttonContainer = document.getElementById('color-buttons');
        buttonContainer.innerHTML = '';
        const shuffled = [...this.colors].sort(() => Math.random() - 0.5);

        shuffled.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.style.backgroundColor = color;
            btn.addEventListener('click', () => this.checkColor(color, targetColor));
            buttonContainer.appendChild(btn);
        });
    }

    checkColor(selected, target) {
        if (!this.gameActive) return;

        if (selected === target) {
            this.score++;
            this.updateDisplay();
            this.generateRound();
        }
    }

    startTimer() {
        const timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('color-time').textContent = this.timeLeft;

            if (this.timeLeft <= 0) {
                clearInterval(timer);
                this.gameActive = false;
                alert(`Game Over! Score: ${this.score}`);
                resetColorGame();
            }
        }, 1000);
    }

    updateDisplay() {
        document.getElementById('color-score').textContent = this.score;
    }
}

let colorGame = null;

function startColorGame() {
    document.getElementById('color-game-modal').style.display = 'flex';
    if (!colorGame) {
        colorGame = new ColorGame();
    }
}

function resetColorGame() {
    colorGame = new ColorGame();
}

// Breathing Balloon Game
class BalloonGame {
    constructor() {
        this.fillLevel = 0;
        this.inflating = false;
        this.init();
    }

    init() {
        const balloon = document.getElementById('balloon');
        const gameArea = document.getElementById('balloon-game-area');
        
        gameArea.addEventListener('click', () => this.inflate());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.inflate();
            }
        });
    }

    inflate() {
        if (this.fillLevel < 100) {
            this.fillLevel += 10;
            this.updateBalloon();

            if (this.fillLevel >= 100) {
                this.win();
            }
        }
    }

    updateBalloon() {
        const balloon = document.getElementById('balloon');
        const percentage = document.getElementById('balloon-percentage');
        const fill = document.getElementById('balloon-fill');

        const size = 80 + (this.fillLevel * 1.2);
        const opacity = 0.3 + (this.fillLevel / 100 * 0.7);

        balloon.style.width = size + 'px';
        balloon.style.height = size + 'px';
        balloon.style.opacity = opacity;
        percentage.textContent = this.fillLevel + '%';
        fill.textContent = this.fillLevel;
    }

    win() {
        alert('🎈 Congratulations! You filled the balloon!');
        resetBalloonGame();
    }
}

let balloonGame = null;

function startBalloonGame() {
    document.getElementById('balloon-game-modal').style.display = 'flex';
    balloonGame = new BalloonGame();
}

function resetBalloonGame() {
    balloonGame = new BalloonGame();
}

// Puzzle Game
class PuzzleGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.sequence = [];
        this.playerSequence = [];
        this.gameActive = true;
        this.init();
    }

    init() {
        this.createBoard();
        this.startLevel();
    }

    createBoard() {
        const board = document.getElementById('puzzle-board');
        board.innerHTML = '';
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

        colors.forEach((color, index) => {
            const btn = document.createElement('div');
            btn.className = 'puzzle-btn';
            btn.style.backgroundColor = color;
            btn.dataset.index = index;
            btn.addEventListener('click', () => this.onPuzzleClick(index, btn));
            board.appendChild(btn);
        });
    }

    startLevel() {
        this.playerSequence = [];
        const nextColor = Math.floor(Math.random() * 4);
        this.sequence.push(nextColor);
        this.playSequence();
    }

    playSequence() {
        this.gameActive = false;
        let delay = 500;

        this.sequence.forEach((index, pos) => {
            setTimeout(() => {
                this.highlightButton(index);
            }, delay + pos * 600);
        });

        setTimeout(() => {
            this.gameActive = true;
        }, delay + this.sequence.length * 600);
    }

    highlightButton(index) {
        const btn = document.querySelector(`.puzzle-btn[data-index="${index}"]`);
        btn.style.opacity = '0.5';
        setTimeout(() => {
            btn.style.opacity = '1';
        }, 300);
    }

    onPuzzleClick(index, btn) {
        if (!this.gameActive) return;

        this.playerSequence.push(index);
        this.highlightButton(index);

        if (this.playerSequence[this.playerSequence.length - 1] !== this.sequence[this.playerSequence.length - 1]) {
            alert(`Game Over! Level: ${this.level}, Score: ${this.score}`);
            resetPuzzleGame();
            return;
        }

        if (this.playerSequence.length === this.sequence.length) {
            this.score += this.level * 10;
            this.level++;
            document.getElementById('puzzle-score').textContent = this.score;
            document.getElementById('puzzle-level').textContent = this.level;
            setTimeout(() => this.startLevel(), 1000);
        }
    }
}

let puzzleGame = null;

function startPuzzleGame() {
    document.getElementById('puzzle-game-modal').style.display = 'flex';
    puzzleGame = new PuzzleGame();
}

function resetPuzzleGame() {
    puzzleGame = new PuzzleGame();
}

// Close modals on background click
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.game-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});
