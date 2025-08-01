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
  rotation: 0
};

const obstacles = [];
const platforms = [];

const images = {
  player: "player.png",
  obstacle: "obstacle.png",
  platform: "platform.png"
};

const textures = {};
let loadedImages = 0;
const totalImages = Object.keys(images).length;

function loadTextures(callback) {
  for (const key in images) {
    const img = new Image();
    img.src = images[key];
    img.onload = () => {
      loadedImages++;
      if (loadedImages === totalImages) callback();
    };
    textures[key] = img;
  }
}



let frame = 0;
let score = 0;
const groundY = 370;
let gameOver = false;

let obstacleTimer = 0;
let nextObstacleFrame = getRandomInterval();

function getRandomInterval() {
  return Math.floor(Math.random() * 16) + 50;
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

function spawnPlatform() {
  platforms.push({
    x: canvas.width,
    y: Math.random() * 50 + 315,
    width: 50,
    height: 500,
    color: "green"
  });
}

function restartGame() {
  player.y = 300;
  player.velocityY = 0;
  player.rotation = 0;
  player.isJumping = false;

  obstacles.length = 0;
  platforms.length = 0;
  frame = 0;
  score = 0;
  gameOver = false;
}

document.addEventListener("keydown", function (e) {
  if (!gameOver && e.code === "Space" && !player.isJumping) {
    player.velocityY = player.jumpForce;
    player.isJumping = true;
  }
  if (gameOver && e.code === "KeyR") {
    restartGame();
  }
});

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Apply gravity
  player.velocityY += player.gravity;
  if (player.velocityY > 0) player.velocityY += 0.4;
  player.y += player.velocityY;

  // Ground collision
  if (player.y > groundY) {
    player.y = groundY;
    player.velocityY = 0;
    player.isJumping = false;
    player.rotation = 0; // ✅ fixes angled landing
  }

  // Draw player (with rotation)
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  if (player.isJumping) player.rotation += 0.15;
  ctx.rotate(player.rotation);
  ctx.fillStyle = player.color;
  ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
  ctx.restore();

  // Draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= 6;
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    

    // Collision
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver = true;
    }
  }

  // Draw platforms
  for (let plat of platforms) {
    plat.x -= 6; // Move platforms left
    ctx.fillStyle = plat.color;
    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
  }

  // Platform collision
  for (let plat of platforms) {
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
      player.rotation = 0;
    }
  }

  // Spawn platforms occasionally
  if (frame % 200 === 0) spawnPlatform();

  // Game over text
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "30px Inter";
    ctx.fillText("Game Over!", canvas.width / 2 - 70, canvas.height / 2);
    ctx.fillText("Press 'R' to Restart", canvas.width / 2 - 100, canvas.height / 2 + 40);
  }

  // Spawn obstacles
  obstacleTimer++;
  if (obstacleTimer >= nextObstacleFrame) {
    spawnObstacle();
    obstacleTimer = 0;
    nextObstacleFrame = getRandomInterval();
  }

  frame++;
  requestAnimationFrame(update); // ✅ only called once
}

update(); // ✅ starts the loop only once
