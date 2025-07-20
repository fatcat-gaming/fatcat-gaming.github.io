// Theme + Navigation Logic (Optional)
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;

  if (path.includes("home")) {
    document.getElementById("homeButton")?.classList.add("active");
  } else if (path.includes("about")) {
    document.getElementById("aboutButton")?.classList.add("active");
  } else if (path.includes("contact")) {
    document.getElementById("contactButton")?.classList.add("active");
  }
});

function myFunction() {
  var element = document.body;
  element.classList.toggle("light-mode");
}

// ========== GAME CODE ========== //

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
  isJumping: false,
};

const obstacles = [];
const platforms = [];

let frame = 0;
let score = 0;
let gameOver = false;
const groundY = 370;

let obstacleTimer = 0;
let nextObstacleFrame = getRandomInterval();

function getRandomInterval() {
  return Math.floor(Math.random() * 16) + 50; // Between 50–65 frames
}

function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: groundY,
    width: 20,
    height: 60,
    color: "red",
  });
}

function spawnPlatform() {
  let width = 100;
  let height = 20;
  let x = canvas.width;
  let y = Math.random() * 30 + 320;

  platforms.push({
    x: x,
    y: y,
    width: width,
    height: height,
    color: "purple",
  });
}

function restartGame() {
  player.y = 300;
  player.velocityY = 0;
  player.isJumping = false;

  obstacles.length = 0;
  platforms.length = 0;
  frame = 0;
  score = 0;
  gameOver = false;

  update();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "lightblue";

  // Player physics
  player.velocityY += player.gravity;
  if (player.velocityY > 0) {
    player.velocityY += 0.4; // Faster falling
  }
  player.y += player.velocityY;

  // Ground collision
  if (player.y > groundY) {
    player.y = groundY;
    player.velocityY = 0;
    player.isJumping = false;
  }

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Update and draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= 6;

    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Collision with player
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
  }

 
  for (let i = 0; i < platforms.length; i++) {
    let plat = platforms[i];
    ctx.fillStyle = plat.color;
    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
    plat.x -= 6; 
    
  }

  
  for (let i = 0; i < platforms.length; i++) {
    let plat = platforms[i];
    if (
      player.x + player.width > plat.x &&
      player.x < plat.x + plat.width &&
      player.y + player.height >= plat.y &&
      player.y + player.height <= plat.y + 10 &&
      player.velocityY >= 0
    ) {
      player.y = plat.y - player.height;
      player.velocityY = 0;
      player.isJumping = false;
    }
  }

  if (frame % 200 === 0) {
    spawnPlatform();
  }

  obstacleTimer++;
  if (obstacleTimer >= nextObstacleFrame) {
    spawnObstacle();
    obstacleTimer = 0;
    nextObstacleFrame = getRandomInterval();
  }

  frame++;
  requestAnimationFrame(update);
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && !player.isJumping) {
    player.velocityY = player.jumpForce;
    player.isJumping = true;
  }

  if (gameOver && e.code === "KeyR") {
    restartGame();
  }
});

update();
