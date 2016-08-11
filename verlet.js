// Distance between each point as a constraint.
var CONSTRAINT_LENGTH = 20;

// Number of rows and columns in the grid
var GRID_LENGTH = 15;

// Radius of each point
var RADIUS = 1;

// Canvas dimensions
var CANVAS_HEIGHT = 600;
var CANVAS_WIDTH = 600;

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
function generateConstraints() {
  // TODO
}

function Simulation() {
  this.points = generatePoints(GRID_LENGTH);
  this.constraints = generateConstraints();
}


Simulation.prototype.calculate = function() {};

Simulation.prototype.getPointAt = function(x, y) {
  return this.points[x][y]
};

Simulation.prototype.getLength = function() {
  return GRID_LENGTH;
};

function Renderer(canvas) {
  this.canvas = canvas;
}

function Point(x, y, anchored) {
  this.x = x;
  this.y = y;
  this.anchored = anchored || false;
}

Point.prototype.getX = function() { return this.x };
Point.prototype.getY = function() { return this.y };
Point.prototype.isAnchored = function() { return this.anchored };
Point.prototype.setAnchor = function(isAnchored) { this.anchored = isAnchored };

function Constraints(pointA, pointB, length) {
  this.pointA = pointA;
  this.pointB = pointB;
  this.length = length;
}

Renderer.prototype.draw = function(sim) {
  var length = sim.getLength();
  for (var x = 0; x < length; x++) {
    for (var y = 0; y < length; y++) {
      this.renderPoint(sim.getPointAt(x, y));
    }
  }
};

Renderer.prototype.renderPoint = function(point) {
  this.canvas.beginPath();
  this.canvas.arc(point.getX(), point.getY(), RADIUS, 0, 2 * Math.PI);
  this.canvas.fill();
  this.canvas.stroke();
};

function init() {
  var element = document.getElementById('verlet');
  var controller = new Controller(element);
  controller.start();
}

init();
