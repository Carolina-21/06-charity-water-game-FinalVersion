/* =====================================
   CHARITY: WATER - WATER RUN GAME
   Main Game JavaScript Engine

   Features:
   - Difficulty Levels
   - Lives System
   - Timer
   - Falling Water Drops
   - Pollution Hazards
   - Score Tracking
   - High Score Storage
   - Educational Facts
   - Pause System
   - Victory Celebration
===================================== */


/* =========================
   GAME SETTINGS
========================= */

const difficulties = {
    easy: {
        dropSpeed: 2,
        pollutionRate: 0.15,
        startingLives: 5,
        time: 90
    },

    normal: {
        dropSpeed: 4,
        pollutionRate: 0.25,
        startingLives: 3,
        time: 60
    },

    hard: {
        dropSpeed: 6,
        pollutionRate: 0.40,
        startingLives: 2,
        time: 45
    }
};


// Current difficulty
let difficulty = "normal";


// Game variables
let score = 0;
let lives = 3;
let timeLeft = 60;
let gameRunning = false;
let paused = false;

let gameInterval;
let timerInterval;



/* =========================
   DOM ELEMENTS
========================= */

const gameArea = document.getElementById("gameArea");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const timerDisplay = document.getElementById("timer");

const startButton = document.getElementById("startGame");
const pauseButton = document.getElementById("pauseGame");

const difficultySelect = document.getElementById(
    "difficulty"
);

const player = document.getElementById("player");



/* =========================
   EDUCATIONAL FACTS
========================= */

const waterFacts = [

    "💧 Over 700 million people worldwide lack access to clean water.",

    "🌍 Clean water improves health, education, and communities.",

    "🚰 Charity: water funds sustainable clean water projects.",

    "🌱 Safe water helps families spend less time collecting water.",

    "💙 Small actions can create global change."

];


const milestoneMessages = [

    "Amazing! You helped collect 10 water drops! 💧",

    "Great work! Your impact is growing! 🌎",

    "Community hero unlocked! ⭐",

    "You are making waves! 🌊"

];



/* =========================
   HIGH SCORE
========================= */

let highScore =
    localStorage.getItem("waterRunHighScore")
    || 0;



/* =========================
   START GAME
========================= */

function startGame(){

    resetGame();

    gameRunning = true;

    startButton.disabled = true;

    gameInterval = setInterval(
        createObject,
        800
    );


    timerInterval = setInterval(
        countdown,
        1000
    );


    showFact();

}



/* =========================
   RESET GAME
========================= */

function resetGame(){

    score = 0;

    lives =
    difficulties[difficulty].startingLives;


    timeLeft =
    difficulties[difficulty].time;


    updateDisplay();


    document
    .querySelectorAll(".falling-object")
    .forEach(object => object.remove());

}



/* =========================
   CREATE FALLING OBJECTS
========================= */


function createObject(){


    if(!gameRunning || paused)
        return;


    const object =
    document.createElement("div");


    let isPollution =
    Math.random()
    <
    difficulties[difficulty]
    .pollutionRate;



    if(isPollution){

        object.className =
        "falling-object pollution";

        object.innerHTML="☠️";

    }

    else{

        object.className =
        "falling-object water";

        object.innerHTML="💧";

    }



    object.style.left =
    Math.random()*90+"%";


    gameArea.appendChild(object);



    moveObject(object,isPollution);

}




/* =========================
   OBJECT MOVEMENT
========================= */


function moveObject(object,isPollution){


let position = 0;


let fall =
setInterval(()=>{


    if(paused)
        return;



    position +=
    difficulties[difficulty]
    .dropSpeed;



    object.style.top =
    position+"px";



    if(position > gameArea.clientHeight){

        object.remove();

        clearInterval(fall);

        return;

    }



    if(checkCollision(object,player)){


        object.remove();

        clearInterval(fall);



        if(isPollution){

            loseLife();

        }

        else{

            collectWater();

        }

    }


},20);

}



/* =========================
   COLLISION
========================= */


function checkCollision(a,b){


const aRect =
a.getBoundingClientRect();


const bRect =
b.getBoundingClientRect();


return !(
aRect.bottom < bRect.top ||
aRect.top > bRect.bottom ||
aRect.right < bRect.left ||
aRect.left > bRect.right
);

}



/* =========================
   COLLECT WATER
========================= */


function collectWater(){


score += 10;


increaseDifficulty();


checkMilestone();


updateDisplay();


playSound("water");

}



/* =========================
   LOSE LIFE
========================= */


function loseLife(){


lives--;


updateDisplay();


playSound("hit");



if(lives <=0){

    endGame(false);

}


}



/* =========================
   TIMER
========================= */


function countdown(){


if(!gameRunning)
return;



timeLeft--;


updateDisplay();



if(timeLeft <=0){

    endGame(true);

}


}



/* =========================
   DIFFICULTY SCALING
========================= */


function increaseDifficulty(){


if(score % 100 ===0){

console.log(
"Difficulty increased!"
);

}

}



/* =========================
   DISPLAY UPDATE
========================= */


function updateDisplay(){

scoreDisplay.textContent =
score;


livesDisplay.textContent =
"❤️".repeat(lives);


timerDisplay.textContent =
timeLeft;

}



/* =========================
   FACT ROTATION
========================= */


function showFact(){


let fact =
waterFacts[
Math.floor(
Math.random()*waterFacts.length
)
];


console.log(fact);


}



/* =========================
   MILESTONES
========================= */


function checkMilestone(){


let index =
score/100-1;


if(
Number.isInteger(index)
&&
milestoneMessages[index]
){

alert(
milestoneMessages[index]
);

}

}




/* =========================
   PAUSE SYSTEM
========================= */


pauseButton.addEventListener(
"click",
()=>{


paused=!paused;


pauseButton.textContent =
paused
?
"Resume"
:
"Pause";


});





/* =========================
   END GAME
========================= */


function endGame(win){


gameRunning=false;


clearInterval(gameInterval);

clearInterval(timerInterval);


if(score > highScore){

highScore = score;

localStorage.setItem(
"waterRunHighScore",
highScore
);

}



if(win){

victoryAnimation();

alert(
"🎉 Water mission complete!"
+
"\nScore: "
+
score
);

}

else{

alert(
"Game Over 💙"
+
"\nTry again!"
);

}



startButton.disabled=false;


}



/* =========================
   VICTORY CONFETTI
========================= */


function victoryAnimation(){

for(let i=0;i<50;i++){

let confetti =
document.createElement("div");


confetti.className =
"confetti";


confetti.style.left =
Math.random()*100+"%";


gameArea.appendChild(confetti);


setTimeout(()=>{
confetti.remove();
},3000);

}

}




/* =========================
   SOUND SYSTEM
========================= */


function playSound(type){


/*
Future upgrade:

Add:
new Audio("water.wav").play();

*/


console.log(
"Sound:",
type
);

}



/* =========================
   PLAYER CONTROLS
========================= */


document.addEventListener(
"keydown",
(event)=>{


if(!gameRunning)
return;



if(event.key==="ArrowLeft"){

player.style.left =
Math.max(
0,
player.offsetLeft-25
)
+"px";

}



if(event.key==="ArrowRight"){

player.style.left =
player.offsetLeft+25
+"px";

}



});




/* =========================
   DIFFICULTY CHANGE
========================= */


difficultySelect.addEventListener(
"change",
(e)=>{

difficulty =
e.target.value;

});
