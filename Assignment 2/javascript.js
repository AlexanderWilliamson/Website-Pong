var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var startbutton = document.getElementById("start");
var pausebutton = document.getElementById("pause");
var restartbutton = document.getElementById("restart");
var botleftbutton = document.getElementById("botleft");
var botrightbutton = document.getElementById("botright");
var messagedisplay = document.getElementById("messageDisplay");
var animationId;

var botLeftEnabled = false, botRightEnabled = false, gameRunning = false, gameover = false, upHeld = false, downHeld = false, wHeld = false, sHeld = false;
var leftScore = 0, rightScore = 0, maxScore = 20;
var ballRadius = 10, ballX = canvas.width / 2, ballY = canvas.height / 2, ballSpeedX = 3, ballSpeedY = 3;
var paddleHeight = 80, paddleWidth = 10, leftPaddleY = canvas.height / 2 - 40, rightPaddleY = canvas.height / 2 - 40, paddleSpeed = 3;



document.addEventListener("keydown", downkey);
document.addEventListener("keyup", upkey);
window.addEventListener("load", drawCanvas);

function downkey(pushed){
	if (pushed.key === 'w')
		wHeld = true;
	else if (pushed.key === 's')
		sHeld = true;
	else if (pushed.key === "ArrowUp")
		upHeld = true;
	else if (pushed.key === "ArrowDown")
		downHeld = true;
}

function upkey(pushed){
	if (pushed.key === 'w')
		wHeld = false;
	else if (pushed.key === 's')
		sHeld = false;
	else if (pushed.key === "ArrowUp")
		upHeld = false;
	else if (pushed.key === "ArrowDown")
		downHeld = false;
}

function startClicked(){
	if (!gameRunning){
		gameRunning = true;
		loop();
	}
}

function pauseClicked(){
	gameRunning = false;
	cancelAnimationFrame(animationId);
}

function restartClicked(){
	document.location.reload();
}

function botLeftClicked(){
	botLeftEnabled = !botLeftEnabled;
	botleftbutton.className = botLeftEnabled ? "button on" : "button off";
}

function botRightClicked(){
	botRightEnabled = !botRightEnabled;
	botrightbutton.className = botRightEnabled ? "button on" : "button off";
}

function updateGameState(){
	if (botRightEnabled){
		if (ballX >= canvas.width / 2 && Math.abs((rightPaddleY + paddleHeight / 2) - ballY) > paddleSpeed){
			if (ballY > rightPaddleY + paddleHeight / 2)
				rightPaddleY = Math.min(canvas.height - paddleHeight, rightPaddleY + paddleSpeed);
			
			else if (ballY < rightPaddleY + paddleHeight / 2)
				rightPaddleY = Math.max(0, rightPaddleY - paddleSpeed);
		}
		else if (Math.abs(rightPaddleY - (canvas.height / 2 - 40)) > paddleSpeed){
			rightPaddleY += rightPaddleY < canvas.height / 2 - 40 ? paddleSpeed : -paddleSpeed;
		}
	}
	else{
		if (upHeld)
			rightPaddleY = Math.max(0, rightPaddleY - paddleSpeed);
		else if (downHeld)
			rightPaddleY = Math.min(canvas.height - paddleHeight, rightPaddleY + paddleSpeed);
	}
	
	if (botLeftEnabled){
		if (ballX <= canvas.width / 2 && Math.abs((leftPaddleY + paddleHeight / 2) - ballY) > paddleSpeed){
			if (ballY > leftPaddleY + paddleHeight / 2)
				leftPaddleY = Math.min(canvas.height - paddleHeight, leftPaddleY + paddleSpeed);
			
			else if (ballY < leftPaddleY + paddleHeight / 2)
				leftPaddleY = Math.max(0, leftPaddleY - paddleSpeed);
		}
		else if (Math.abs(leftPaddleY - (canvas.height / 2 - 40)) > paddleSpeed){
			leftPaddleY += leftPaddleY < canvas.height / 2 - 40 ? paddleSpeed : -paddleSpeed;
		}
	}
	else{
		if (wHeld)
			leftPaddleY = Math.max(0, leftPaddleY - paddleSpeed);
		else if (sHeld)
			leftPaddleY = Math.min(canvas.height - paddleHeight, leftPaddleY + paddleSpeed);
	}
	
	if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height)
		ballSpeedY = -ballSpeedY;
	
	if (ballX < paddleWidth && ballY + ballRadius > leftPaddleY && ballY - ballRadius < leftPaddleY + paddleHeight){
		ballSpeedX = -ballSpeedX;
		ballX = paddleWidth;
	}
	if (ballX > canvas.width - paddleWidth && ballY + ballRadius > rightPaddleY && ballY - ballRadius < rightPaddleY + paddleHeight){
		ballSpeedX = -ballSpeedX;
		ballX = canvas.width - paddleWidth;
	}
	
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	
	if (ballX < 0){
		rightScore++;
		pointScored();
		if (rightScore >= maxScore)
			playerWin("Right");
		else
			messagedisplay.innerHTML = "Right player scored!";
	}
	else if (ballX > canvas.width){
		leftScore++;
		pointScored();
		if (leftScore >= maxScore)
			playerWin("Left");
		else
			messagedisplay.innerHTML = "Left player scored!";
	}
}

function pointScored(){
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	ballSpeedX = -ballSpeedX;
	ballSpeedY = Math.random() * 10 - 5;
}

function drawCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "15px Times New Roman";
	
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.strokeStyle = "";
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 4, 0, Math.PI * 2);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();
	
	ctx.fillStyle = "#0000FF";
	ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
	
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Score: " + leftScore, 10, 20);
	ctx.fillText("Score: " + rightScore, canvas.width - 70, 20);
}

function loop(){
	if (!gameover){
		updateGameState();
		drawCanvas();
		animationId = requestAnimationFrame(loop);
	}
}

function playerWin(player){
	messagedisplay.innerHTML = player + " player wins!";
	gameover = true;
}

