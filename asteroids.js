var gl = null;

var Asteroids = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) throw 'Unable to init. webgl.';

    gl.canvas = canvas;
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.input = new Input();
    this.sim = new Simulation();
};

Asteroids.prototype.loadAssets = function(done) {
    var self = this;
    Shader.fromUrl('shader.txt', function(shader) {
        var meshes = new Meshes(shader);

        self.sim.player.mesh = meshes.add([
            -0.1, -0.1,
             0.1,  0.0,
            -0.1,  0.1
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
    this.sim.update(dt, this.input);
};

Asteroids.prototype.draw = function() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var player = this.sim.player;
    this.meshes.draw(player.mesh, player.x, player.y, player.angle, 0.5);

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