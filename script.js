const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Устанавливаем размер при старте

const GRAVITY = 0.22;
const FLAP = -6.0;
const PIPE_SPEED = 3.5; 
const GAP = 170;       
const PIPE_WIDTH = 80;


let bird = {
    x: 150, 
    y: window.innerHeight / 2,
    velocity: 0,
    radius: 16
};

let pipes = [];
let score = 0;
let highScore = localStorage.getItem("flappy_highScore") || 0;
let gameOver = false;
let gameStarted = false;


window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});

window.addEventListener("touchstart", () => {
    jump();
});

function jump() {
    if (gameOver) {
        resetGame();
        return;
    }
    if (!gameStarted) {
        gameStarted = true;
    }
    bird.velocity = FLAP;
}


function spawnPipe() {
    let minHeight = 80;
    let maxHeight = canvas.height - GAP - 80;
    let topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - GAP,
        passed: false
    });
}


function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = false;
    spawnPipe();
}


function update() {
    if (gameStarted && !gameOver) {

        bird.velocity += GRAVITY;
        bird.y += bird.velocity;


        if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
            endGame();
        }


        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= PIPE_SPEED;

            if (
                bird.x + bird.radius > pipes[i].x &&
                bird.x - bird.radius < pipes[i].x + PIPE_WIDTH
            ) {
                if (bird.y - bird.radius < pipes[i].top || bird.y + bird.radius > canvas.height - pipes[i].bottom) {
                    endGame();
                }
            }

            if (!pipes[i].passed && pipes[i].x + (PIPE_WIDTH / 2) < bird.x) {
                score++;
                pipes[i].passed = true;
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem("flappy_highScore", highScore);
                }
            }

  
            if (pipes[i].x + PIPE_WIDTH < 0) {
                pipes.splice(i, 1);
            }
        }

        let lastPipe = pipes[pipes.length - 1];
        if (!lastPipe || canvas.width - lastPipe.x >= (canvas.width * 0.45)) {
            spawnPipe();
        }
    }

    draw();
    requestAnimationFrame(update);
}


function draw() {

    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.fillStyle = "#73bf2e";
    pipes.forEach(pipe => {

        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        ctx.strokeStyle = "#538122";
        ctx.lineWidth = 4;
        ctx.strokeRect(pipe.x, -10, PIPE_WIDTH, pipe.top + 10);


        ctx.fillRect(pipe.x - 4, pipe.top - 24, PIPE_WIDTH + 8, 24);
        ctx.strokeRect(pipe.x - 4, pipe.top - 24, PIPE_WIDTH + 8, 24);


        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, PIPE_WIDTH, pipe.bottom);
        ctx.strokeRect(pipe.x, canvas.height - pipe.bottom, PIPE_WIDTH, pipe.bottom + 10);


        ctx.fillRect(pipe.x - 4, canvas.height - pipe.bottom, PIPE_WIDTH + 8, 24);
        ctx.strokeRect(pipe.x - 4, canvas.height - pipe.bottom, PIPE_WIDTH + 8, 24);
    });

    ctx.fillStyle = "#f7d346"; // Тело
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d1a100";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(bird.x + 6, bird.y - 5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(bird.x + 7, bird.y - 5, 2, 0, Math.PI * 2);
    ctx.fill();


    ctx.fillStyle = "#e0be34";
    ctx.beginPath();
    ctx.arc(bird.x - 6, bird.y + 2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();


    ctx.fillStyle = "#f67e2a";
    ctx.beginPath();
    ctx.moveTo(bird.x + 13, bird.y - 3);
    ctx.lineTo(bird.x + 25, bird.y + 2);
    ctx.lineTo(bird.x + 12, bird.y + 7);
    ctx.fill();
    ctx.stroke();


    ctx.fillStyle = "white";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "black";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "left";
   
    ctx.strokeText(`Punkti: ${score}`, 30, 50);
    ctx.fillText(`Punkti: ${score}`, 30, 50);

    ctx.textAlign = "right";
    ctx.strokeText(`Rekords: ${highScore}`, canvas.width - 30, 50);
    ctx.fillText(`Rekords: ${highScore}`, canvas.width - 30, 50);


    ctx.textAlign = "center";


    if (!gameStarted && !gameOver) {
        ctx.font = "bold 36px Arial";
        ctx.strokeText("Nospied ATSTARPI, lai lidotu", canvas.width / 2, canvas.height / 2);
        ctx.fillText("Nospied ATSTARPI, lai lidotu", canvas.width / 2, canvas.height / 2);
    }


    if (gameOver) {
        ctx.font = "bold 46px Arial";
        ctx.fillStyle = "#e74c3c";
        ctx.strokeText("SPĒLE BEIGUSIES", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText("SPĒLE BEIGUSIES", canvas.width / 2, canvas.height / 2 - 20);
       
        ctx.font = "bold 26px Arial";
        ctx.fillStyle = "white";
        ctx.strokeText("Nospied ATSTARPI, lai restartētu", canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText("Nospied ATSTARPI, lai restartētu", canvas.width / 2, canvas.height / 2 + 40);
    }
}

function endGame() {
    gameOver = true;
}

// Старт игры
spawnPipe();
update();
