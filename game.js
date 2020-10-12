//------------------------VARIABLES------------------------
let canvas = document.getElementById("gameboard");
let ctx = canvas.getContext("2d");
let gameInterval;
/*let h1name = "Player 1";
let h1score = 20;
let h2name = "Player 2";
let h2score = 10;
let h3name = "Player 3";
let h3score = 0;*/
let highscore = [{ //Creates array with names and score
  name: "Player1",
  score: 20
}, {
  name: "Player2",
  score: 10
}, {
  name: "Player3",
  score: 0
}]
let nameInput = document.getElementById("name-input");
let playerName;
let score = 0;

const foodSize = 20;
let foodFromLeft = randomLeftNumber();
let foodFromTop = randomTopNumber();

const snakeSize = 20;
let snakeHeadFromLeft = 40;
let snakeHeadFromTop = canvas.height/2;

let snakePath = [{ //Creates the first location of the snake-tail
  headFromLeft: snakeHeadFromLeft - 20,
  headFromTop: snakeHeadFromTop
}];
let snakeTail = [{
  tailFromLeft: snakePath[0].headFromLeft,
  tailFromTop: snakePath[0].headFromTop
}]; //Creates the first snake-tail part (following the head)

let colliding = false;
let distance = 20;
let speed = 400; //400 start-speed
let rightInterval, downInterval, leftInterval, upInterval;
let rightCycle = false; //Detects wether the button has already been pressed
let downCycle = false;
let leftCycle = false;
let upCycle = false;


//------------------------GAME------------------------
gameInterval = setInterval(draw, 20);
setupEventListeners();


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Clears a where the snake has been
  drawFood();
  drawSnakeHead();
  for (var i = 0; i < snakeTail.length; i++) { //For every tail-part in snakeTail
    drawSnakeTail(i);
  }
  checkCollision();

  if (colliding) { //If snake's position is equal to the gameboard or tail
    console.log("game over");
    clearInterval(gameInterval); //Stop drawing
    if (score <= highscore[2].score) { //If score did not make it to top 3
      displayGameOver();
    } else { //If score made it to the scoreboard
      displayHighscore();
      document.addEventListener("keydown", function(e) { //If enter-key is pressed
        if (e.key == "Enter") {
          playerName = nameInput.value; //Captures users input
          setHighScore();
          displayScoreboard();
          highscoreToGameOver();
        }
      })
    }
  }

  if (snakeHeadFromLeft == foodFromLeft && snakeHeadFromTop == foodFromTop) { //If the snakes position is equal to the foods position
    newPlaceForFood();
    score += 10; //Add 10 points to score
    increaseSpeed(score);
    snakePath.push(new Path(snakeHeadFromLeft, snakeHeadFromTop)); //Add one item to Path-array
    if (rightCycle) { //This if/else-statement is to make sure that the head moves one step before adding the tail to its position (or else they collide)
      snakeHeadFromLeft += distance;
    } else if (downCycle) {
      snakeHeadFromTop += distance;
    } else if (leftCycle) {
      snakeHeadFromLeft -= distance;
    } else if (upCycle) {
      snakeHeadFromTop -= distance;
    }
    addTail(i);
    document.getElementById("score").innerHTML = score; //Display score
  };
}


//------------------------FUNCTIONS------------------------
function setupEventListeners() {
  document.addEventListener("keydown", keyDownHandler);
  document.getElementById("restart").addEventListener("click", reset); //If restart-button is clicked - reset game
  document.getElementById("no-restart").addEventListener("click", displayLearnings);
}

