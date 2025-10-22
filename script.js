const levels = {
    1: {
        cardsArray: [
            { name: 'card1', img: 'images/card1.png' },
            { name: 'card2', img: 'images/card2.png' },
            { name: 'card3', img: 'images/card3.webp' },
            { name: 'card4', img: 'images/card4.webp' },
            { name: 'card5', img: 'images/card5.webp' },
            { name: 'card6', img: 'images/card6.webp' },
            { name: 'card7', img: 'images/card7.png' },
            { name: 'card8', img: 'images/card8.png' },
            { name: 'card9', img: 'images/card9.png' },
            { name: 'card10', img: 'images/card10.webp' },
            { name: 'card11', img: 'images/card11.png' },
            { name: 'card12', img: 'images/card12.png' },
            { name: 'card13', img: 'images/card13.webp' },
            { name: 'card14', img: 'images/card14.webp' },
            { name: 'card15', img: 'images/card15.png' }
        ],
        timeLimit: 120,
        bgMusic: 'music.mp3',
        clickSound: 'sounds/click.mp3',
        winSound: 'sounds/win.mp3',
        loseSound: 'sounds/lose.mp3',
        popupText: '🌊 Level 1: Ocean Memory Adventure 🐠<br>Find pairs of identical cards featuring sea creatures by turning them over one at a time. Remember their locations to collect all the pairs before time runs out. Get immersed in the game and good luck! ✨',
        stickers: ['🐠', '🐳', '🦞', '🌊']
    },
    2: {
        cardsArray: [
            { name: 'curd1', img: 'images2/curd1.png' },
            { name: 'curd2', img: 'images2/curd2.png' },
            { name: 'curd3', img: 'images2/curd3.png' },
            { name: 'curd4', img: 'images2/curd4.png' },
            { name: 'curd5', img: 'images2/curd5.png' },
            { name: 'curd6', img: 'images2/curd6.png' },
            { name: 'curd7', img: 'images2/curd7.png' },
            { name: 'curd8', img: 'images2/curd8.png' },
            { name: 'curd9', img: 'images2/curd9.png' },
            { name: 'curd10', img: 'images2/curd10.png' },
            { name: 'curd11', img: 'images2/curd11.png' },
            { name: 'curd12', img: 'images2/curd12.png' },
            { name: 'curd13', img: 'images2/curd13.png' },
            { name: 'curd14', img: 'images2/curd14.png' },
            { name: 'curd15', img: 'images2/curd15.png' },
            { name: 'curd16', img: 'images2/curd16.png' },
            { name: 'curd17', img: 'images2/curd17.png' },
            { name: 'curd18', img: 'images2/curd18.png' }
        ],
        timeLimit: 120,
        bgMusic: 'space.mp3',
        clickSound: 'sounds/click.mp3',
        winSound: 'sounds/win-2.mp3',
        loseSound: 'sounds/game-over.mp3',
        popupText: '🚀 Level 2: UFO Memory Mission 👽<br>Your goal is to find all the pairs of identical UFO cards by turning them over one at a time. Click on the cards to see their images and remember their positions. If you find two identical cards, they remain face up. Collect all the pairs before time runs out! Good luck on your space adventure! 🌌',
        stickers: ['👽', '🛸', '🌌', '🌠']
    }
};

let currentLevel = 1;
let firstCard = null, secondCard = null, lockBoard = false, timerStarted = false;
let timeLeft, matchedPairs = 0, totalPairs, timerInterval;

