
var Simulation = function() {

    seed = 3;

    this.player = {
        x: 0, y: 0,
        angle: 1.5707, thrust: 0,
        score: 0, dead: false
    };

    this.asteroids = [];
    for (var i = 0; i < 10; i++) {
        var asteroid = {
            x: 2 * random() - 1,
            y: 2 * random() - 1,
            dx: random() - 0.5,
            dy: random() - 0.5,
            scale: 0.5 + random() * 0.2,
            angle: random() * pi * 2,
            da: random() * 1 - 0.5
        };
        asteroid.initial = {
            x: asteroid.x, y: asteroid.y,
            dx: asteroid.dx, dy: asteroid.dy,
            angle: asteroid.angle, da: asteroid.da
        };
        this.asteroids.push(asteroid);
    }
};

Simulation.prototype.reset = function() {
    this.player.x = 0;
    this.player.y = 0;
    this.player.angle = 1.5707;
    this.player.thrust = 0;
    this.player.score = 0;
    this.player.dead = false;

    for (var i = 0; i < this.asteroids.length; i++) {
        var a = this.asteroids[i];
        a.x = a.initial.x;
        a.y = a.initial.y;
        a.dx = a.initial.dx;
        a.dy = a.initial.dy;
        a.angle = a.initial.angle;
        a.da = a.initial.da;
    }
};

Simulation.prototype.checkCollisions = function() {
    var player = this.player;
    var asteroids = this.asteroids;
    for (var i = 0; i < asteroids.length; i++) {
        var dx = player.x - asteroids[i].x;
        var dy = player.y - asteroids[i].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.1) return true;
    }
    return false;
};

Simulation.prototype.update = function(dt, input) {

    var player = this.player;
    var asteroids = this.asteroids;

    if (player.dead)
        return;

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

        if (player.x >  1.0) { player.x = -1.0 }
        if (player.x < -1.0) { player.x =  1.0 }

        if (player.y >  1.0) { player.y = -1.0 }
        if (player.y < -1.0) { player.y =  1.0 }


        player.thrust *= 0.95;
    }

    if (this.checkCollisions()) {
        player.dead = true;
        return;
    }

    player.score += 20 * dt;
};