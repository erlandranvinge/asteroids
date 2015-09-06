var gl = null;

var Asteroids = function(canvasId, scoreId) {
    var canvas = document.getElementById(canvasId);
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) throw 'Unable to init. webgl.';
    gl.canvas = canvas;
    gl.viewport(0, 0, canvas.width, canvas.height);

    var score = document.getElementById(scoreId);
    var ui = score.getContext('2d');
    ui.width = score.width;
    ui.height = score.height;
    ui.fillStyle = 'orange';
    ui.font = '20px Sans-Serif';

    this.ui = ui;
    this.input = new Input();
    this.sim = new Simulation();
    this.ai = new Ai(this.sim.asteroids.length);

    this.training = new Training();
    this.isTraining = true;

};

Asteroids.prototype.loadAssets = function(done) {
    var self = this;
    Shader.fromUrl('shader.txt', function(shader) {
        var meshes = new Meshes(shader);

        self.sim.player.mesh = meshes.add([
            -0.05, -0.05,
             0.05,  0.0,
            -0.05,  0.05
        ]);

        var sim = self.sim;
        for (var i = 0; i < sim.asteroids.length; i++)
            sim.asteroids[i].mesh = meshes.addCircle(10, 0.1 + random() * 0.05, 0.1);

        meshes.compile();
        self.meshes = meshes;
        done();
    });
};

Asteroids.prototype.update = function(dt) {
    this.ai.calculateInputs(this.sim);
    this.ai.propagate();

    this.sim.update(dt, this.ai);

    if (this.isTraining) {
        for (var i = 0; i < 100; i++)
            this.training.run();
    }
};

Asteroids.prototype.draw = function() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var player = this.sim.player;
    this.meshes.draw(player.mesh, player.x, player.y, player.angle, 0);

    var asteroids = this.sim.asteroids;
    for (var i = 0; i < asteroids.length; i++) {
        var asteroid = asteroids[i];
        this.meshes.draw(asteroid.mesh, asteroid.x, asteroid.y, asteroid.angle, asteroid.scale);
    }

    var self = this;
    window.requestAnimationFrame(function(time) {
        self.update((time - self.time) / 1000);
        self.draw();
        self.time = time;
    });

    this.ui.clearRect(0, 0, this.ui.width, this.ui.height);
    this.ui.fillText((player.score | 0) + " | IN TRAINING", 10, 30);

    if (player.dead) {
        this.ui.fillText('GAME OVER', 10, 50);
        this.sim.reset();
        this.ai.weights = this.training.topDna;
    }

};

Asteroids.prototype.start = function() {
    var self = this;
    this.loadAssets(function() {
        self.input.bind();
        self.time = 0;
        window.requestAnimationFrame(function(time) {
            self.time = time;
            self.draw();
        });
    });
};