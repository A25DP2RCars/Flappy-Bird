const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = 300;
let birdX = 50;
let velocity = 0;
const gravity = 0.4;
const jump = -7;
const birdSize = 20;

let pipes = [];
const pipeWidth = 60;
const pipeGap = 150;
const pipeSpeed = 2;
let frameCount = 0;

let score = 0;
let gameOver = false;

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (gameOver) resetGame();
        else velocity = jump;
    }
});
canvas.addEventListener("click", () => {
    if (gameOver) resetGame();
    else velocity = jump;
});

function resetGame() {
    birdY = 300;
    velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    loop();
}

function loop() {
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Spēle Beigusies!", 90, 280);
        ctx.font = "20px Arial";
        ctx.fillText("Nospied Space, lai sāktu vēlreiz", 50, 330);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    velocity += gravity;
    birdY += velocity;

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(birdX, birdY, birdSize, 0, Math.PI * 2);
    ctx.fill();

    if (frameCount % 100 === 0) {
        let topPipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
        pipes.push({
            x: canvas.width,
            top: topPipeHeight,
            bottom: canvas.height - topPipeHeight - pipeGap,
            passed: false
        });
    }
    frameCount++;

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        ctx.fillStyle = "green";
        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].top);

        ctx.fillRect(pipes[i].x, canvas.height - pipes[i].bottom, pipeWidth, pipes[i].bottom);

        if (
            birdX + birdSize > pipes[i].x &&
            birdX - birdSize < pipes[i].x + pipeWidth &&
            (birdY - birdSize < pipes[i].top || birdY + birdSize > canvas.height - pipes[i].bottom)
        ) {
            gameOver = true;
        }

        if (!pipes[i].passed && pipes[i].x + pipeWidth < birdX) {
            score++;
            pipes[i].passed = true;
        }

        // Noņem caurules, kas izgājušas no ekrāna
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }

    if (birdY + birdSize > canvas.height || birdY - birdSize < 0) {
        gameOver = true;
    }


    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Punkti: " + score, 10, 40);

    requestAnimationFrame(loop);
}

loop();
