/* ==========================================
   CHARITY: WATER - WATER RUN GAME

   Features:
   ✅ Easy / Normal / Hard Modes
   ✅ Lives System
   ✅ Countdown Timer
   ✅ Falling Water Drops
   ✅ Pollution Hazards
   ✅ DOM Manipulation
   ✅ High Score Storage
   ✅ Educational Facts
   ✅ Milestone Messages
   ✅ Pause / Resume
   ✅ Sound Effects Ready
   ✅ Victory Celebration
========================================== */



/* ==========================
   GAME SETTINGS
========================== */


const difficultySettings = {


    easy: {

        time: 90,

        lives: 5,

        dropSpeed: 2,

        pollutionChance: .15

    },


    normal: {

        time: 60,

        lives: 3,

        dropSpeed: 4,

        pollutionChance: .30

    },


    hard: {

        time: 40,

        lives: 2,

        dropSpeed: 6,

        pollutionChance: .50

    }


};





/* ==========================
   GAME VARIABLES
========================== */


let difficulty = "normal";


let score = 0;

let lives = 3;

let timeLeft = 60;


let gameActive = false;

let paused = false;



let gameLoop;

let timerLoop;




/* ==========================
   DOM ELEMENTS
========================== */


const startScreen =
document.getElementById("startScreen");


const gameContainer =
document.getElementById("gameContainer");


const startButton =
document.getElementById("startGame");


const resetButton =
document.getElementById("resetGame");


const restartButton =
document.getElementById("restartGame");


const pauseButton =
document.getElementById("pauseGame");


const difficultyMenu =
document.getElementById("difficulty");


const gameArea =
document.getElementById("gameArea");


const player =
document.getElementById("player");



const scoreDisplay =
document.getElementById("score");


const livesDisplay =
document.getElementById("lives");


const timerDisplay =
document.getElementById("timer");


const highScoreDisplay =
document.getElementById("highScore");


const factBox =
document.getElementById("factBox");


const messageBox =
document.getElementById("messageBox");


const messageText =
document.getElementById("messageText");





/* ==========================
   GAME DATA
========================== */


const facts = [

"💧 Over 700 million people lack access to clean water.",

"🌎 Clean water improves health and education.",

"🚰 charity: water funds sustainable water projects.",

"🌱 Safe water allows communities to grow.",

"💙 Every person can help make a difference."

];





const milestones = [

{

score:50,

message:
"💧 Great start! Every drop matters!"

},


{

score:100,

message:
"🌎 Amazing! You are helping communities!"

},


{

score:150,

message:
"⭐ Water Champion status unlocked!"

},


{

score:200,

message:
"🎉 Mission Complete! Clean water hero!"

}


];





/* ==========================
   HIGH SCORE
========================== */


let highScore =
localStorage.getItem(
"waterRunHighScore"
)
||0;



highScoreDisplay.textContent =
highScore;






/* ==========================
   START GAME
========================== */


startButton.addEventListener(
"click",
startGame
);



function startGame(){



difficulty =
difficultyMenu.value;



const settings =
difficultySettings[difficulty];



score=0;

lives=settings.lives;

timeLeft=settings.time;



gameActive=true;

paused=false;



startScreen.classList.add(
"hidden"
);



gameContainer.classList.remove(
"hidden"
);



updateDisplay();



showFact();



gameLoop =
setInterval(
createObject,
800
);



timerLoop =
setInterval(
countdown,
1000
);



}






/* ==========================
   CREATE OBJECTS
========================== */


function createObject(){


if(!gameActive || paused)
return;



const object =
document.createElement("div");



let pollution =
Math.random()
<
difficultySettings[difficulty]
.pollutionChance;




if(pollution){


object.className =
"falling-object pollution";


object.innerHTML =
"☠️";


}

else{


object.className =
"falling-object water";


object.innerHTML =
"💧";


}



object.style.left =
Math.random()*90+"%";



gameArea.appendChild(object);



moveObject(object,pollution);


}





/* ==========================
   MOVE OBJECT
========================== */


function moveObject(object,pollution){


let position = 0;



let movement =
setInterval(()=>{


if(paused)
return;



position +=
difficultySettings[difficulty]
.dropSpeed;



object.style.top =
position+"px";




if(checkCollision(
object,
player
)){


object.remove();


clearInterval(movement);



if(pollution){

loseLife();

}

else{

collectWater();

}


}




if(position >
gameArea.clientHeight){


object.remove();

clearInterval(movement);


}



},20);



}






