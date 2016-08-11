// Distance between each point as a constraint.
var CONSTRAINT_LENGTH = 20;

// Number of rows and columns in the grid
var GRID_LENGTH = 15;

// Radius of each point
var RADIUS = 1;

// Canvas dimensions
var CANVAS_HEIGHT = 600;
var CANVAS_WIDTH = 600;

// Gravity applied every frame
var GRAVITY = 0.1;

function Controller(canvasElement) {
  canvasElement.width = CANVAS_WIDTH;
  canvasElement.height = CANVAS_HEIGHT;
  this.canvas = canvasElement.getContext('2d');
  this.simulation = new Simulation();
  this.renderer = new Renderer(this.canvas);
}

// Starts the render loop
Controller.prototype.start = function () {
  var frame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame;
  var frameRender = function() {
    this.render();
    frame(frameRender);
  }.bind(this);
  frameRender();
};

Controller.prototype.render = function () {
  // Solve for constraints
  this.simulation.calculate();

  // Render the simulation
  this.renderer.draw(this.simulation);
};

// Generates a grid of n x n points
function generatePoints(length) {
  var grid = [];
  for (var x = 0; x < length; x++) {
    var col = [];
    for (var y = 0; y < length; y++) {
      col.push(new Point(x * CONSTRAINT_LENGTH, y * CONSTRAINT_LENGTH, false));
    }
    grid.push(col);
  }
  return grid;
}

// Connects (n-1)^2 squares in a grid of length n
function generateConstraint(points) {
  var constraints = [];
  // Connect all y to y+1 points
  for (var x = 0; x < points.length; x++) {
    for (var y = 0; y < points.length - 1; y++) {
      constraints.push(new Constraint(points[x][y], points[x][y+1]));
    }
  }

  // Connect all x to x+1 points
  for (var x = 0; x < points.length - 1; x++) {
    for (var y = 0; y < points.length; y++) {
      constraints.push(new Constraint(points[x][y], points[x+1][y]));
    }
  }
  return constraints;
}

function Simulation() {
  this.points = generatePoints(GRID_LENGTH);
  this.constraints = generateConstraint(this.points);
}


Simulation.prototype.calculate = function() {};

Simulation.prototype.getPointAt = function(x, y) {
  return this.points[x][y]
};

Simulation.prototype.getLength = function() {
  return GRID_LENGTH;
};

Simulation.prototype.getConstraints = function() {
  return this.constraints;
};

function Point(x, y, anchored) {
  this.x = x;
  this.y = y;
  this.anchored = anchored || false;

  this.oldX = this.oldX;
  this.oldY = this.oldY;

  this.dx = 0;
  this.dy = 0;
}

Point.prototype.getX = function() { return this.x };
Point.prototype.getY = function() { return this.y };
Point.prototype.getOldX = function() { return this.oldX };
Point.prototype.getOldY = function() { return this.oldY };
Point.prototype.getDx = function() { return this.dx };
Point.prototype.getDy = function() { return this.dy };
Point.prototype.isAnchored = function() { return this.anchored };
Point.prototype.setAnchor = function(isAnchored) { this.anchored = isAnchored };

function Constraint(pointA, pointB, length) {
  this.pointA = pointA;
  this.pointB = pointB;
  this.length = length;
}

Constraint.prototype.getStartPoint = function() { return this.pointA; };
Constraint.prototype.getEndPoint = function() { return this.pointB; };


var FILL_STYLE = '#00FF00';
var STROKE_STYLE = '#0000FF';
var LINE_WIDTH = 0.5;

function Renderer(canvas) {
  this.canvas = canvas;

  this.canvas.fillStyle = FILL_STYLE
  this.canvas.strokeStyle = STROKE_STYLE
  this.canvas.lineWidth = LINE_WIDTH
}


Renderer.prototype.draw = function(sim) {
  this.canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  this.calculatePosition();
  this.calculateConstraints();

  this.drawPoints(sim);

  this.drawConstraints(sim);
};

Renderer.prototype.calculatePosition = function(sim) {

};

Renderer.prototype.calculateConstraints = function(sim) {

};

Renderer.prototype.drawPoints = function(sim) {
  var length = GRID_LENGTH;
  for (var x = 0; x < length; x++) {
    for (var y = 0; y < length; y++) {
      this.renderPoint(sim.getPointAt(x, y));
    }
  }
};

Renderer.prototype.drawConstraints = function(sim) {
  var constraints = sim.getConstraints();
  var constraintsLength = constraints.length;
  for (var i = 0; i < constraintsLength; i++) {
    this.renderConstraint(constraints[i]);
  }
};

Renderer.prototype.renderPoint = function(point) {
  this.canvas.beginPath();
  this.canvas.arc(point.getX(), point.getY(), RADIUS, 0, 2 * Math.PI);
  this.canvas.fill();
  this.canvas.stroke();
};

Renderer.prototype.renderConstraint = function(constraint) {
  var startPoint = constraint.getStartPoint();
  var endPoint = constraint.getEndPoint();
  this.canvas.beginPath();
  this.canvas.moveTo(startPoint.getX(), startPoint.getY());
  this.canvas.lineTo(endPoint.getX(), endPoint.getY());
  this.canvas.stroke();
};

function init() {
  var element = document.getElementById('verlet');
  var controller = new Controller(element);
  controller.start();
}

init();
