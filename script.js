// Log a message to the console to ensure the script is linked correctly
//console.log('JavaScript file is linked correctly.');


// ==========================================
// Water Run
// Charity: water Prototype
// Author: Andrea Y.
// ==========================================

// ---------- HTML Elements ----------
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

const scoreDisplay = document.getElementById("score");
const progressBar = document.getElementById("progress");
const message = document.getElementById("msg");

const startButton = document.getElementById("startBtn");
const resetButton = document.getElementById("resetBtn");

const startScreen = document.getElementById("startScreen");
const winScreen = document.getElementById("winScreen");

// ---------- Game Variables ----------
let score = 0;
let gameRunning = false;

// Player position
let playerX = 300;

// How often objects appear
const spawnRate = 900;

// Player movement speed
const moveAmount = 25;

// Points
const WATER_POINTS = 10;
const POLLUTION_POINTS = -15;
const WIN_SCORE = 200;

// ==========================================
// Start Game
// ==========================================

startButton.addEventListener("click", startGame);

function startGame() {

    startScreen.classList.add("hidden");

    gameRunning = true;

}

// ==========================================
// Reset Game
// ==========================================

resetButton.addEventListener("click", resetGame);

function resetGame() {

    location.reload();

}

// ==========================================
// Keyboard Controls
// ==========================================

document.addEventListener("keydown", movePlayer);

function movePlayer(event) {

    if (!gameRunning) return;

    if (event.key === "ArrowLeft") {

        playerX -= moveAmount;

    }

    if (event.key === "ArrowRight") {

        playerX += moveAmount;

    }

    // Prevent player from leaving screen

    if (playerX < 0) {

        playerX = 0;

    }

    if (playerX > gameArea.clientWidth - 40) {

        playerX = gameArea.clientWidth - 40;

    }

    player.style.left = playerX + "px";

}

// ==========================================
// Feedback Messages
// ==========================================

function showMessage(text, color) {

    message.textContent = text;

    message.style.color = color;

    setTimeout(() => {

        message.textContent = "";

    }, 700);

}

// ==========================================
// Update Score
// ==========================================

function updateScore(points) {

    score += points;

    if (score < 0) {

        score = 0;

    }

    scoreDisplay.textContent = score;

    progressBar.value = score;

    if (score >= WIN_SCORE) {

        winGame();

    }

}

// ==========================================
// Create Falling Object
// ==========================================

function spawnObject() {

    if (!gameRunning) return;

    const object = document.createElement("div");

    object.classList.add("drop");

    const isPollution = Math.random() < 0.25;

    if (isPollution) {

        object.classList.add("pollution");

        object.textContent = "☣️";

    }

    else {

        object.textContent = "💧";

    }

    object.style.left =
        Math.random() * (gameArea.clientWidth - 30) + "px";

    object.style.top = "0px";

    gameArea.appendChild(object);

    animateObject(object, isPollution);

}

// ==========================================
// Falling Animation
// ==========================================

function animateObject(object, isPollution) {

    let y = 0;

    const animation = setInterval(() => {

        if (!gameRunning) {

            clearInterval(animation);

            return;

        }

        y += 4;

        object.style.top = y + "px";

        checkCollision(object, isPollution, animation);

        if (y > 500) {

            object.remove();

            clearInterval(animation);

        }

    }, 20);

}

// ==========================================
// Collision Detection
// ==========================================

function checkCollision(object, isPollution, animation) {

    const objectX = parseFloat(object.style.left);

    if (Math.abs(objectX - playerX) < 35 &&
        parseFloat(object.style.top) > 440) {

        if (isPollution) {

            updateScore(POLLUTION_POINTS);

            showMessage("-15 Contaminated!", "red");

        }

        else {

            updateScore(WATER_POINTS);

            showMessage("+10 Water!", "#2E9DF7");

        }

        object.remove();

        clearInterval(animation);

    }

}

// ==========================================
// Win Screen
// ==========================================

function winGame() {

    gameRunning = false;

    winScreen.classList.remove("hidden");

    launchConfetti();

}

// ==========================================
// Confetti Effect
// ==========================================

function launchConfetti() {

    for (let i = 0; i < 120; i++) {

        const confetti = document.createElement("div");

        confetti.textContent = "🎉";

        confetti.style.position = "fixed";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-20px";
        confetti.style.fontSize = "22px";
        confetti.style.pointerEvents = "none";

        document.body.appendChild(confetti);

        let y = -20;

        const fall = setInterval(() => {

            y += 5;

            confetti.style.top = y + "px";

            if (y > window.innerHeight) {

                confetti.remove();

                clearInterval(fall);

            }

        }, 20);

    }

}

// ==========================================
// Game Loop
// ==========================================

// Spawn new objects every 0.9 seconds

setInterval(spawnObject, spawnRate);

console.log("Water Run Loaded Successfully!");