
var Input = function() {
    this.keys = { left: 37, right: 39, up: 38, down: 40, fire: 32 };
    this.left = false;
    this.right = false;
    this.thrust = false;
    this.reverse = false;
};

Input.prototype.bind = function() {
    var self = this;
    document.addEventListener('keydown', function(event) {

    }, true);
    document.addEventListener('keyup', function(event) {

    }, true);
};