function drawFood() {
  ctx.beginPath();
  ctx.rect(foodFromLeft, foodFromTop, foodSize, foodSize); //Position from left, position from top, width and height
  ctx.fillStyle = "#9254CC";
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

function newPlaceForFood() {
  foodFromLeft = randomLeftNumber(); //Randomizes new spot from left
  foodFromTop = randomTopNumber(); //Randomizes new spot from top
}

function randomLeftNumber() {
  let random = Math.floor(Math.random() * 49); //49 20s fits in (canvas.width - foodSize (980px))
  let left = random * 20;
  return left;
}

function randomTopNumber() {
  let random = Math.floor(Math.random() * 24); //24 20s fits in (canvas.height - foodSize (480px))
  let right = random * 20;
  return right;
}

function drawSnakeHead() {
  ctx.beginPath();
  ctx.rect(snakeHeadFromLeft, snakeHeadFromTop, snakeSize, snakeSize); //Position from left, position from top, width and height
  ctx.fillStyle = "#11D147";
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

function Path(headFromLeft, headFromTop) { //Constructor function creating new path-parts
  this.headFromLeft = headFromLeft;
  this.headFromTop = headFromTop;
}

function drawSnakeTail(i) {
  ctx.beginPath();
  ctx.rect(snakePath[i].headFromLeft, snakePath[i].headFromTop, snakeSize, snakeSize); //Draw the snakeTail
  ctx.fillStyle = "#11D147";
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

function Tail(tailFromLeft, tailFromTop) { //Constructor function creating new snaketail-parts
  this.tailFromLeft = tailFromLeft;
  this.tailFromTop = tailFromTop;
}

function addTail(i) {
  snakeTail.push(new Tail(snakePath[i].headFromLeft, snakePath[i].headFromTop));
}

function increaseSpeed(score) {
  if (score < 50) {
    speed -= 30; //Sets the interval on the moving functions
  } else if (score > 50 && score < 280) {
    speed -= 10;
  } else if (score > 280) {
    speed -= 3;
  }
}


function keyDownHandler(e) { //Input is the event triggering this function
  if (e.key == "Right" || e.key == "ArrowRight" && rightCycle === false && leftCycle === false) { //If right key is pressed and snake is not already moving to the right or left
    clearInterval(downInterval); //Clear all other intervals but the right
    clearInterval(leftInterval);
    clearInterval(upInterval);
    rightCycle = true;
    downCycle = false;
    leftCycle = false;
    upCycle = false;
    rightInterval = setInterval(moveRight, speed);
  } else if (e.key == "Down" || e.key == "ArrowDown" && downCycle === false && upCycle === false) {
    clearInterval(rightInterval); //Clear all other intervals but the down
    clearInterval(leftInterval);
    clearInterval(upInterval);
    downCycle = true;
    rightCycle = false;
    leftCycle = false;
    upCycle = false;
    downInterval = setInterval(moveDown, speed);
  } else if (e.key == "Left" || e.key == "ArrowLeft" && leftCycle === false && rightCycle === false) {
    clearInterval(rightInterval); //Clear all other intervals but the left
    clearInterval(downInterval);
    clearInterval(upInterval);
    leftCycle = true;
    rightCycle = false;
    downCycle = false;
    upCycle = false;
    leftInterval = setInterval(moveLeft, speed);
  } else if (e.key == "Up" || e.key == "ArrowUp" && upCycle === false && downCycle === false) {
    clearInterval(rightInterval); //Clear all other intervals but the up
    clearInterval(downInterval);
    clearInterval(leftInterval);
    upCycle = true;
    rightCycle = false;
    downCycle = false;
    leftCycle = false;
    upInterval = setInterval(moveUp, speed);
  }
}

function moveRight() {
  document.addEventListener("keydown", keyDownHandler); //Listen for a click within interval
  snakePath.push(new Path(snakeHeadFromLeft, snakeHeadFromTop)); //Add one to the path-array with current position of head
  snakeHeadFromLeft += distance; //Move head from the left
  applyPathToTail(); //Add the value of snakePath[i] to snakeTail[i], this one is being used in the collision detection, if I apply it to the drawTail() it's making everything 20 px after the head, the drawTail function now has the direct velues of snakePath[i]
  if (snakePath.length > snakeTail.length) {
    snakePath.shift(); // Remove the first item in path-array
  }
}

function moveDown() {
  document.addEventListener("keydown", keyDownHandler);
  snakePath.push(new Path(snakeHeadFromLeft, snakeHeadFromTop));
  snakeHeadFromTop += distance; //Move head 20px from the top
  applyPathToTail();
  if (snakePath.length > snakeTail.length) {
    snakePath.shift();
  }
}

function moveLeft() {
  document.addEventListener("keydown", keyDownHandler);
  snakePath.push(new Path(snakeHeadFromLeft, snakeHeadFromTop));
  snakeHeadFromLeft -= distance; //Move head 20px closer to the left
  applyPathToTail();
  if (snakePath.length > snakeTail.length) {
    snakePath.shift();
  }
}

function moveUp() {
  document.addEventListener("keydown", keyDownHandler);
  snakePath.push(new Path(snakeHeadFromLeft, snakeHeadFromTop)); //Push in the current values of head into the path-array
  snakeHeadFromTop -= distance; //Move head 20px closer to the top
  applyPathToTail();
  if (snakePath.length > snakeTail.length) {
    snakePath.shift();
  }
}

function applyPathToTail() { //Add the value of snakePath[i] to snakeTail[i], this one is being used in the collision detection, if I apply it to the drawTail() it's making everything 20 px after the head, the drawTail function now has the direct velues of snakePath[i]
  for (var i = 0; i < snakeTail.length; i++) {
    snakeTail[i].tailFromLeft = snakePath[i].headFromLeft;
    snakeTail[i].tailFromTop = snakePath[i].headFromTop;
  }
}

function checkCollision() {
  for (var i = 0; i < snakeTail.length; i++) {
    if (snakeHeadFromLeft == snakeTail[i].tailFromLeft && snakeHeadFromTop == snakeTail[i].tailFromTop) {
      colliding = true;
    }
  }
  if (snakeHeadFromLeft == -20 || snakeHeadFromLeft == canvas.width || snakeHeadFromTop == -20 || snakeHeadFromTop == canvas.height) {
    colliding = true;
  }
}

function displayGameOver() {
  console.log("You did not make it to the scoreboard");
  displayScoreboard();
  document.getElementById("game-over").style.display = "block"; //Show game-over window
}

function displayHighscore() {
  document.getElementById("new-highscore").style.display = "block"; //Show highscore window
}

//First time it loops through one alternative, second round two alternatives and third round three alternatives - WHY?
function setHighScore() {
  if (score > highscore[2].score && score <= highscore[1].score){ //If score is higher than current third place
    console.log("third place");
    highscore.splice(2, 0, (new Highscore(playerName, score)))
    highscore.pop()

  } else if (score > highscore[1].score && score <= highscore[0].score){
    console.log("second place");
    highscore.splice(1, 0, (new Highscore(playerName, score)))
    highscore.pop()

  } else if (score > highscore[0].score) { //If score is higher than current first place
    console.log("first place");
    highscore.splice(0, 0, (new Highscore(playerName, score)))
    highscore.pop()

  }
}

function Highscore(e, score) {
  this.name = e;
  this.score = score;
}

function displayScoreboard() {
  document.getElementById("win-name").innerHTML = highscore[0].name;
  document.getElementById("win-score").innerHTML = highscore[0].score;
  document.getElementById("second-name").innerHTML = highscore[1].name;
  document.getElementById("second-score").innerHTML = highscore[1].score;
  document.getElementById("third-name").innerHTML = highscore[2].name;
  document.getElementById("third-score").innerHTML = highscore[2].score;
  /*document.getElementById("win-name").innerHTML = h1name;
  document.getElementById("win-score").innerHTML = h1score;
  document.getElementById("second-name").innerHTML = h2name;
  document.getElementById("second-score").innerHTML = h2score;
  document.getElementById("third-name").innerHTML = h3name;
  document.getElementById("third-score").innerHTML = h3score;*/
}


function highscoreToGameOver() {
  document.getElementById("new-highscore").style.display = "none"; //Hide new-highscore
  document.getElementById("game-over").style.display = "block"; //Show game-over window
}

function reset() {
  colliding = false;
  document.getElementById("game-over").style.display = "none";
  gameInterval = setInterval(draw, 20);
  score = 0;
  speed = 400; //400
  snakeHeadFromLeft = 40;
  snakeHeadFromTop = canvas.height/2;
  snakePath = [{
    headFromLeft: snakeHeadFromLeft - 20,
    headFromTop: snakeHeadFromTop
  }];
  snakeTail = [{
    tailFromLeft: snakePath[0].headFromLeft,
    tailFromTop: snakePath[0].headFromTop
  }];
  rightCycle = false;
  downCycle = false;
  leftCycle = false;
  upCycle = false;
  clearInterval(rightInterval);
  clearInterval(downInterval);
  clearInterval(leftInterval);
  clearInterval(upInterval);
  document.getElementById("score").innerHTML = score;
}

function displayLearnings() {
  document.getElementById("game-over").style.display = "none"; //Do not display game-over screen
  document.getElementById("crawl").style.animation = "crawl 50s linear"; //Apply the crawl animation
  document.getElementById("learnings").style.display = "flex"; //Display my learnings
}