/* ==========================
   COLLISION
========================== */


function checkCollision(a,b){


const first =
a.getBoundingClientRect();


const second =
b.getBoundingClientRect();



return !(
first.bottom < second.top ||
first.top > second.bottom ||
first.right < second.left ||
first.left > second.right
);


}







/* ==========================
   SCORE SYSTEM
========================== */


function collectWater(){


score +=10;


checkMilestones();


increaseDifficulty();


playSound("collect");


updateDisplay();


}






function loseLife(){


lives--;


playSound("hit");


updateDisplay();



if(lives<=0){

endGame(false);

}


}






/* ==========================
   TIMER
========================== */


function countdown(){


if(!gameActive)
return;



if(paused)
return;



timeLeft--;


updateDisplay();



if(timeLeft<=0){


endGame(true);


}


}






/* ==========================
   DISPLAY
========================== */


function updateDisplay(){


scoreDisplay.textContent =
score;


livesDisplay.textContent =
"❤️".repeat(lives);



timerDisplay.textContent =
timeLeft;


}








/* ==========================
   MILESTONES
========================== */


function checkMilestones(){


milestones.forEach(item=>{


if(score===item.score){


showMessage(
item.message
);


}


});


}






/* ==========================
   EDUCATIONAL FACTS
========================== */


function showFact(){


const random =
Math.floor(
Math.random()*facts.length
);



factBox.textContent =
facts[random];

}


setInterval(()=>{


if(gameActive && !paused){

showFact();

}


},7000);








/* ==========================
   DIFFICULTY SCALING
========================== */


function increaseDifficulty(){


if(score % 100 ===0){


factBox.textContent =
"🔥 Challenge increasing! Keep going!";


}


}







/* ==========================
   MESSAGE DISPLAY
========================== */


function showMessage(message){


messageText.textContent =
message;


messageBox.classList.remove(
"hidden"
);


setTimeout(()=>{


messageBox.classList.add(
"hidden"
);


},2500);


}







/* ==========================
   END GAME
========================== */


function endGame(win){



gameActive=false;



clearInterval(gameLoop);

clearInterval(timerLoop);



if(score>highScore){


highScore=score;


localStorage.setItem(
"waterRunHighScore",
highScore
);



highScoreDisplay.textContent =
highScore;


}




if(win){


showMessage(
"🎉 Time Complete! Great work!"
);


playSound(
"victory"
);


confetti();


}


else{


showMessage(
"💙 Game Over! Try again!"
);


}



}






/* ==========================
   RESET GAME
========================== */


resetButton.addEventListener(
"click",
()=>{


location.reload();


});




restartButton.addEventListener(
"click",
()=>{


location.reload();


});






/* ==========================
   PAUSE
========================== */


pauseButton.addEventListener(
"click",
()=>{


paused=!paused;



pauseButton.textContent =
paused
?
"▶ Resume"
:
"⏸ Pause";



});







/* ==========================
   PLAYER CONTROLS
========================== */


document.addEventListener(
"keydown",
event=>{


if(!gameActive)
return;



if(event.key==="ArrowLeft"){


player.style.left =
Math.max(
0,
player.offsetLeft-30
)
+"px";


}



if(event.key==="ArrowRight"){


player.style.left =
player.offsetLeft+30
+"px";


}



});








/* ==========================
   MOBILE TOUCH CONTROLS
========================== */


gameArea.addEventListener(
"touchmove",
event=>{


let touch =
event.touches[0];


let area =
gameArea.getBoundingClientRect();



player.style.left =
(
touch.clientX-area.left
)
+"px";


});








/* ==========================
   SOUND SYSTEM
========================== */


const sounds={


collect:
new Audio(
"assets/sounds/collect.mp3"
),


hit:
new Audio(
"assets/sounds/hit.mp3"
),


victory:
new Audio(
"assets/sounds/victory.mp3"
)


};





function playSound(type){


/*
Add mp3 files to:
assets/sounds/

The game will automatically
play sounds when actions happen.
*/


if(sounds[type]){


sounds[type].play()
.catch(()=>{});


}


}







/* ==========================
   CONFETTI
========================== */


function confetti(){


for(let i=0;i<60;i++){


const piece =
document.createElement("div");



piece.className =
"confetti";



piece.style.left =
Math.random()*100+"%";



gameArea.appendChild(piece);



setTimeout(()=>{

piece.remove();

},3000);



}


} 