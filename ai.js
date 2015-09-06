

// Inputs: 000 000 0000

var Ai = function(asteroidCount) {
    this.inputs = new Array(asteroidCount * 10);
    this.outputs = new Array(3);
    this.weights = [];

    for (var o = 0; o < this.outputs.length; o++) {

        this.weights.push([]);
        for (var i = 0; i < this.inputs.length; i++) {
            this.weights[o].push(random());
        }
    }
};

Ai.prototype.calculateInputs = function(sim) {
    var asteroids = sim.asteroids;
    var player = sim.player;

    for (var i = 0; i < asteroids.length; i++) {
        var asteroid = asteroids[i];
        var dx = player.x - asteroid.x;
        var dy = player.y - asteroid.y;
        var d = Math.sqrt(dx * dx + dy * dy);

        if (Math.abs(dx) < 0.1) { dx = 1; }
        else if (dx < 0) { dx = 0; }
        else { dx = 2 }

        if (Math.abs(dy) < 0.1) { dy = 1; }
        else if (dy < 0) { dy = 0; }
        else { dy = 2 }

        var dz = 0;
        if (d < 0.2) { dz = 0; }
        else if (d < 0.4) { dz = 1; }
        else if (d < 0.6) { dz = 2; }
        else { dz = 3; }

        for (var j = 0; j < 10; j++)
            this.inputs[i * 10 + j] = 0;

        this.inputs[i * 10 + dx] = 1;
        this.inputs[i * 10 + 3 + dy] = 1;
        this.inputs[i * 10 + 6 + dz] = 1;
    }
};

Ai.prototype.randomDna = function() {
    for (var o = 0; o < this.outputs.length; o++) {
        for (var i = 0; i < this.inputs.length; i++) {
            this.weights[o][i] = random();
        }
    }
};

Ai.prototype.propagate = function() {

    for (var o = 0; o < this.outputs.length; o++) {
        var output = 0;
        for (var i = 0; i < this.inputs.length; i++) {
            output += this.weights[o][i] * this.inputs[i];
        }
        this.outputs[o] = output / this.inputs.length;
    }

    this.left = this.outputs[0] > 0.1;
    this.right = this.outputs[1] > 0.1;
    this.up = this.outputs[2] > 0.1;
};