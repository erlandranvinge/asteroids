var gl = null;
var pi = 3.141592;
var seed = 3;

function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

var Asteroids = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) throw 'Unable to init. webgl.';

    gl.canvas = canvas;
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.input = new Input();

    this.player = {
        x: 0, y: 0,
        angle: 1.5707, thrust: 0,
        score: 0, dead: false
    };

    this.asteroids = [];
    for (var i = 0; i < 10; i++) {
        this.asteroids.push({
            x: 2 * random() - 1,
            y: 2 * random() - 1,
            dx: random() - 0.5,
            dy: random() - 0.5,
            scale: 0.5 + random() * 0.2,
            angle: random() * pi * 2,
            da: random() * 1 - 0.5
        });
    }
};

Asteroids.prototype.loadAssets = function(done) {
    var self = this;
    Shader.fromUrl('shader.txt', function(shader) {
        var meshes = new Meshes(shader);

        self.shipMesh = meshes.add([
            -0.1, -0.1,
             0.1,  0.0,
            -0.1,  0.1
        ]);

        self.asteroidMesh = meshes.add([
            -0.1, -0.1,
             0.1, -0.1,
             0.1,  0.1,
            -0.1,  0.1,
        ]);

        meshes.compile();
        self.meshes = meshes;
        done();
    });
};

Asteroids.prototype.update = function(dt) {
    var player = this.player;
    var asteroids = this.asteroids;
    var input = this.input;

    for (var i = 0; i < asteroids.length; i++) {
        var asteroid = asteroids[i];
        asteroid.x += asteroid.dx * dt;
        asteroid.y += asteroid.dy * dt;
        asteroid.angle += asteroid.da * dt;

        if (asteroid.x > 1.0) { asteroid.x = 1.0; asteroid.dx =- asteroid.dx; }
        else if (asteroid.x < -1.0) { asteroid.x = -1.0; asteroid.dx =- asteroid.dx; }

        if (asteroid.y > 1.0) { asteroid.y = 1.0; asteroid.dy =- asteroid.dy; }
        else if (asteroid.y < -1.0) { asteroid.y = -1.0; asteroid.dy =- asteroid.dy; }
    }

    if (input.left) {
        player.angle += 5 * dt;
    }

    if (input.right) {
        player.angle -= 5 * dt;
    }

    if (input.up) {
        player.thrust += 0.1;
    }

    if (player.thrust > 0) {
        player.x += Math.cos(player.angle) * dt * player.thrust;
        player.y += Math.sin(player.angle) * dt * player.thrust;

        if (player.x >  1.0) { player.x =  1.0 }
        if (player.x < -1.0) { player.x = -1.0 }

        if (player.y >  1.0) { player.y =  1.0 }
        if (player.y < -1.0) { player.y = -1.0 }


        player.thrust *= 0.95;
    }
};

Asteroids.prototype.draw = function() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.meshes.draw(this.shipMesh, this.player.x, this.player.y, this.player.angle, 0.5);

    for (var i = 0; i < this.asteroids.length; i++) {
        var asteroid = this.asteroids[i];
        this.meshes.draw(this.asteroidMesh, asteroid.x, asteroid.y, asteroid.angle, asteroid.scale);
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