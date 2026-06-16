const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.25;
const FLAP = -5.5;
const PIPE_SPEED = 2.5;
const GAP = 140; // Размер прохода между трубами

let bird = {
    x: 100, // Смещена левее, чтобы видеть больше труб впереди
    y: 250,
    velocity: 0,
    radius: 14
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
    let minHeight = 50;
    let maxHeight = canvas.height - GAP - 50;
    let topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - GAP,
        passed: false
    });
}

function resetGame() {
    bird.y = 250;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = false;
    spawnPipe();
}

function update() {
    if (gameStarted && !gameOver) {
        // Физика птички
        bird.velocity += GRAVITY;
        bird.y += bird.velocity;

        // Проверка столкновения с землей или потолком
        if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
            endGame();
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= PIPE_SPEED;

            if (
                bird.x + bird.radius > pipes[i].x &&
                bird.x - bird.radius < pipes[i].x + 60
            ) {
                if (bird.y - bird.radius < pipes[i].top || bird.y + bird.radius > canvas.height - pipes[i].bottom) {
                    endGame();
                }
            }

            if (!pipes[i].passed && pipes[i].x + 30 < bird.x) {
                score++;
                pipes[i].passed = true;
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem("flappy_highScore", highScore);
                }
            }

            if (pipes[i].x + 60 < 0) {
                pipes.splice(i, 1);
            }
        }

        let lastPipe = pipes[pipes.length - 1];
        if (!lastPipe || canvas.width - lastPipe.x >= (canvas.width / 2.5)) {
            spawnPipe();
        }
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    // Очистка экрана (небо)
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем трубы
    ctx.fillStyle = "#73bf2e";
    pipes.forEach(pipe => {
        // Верхняя труба
        ctx.fillRect(pipe.x, 0, 60, pipe.top);
        ctx.strokeStyle = "#538122";
        ctx.lineWidth = 3;
        ctx.strokeRect(pipe.x, 0, 60, pipe.top);

        // Нижняя труба
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 60, pipe.bottom);
        ctx.strokeRect(pipe.x, canvas.height - pipe.bottom, 60, pipe.bottom);
    });

    ctx.fillStyle = "#f7d346"; // Желтое тело
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d1a100";
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(bird.x + 6, bird.y - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(bird.x + 7, bird.y - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f67e2a";
    ctx.beginPath();
    ctx.moveTo(bird.x + 12, bird.y - 2);
    ctx.lineTo(bird.x + 22, bird.y + 2);
    ctx.lineTo(bird.x + 11, bird.y + 6);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.font = "bold 24px Arial";
   
    ctx.strokeText(`Очки: ${score}`, 20, 40);
    ctx.fillText(`Очки: ${score}`, 20, 40);

    ctx.strokeText(`Рекорд: ${highScore}`, canvas.width - 180, 40);
    ctx.fillText(`Рекорд: ${highScore}`, canvas.width - 180, 40);

    if (!gameStarted && !gameOver) {
        ctx.font = "bold 30px Arial";
        ctx.strokeText("Нажми ПРОБЕЛ, чтобы лететь", canvas.width / 2 - 210, canvas.height / 2);
        ctx.fillText("Нажми ПРОБЕЛ, чтобы лететь", canvas.width / 2 - 210, canvas.height / 2);
    }

    if (gameOver) {
        ctx.font = "bold 40px Arial";
        ctx.fillStyle = "#e74c3c";
        ctx.strokeText("ИГРА ОКОНЧЕНА", canvas.width / 2 - 160, canvas.height / 2 - 20);
        ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2 - 160, canvas.height / 2 - 20);
       
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "white";
        ctx.strokeText("Нажми ПРОБЕЛ для перезапуска", canvas.width / 2 - 190, canvas.height / 2 + 30);
        ctx.fillText("Нажми ПРОБЕЛ для перезапуска", canvas.width / 2 - 190, canvas.height / 2 + 30);
    }
}

function endGame() {
    gameOver = true;
}

spawnPipe();
update();
