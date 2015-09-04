var gl = null;

var Asteroids = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) throw 'Unable to init. webgl.';

    gl.canvas = canvas;
    gl.viewport(0, 0, canvas.width, canvas.height);

    this.player = {
        x: 0, y: 0, angle: 0
    };
};

Asteroids.prototype.loadAssets = function(done) {
    var self = this;
    Shader.fromUrl('shader.txt', function(shader) {
        var meshes = new Meshes(shader);

        var ship = meshes.add([
            -0.1, -0.1,
             0.1, -0.1,
             0.0,  0.1
        ]);

        meshes.compile();
        self.meshes = meshes;
        done();
    });
};

Asteroids.prototype.update = function() {
};

Asteroids.prototype.draw = function() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // TODO: Draw multiple meshes.
    this.meshes.draw(0, this.player.x, this.player.y, this.player.angle, 0.5);

    var self = this;
    window.requestAnimationFrame(function() {
        self.draw();
    });
};

Asteroids.prototype.start = function() {
    var self = this;
    this.loadAssets(function() {




        window.requestAnimationFrame(function() {
            self.draw();
        });
    });
};