
var pi = 3.141592;
var seed = 3;

function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
