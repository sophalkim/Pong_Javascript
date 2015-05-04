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

};
// draws background
var render = function() {
    context.fillStyle = "#FF00FF";
    context.fillRect(0, 0, width, height);
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