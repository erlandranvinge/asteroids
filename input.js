
var Input = function() {
    this.keys = { left: 37, right: 39, up: 38, down: 40, fire: 32 };
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.fire = false;
};

Input.prototype.keyDown = function(event) {
    var keys = this.keys;
    switch (event.keyCode) {
        case keys.left: this.left = true; break;
        case keys.right: this.right = true; break;
        case keys.up: this.up = true; break;
        case keys.down: this.down = true; break;
        case keys.fire: this.fire = true; break;
    }
};

Input.prototype.keyUp = function(event) {
    var keys = this.keys;
    switch (event.keyCode) {
        case keys.left: this.left = false; break;
        case keys.right: this.right = false; break;
        case keys.up: this.up = false; break;
        case keys.down: this.down = false; break;
    }
};

Input.prototype.bind = function() {
    var self = this;
    document.addEventListener('keydown', function(event) { self.keyDown(event); }, true);
    document.addEventListener('keyup', function(event) { self.keyUp(event); }, true);
};