function initLevel(level) {
    console.log(`Работает ${level}`);
    const levelData = levels[level];
    if (!levelData) {
        console.error(`${level} НЕ РАБОТАЕТ!`);
        return;
    }

    currentLevel = level;
    timeLeft = levelData.timeLimit;
    totalPairs = levelData.cardsArray.length;
    matchedPairs = 0;
    timerStarted = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    if (timerInterval) clearInterval(timerInterval);

    const gameOverEl = document.getElementById('game-over');
    const winnerEl = document.getElementById('winner');
    gameOverEl.classList.add('hidden');
    winnerEl.classList.add('hidden');
    gameOverEl.style.background = '';
    winnerEl.style.background = '';

    // Обнуляем таймер и обновляем его отображение
    const timerEl = document.getElementById('timer');
    timerEl.textContent = `Time: ${Math.floor(levelData.timeLimit / 60)}:${(levelData.timeLimit % 60).toString().padStart(2, '0')}`;
    timerEl.classList.add('hidden');

    document.body.className = `level-${level}`;
    document.getElementById('level-indicator').textContent = `Level: ${level}`;

    document.querySelector('.popup-content h2').innerHTML = levelData.popupText;
    document.querySelector('.popup-instruction').style.display = 'flex';

    const stickers = document.querySelectorAll('.sticker');
    stickers.forEach((sticker, i) => sticker.textContent = levelData.stickers[i]);

    const bgMusic = document.getElementById('bg-music');
    const clickSound = document.getElementById('click-sound');
    const winSound = document.getElementById('win-sound');
    const loseSound = document.getElementById('lose-sound');
    bgMusic.src = levelData.bgMusic;
    clickSound.src = levelData.clickSound;
    winSound.src = levelData.winSound;
    loseSound.src = levelData.loseSound;
    bgMusic.play().catch(e => console.error('Ошибка в bgmusic', e));

    const gameBoard = document.querySelector('.game-board');
    gameBoard.classList.add('hidden');
    setTimeout(() => {
        gameBoard.innerHTML = '';
        const shuffledCards = [...levelData.cardsArray, ...levelData.cardsArray].sort(() => 0.5 - Math.random());
        shuffledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.name = card.name;
            cardElement.innerHTML = `<img src="${card.img}" alt="${card.name}">`;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
        gameBoard.classList.remove('hidden');
    }, 300);

    levelData.cardsArray.forEach(card => {
        const img = new Image();
        img.src = card.img;
        img.onerror = () => console.error(`Ошибка при: ${card.img}`);
    });
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    if (!timerStarted) {
        timerStarted = true;
        startTimer();
    }

    document.getElementById('click-sound').play().catch(e => console.error('Звук клика не работает!', e));
    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        if (matchedPairs === totalPairs) {
            clearInterval(timerInterval);
            showWinner();
        }
        resetBoard();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function startTimer() {
    const timerEl = document.getElementById('timer');
    timerEl.classList.remove('hidden');
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showGameOver();
        }
    }, 1000);
}

function showGameOver() {
    const gameOverEl = document.getElementById('game-over');
    gameOverEl.style.background = '';
    gameOverEl.classList.remove('hidden');
    gameOverEl.innerHTML = `
        <img src="game_over.webp" alt="Game Over" class="shaking">
        <button class="refresh-button" onclick="initLevel(${currentLevel})">Retry</button>
    `;
    document.getElementById('lose-sound').play().catch(e => console.error('Звук проигрыша не работает!', e));
}

function showWinner() {
    console.log(`Показывать окно победыl ${currentLevel}`);
    const winnerEl = document.getElementById('winner');
    winnerEl.style.background = '';
    winnerEl.classList.remove('hidden');
    const nextButton = currentLevel < Object.keys(levels).length
        ? `<button class="next-button" onclick="goToNextLevel()">Next Level</button>`
        : '';
    winnerEl.innerHTML = `
        <img src="winner.webp" alt="Winner" class="shaking">
        <button class="refresh-button" onclick="initLevel(${currentLevel})">Replay</button>
        ${nextButton}
    `;
    document.getElementById('win-sound').play().catch(e => console.error('Звук выигрыша не работает', e));
}

function goToNextLevel() {
    console.log(`Следующий левел ${currentLevel + 1}`);
    initLevel(currentLevel + 1);
}

function startMusicOnce() {
    document.getElementById('bg-music').play().catch(e => console.error('Автопроигрывание песни не работает', e));
    document.removeEventListener('click', startMusicOnce);
}

document.addEventListener('DOMContentLoaded', () => {
    initLevel(1);
    const popup = document.querySelector('.popup-instruction');
    document.getElementById('start-game').addEventListener('click', () => {
        popup.style.display = 'none';
        document.getElementById('timer').classList.remove('hidden');
    });
    document.addEventListener('click', startMusicOnce);
});