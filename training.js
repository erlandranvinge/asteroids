
var Training = function() {
    this.topScore = 0;
    this.sim = new Simulation();
    this.topDna = [];
};

Training.prototype.run = function() {

    var sim = this.sim;
    var ai = new Ai(sim.asteroids.length);
    sim.reset();
    ai.randomDna();
    while (!sim.player.dead) {
        ai.calculateInputs(sim);
        ai.propagate();
        sim.update(0.0167, ai);
    }

    if (sim.player.score > this.topScore) {
        this.topScore = sim.player.score;
        this.topDna = [];
        for (var i = 0; i < ai.weights.length; i++)
            this.topDna.push(ai.weights[i]);

        console.log(this.topScore);

    }
};

