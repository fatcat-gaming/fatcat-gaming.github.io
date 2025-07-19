document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;

    if (path.includes("home")) {
        document.getElementById("homeButton").classList.add("active");
    } else if (path.includes("about")) {
        document.getElementById("aboutButton").classList.add("active");
    } else if (path.includes("contact")) {
        document.getElementById("contactButton").classList.add("active");
    }
});

function myFunction() {
    var element = document.body;
    element.classList.toggle("light-mode");
 };

 // Game Code //
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  color: "limegreen",
  velocityY: 0,
  gravity: 0.9,
  jumpForce: -12,
  isJumping: false
};

const obstacles = [];
let frame = 0;
let score = 0;
const groundY = 370;

let gameOver = false;

function restartGame() {
  player.y = 300;
  player.velocityY = 0;
  player.isJumping = false;

  obstacles.length = 0;
  frame = 0;
  score = 0;
  gameOver = false;

  update(); 
}


function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: groundY,
    width: 20,
    height: 60,
    color: "red"
  });
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "lightblue";
  player.velocityY += player.gravity;
if (player.velocityY > 0) {
  player.velocityY += 0.4;
}
  player.y += player.velocityY;

  if (player.y > groundY) {
    player.y = groundY;
    player.velocityY = 0;
    player.isJumping = false;
  }

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= 6;

    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver = true;
      ctx.fillStyle = "black";
      ctx.font = "30px Inter";
      ctx.fillText("Game Over!", canvas.width / 2 - 70, canvas.height / 2);
      ctx.fillText("Press 'R' to Restart", canvas.width / 2 - 100, canvas.height / 2 + 40);
      return;
    }
    if (gameOver && e.code === "KeyR") {
      restartGame();
    }
  }
  
  

  if (frame % 95 === 0) {
    spawnObstacle();
  }

  frame++;
  requestAnimationFrame(update);
}

document.addEventListener("keydown", function (e) {
  if (gameOver && e.code === "KeyR") {
    restartGame();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && !player.isJumping) {
    player.velocityY = player.jumpForce;
    player.isJumping = true;
  }
});


update();
