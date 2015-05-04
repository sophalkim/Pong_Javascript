// game thread set to 60 fps
var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) { window.setTimeout(callback, 1000/60)};
// setup canvas
var canvas = document.createElement('canvas');
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
// attach canvas to page when the window loads
window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};
// update and renders the game
var step = function() {
    update();
    render();
    animate(step);
};
// computes position of paddles and balls
var update = function() {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};
// draws background
var render = function() {
    context.fillStyle = "#FF00FF";
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
};
// paddle constructor
function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}
// draws the paddle
Paddle.prototype.render = function() {
    context.fillStyle = "#0000FF";
    context.fillRect(this.x, this.y, this.width, this.height);
};
// player constructor
function Player() {
    this.paddle = new Paddle(175, 580, 50, 10);
}
// Update paddle position based on user pressing the keys
Player.prototype.update = function() {
    for (var key in keysDown) {
        var value = Number(key);
        // Left Arrow
        if (value == 37) {
            this.paddle.move(-4, 0);
        // Right Arrow
        } else if (value == 39) {
            this.paddle.move(4, 0);
        } else {
            this.paddle.move(0, 0);
        }
    }
};
// Calculate position of paddle and prevent paddle from going off the screen
Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    // Prevents paddle from going off the screen
    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > 400) {
        this.x = 400 - this.width;
        this.x_speed = 0;
    }
};
// computer constructor
function Computer() {
    this.paddle = new Paddle(175, 10, 50, 10);
}
// draws the player paddle
Player.prototype.render = function() {
    this.paddle.render();
};
// draws the computer paddle
Computer.prototype.render = function() {
    this.paddle.render();
};
// Calculate compuer paddle position
Computer.prototype.update = function(ball) {
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    // max speed left
    if (diff < 0 && diff < -4) {
        diff = -5;
    } else if (diff > 0 && diff > 4) {
        diff = 5;
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
        this.padd.x = 0;
    } else if (this.paddle.x + this.paddle.width > 400) {
        this.paddle.x = 400 - this.paddle.width;
    }
};
// Ball Constructor
function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
    this.radius = 5;
}

// Draws the ball
Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#000000";
    context.fill();
};
// Calculate ball position and collision detection
Ball.prototype.update = function(paddle1, paddle2) {
    //
    this.x += this.x_speed;
    this.y += this.y_speed;
    // coordinates of ball +- radius
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;
    // collision detection
    // Hitting the left/right wall and reverse the balls direction
    if (this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (this.x + 5 > 400) {
        this.x = 395;
        this.x_speed = -this.x_speed;
    }
    // A point is scored
    if (this.y < 0 || this.y > 600) {
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = 200;
        this.y = 300;
    }
    // if it hits the players paddle
    if (top_y > 300) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y &&
            top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -3;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
    // if it hits the computer paddle
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y &&
            top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 3;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};

// Building objects
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

// Adding controls
var keysDown = {};

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
});