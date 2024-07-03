let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

let $sprite = document.querySelector('#sprite');
let $bricks = document.querySelector('#bricks');

canvas.width = 600;
canvas.height = 450;

let counter = 0;

const ballRadius = 4;

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 5;
let dy = -5;

let rightPressed = false;
let leftPressed = false;

const brickRows = 6;
const brickColumns = 13;
const brickWidth = 32;
const brickHeight = 16;
const paddingBrick = 2;
const brickOffsetTop = 80;
const brickOffsetLeft = 75;
const bricks = [];

const BRICK_STATUS = {
    ACTIVE: 1,
    DESTROYED: 0
}

for(let c = 0; c < brickColumns; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRows; r++) {
        const brickX = c * (brickWidth + paddingBrick) + brickOffsetLeft;
        const brickY = r * (brickHeight + paddingBrick) + brickOffsetTop;
        const random = Math.floor(Math.random() * 8);
        bricks[c][r] = {
            x: brickX,
            y: brickY,
            status: BRICK_STATUS.ACTIVE,
            color: random
        };
    };
};

function drawBricks() {
    for(let c = 0; c < brickColumns; c++) {
        for(let r = 0; r < brickRows; r++) {
            const currentBrick = bricks[c][r];
            if(currentBrick.status === BRICK_STATUS.DESTROYED) continue;
            /*context.fillStyle = 'yellow';
            context.rect(
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeight
            )
            context.fill();*/

            const clipX = currentBrick.color * 32;

            context.drawImage(
                $bricks,
                clipX,
                0,
                31,
                14,
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeight
            );
        }
    }
};

function ball() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = '#fff';
    context.fill();
    context.closePath();
};

const paddleWidth = 50;
const paddleHeight = 10; 

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

function paddle() {
    /*context.fillStyle = 'violet';
    context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);*/
    context.drawImage($sprite, 29, 174, paddleWidth, paddleHeight, paddleX, paddleY, paddleWidth, paddleHeight)

};


function collisionDetection() {
    for(let c = 0; c < brickColumns; c++) {
        for(let r = 0; r < brickRows; r++) {
            const currentBrick = bricks[c][r];
            if(currentBrick.status === BRICK_STATUS.DESTROYED) continue;

            const isBallSaneXAsBrick = x > currentBrick.x && x < currentBrick.x + brickWidth;
        
            const isBallSaneYAsPaddle = y > currentBrick.y && y < currentBrick.y + brickHeight;

            if(isBallSaneXAsBrick && isBallSaneYAsPaddle){
                dy = -dy
                currentBrick.status = BRICK_STATUS.DESTROYED;
            };
        };
    };
};
function ballMovement() {
    const isBallSaneXAsPaddle = x > paddleX && x < paddleX + paddleWidth;
    const isBallTouchingPaddle = y + dy > paddleY;

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } 
    if (isBallSaneXAsPaddle && isBallTouchingPaddle) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
            console.log('GAME OVER');
            document.location.reload();
    }
    x += dx;
    y += dy;
};
function paddleMovement() {
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 10;
    } else if(leftPressed && paddleX > 0){
        paddleX -= 10;
    }
};

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvent() {
    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    function keydownHandler(event) {
        const { key} = event;
        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = true;
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = true;
        }
    }
    function keyupHandler(event) {
        const { key} = event;
        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = false;
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = false;
        }
    }
}

const draw = () => {
    clearCanvas();

    ball();
    paddle();
    drawBricks();
    collisionDetection();
    ballMovement();
    paddleMovement();

    initEvent();

    window.requestAnimationFrame(draw);
}
draw();