

// Inputs: 000 000 0000

var Ai = function() {
    this.inputs = new Array(10);

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
            this.inputs[j] = 0;
        this.inputs[dx] = 1;
        this.inputs[3 + dy] = 1;
        this.inputs[6 + dz] = 1;
        console.log(this.inputs);
    }
};