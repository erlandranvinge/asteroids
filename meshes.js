
var Meshes = function(shader) {
    this.data = [];
    this.meshes = [];
    this.shader = shader;
};

Meshes.prototype.add = function(vertices) {
    this.meshes.push({ offset: this.data.length / 2, length: vertices.length / 2 });

    for (var i = 0; i < vertices.length; i+=2) {
        this.data.push(vertices[i], vertices[i+1]);
    }

    return this.meshes.length - 1;
};

Meshes.prototype.addCircle = function(vertices, radius, roughness) {
    this.meshes.push({ offset: this.data.length / 2, length: vertices });

    var da = 2*pi / vertices;
    for (var angle = 0; angle < 2*pi; angle += da) {
        var r = radius + (random() * roughness - roughness * 0.5);
        this.data.push(r * Math.cos(angle));
        this.data.push(r * Math.sin(angle));
    }
    return this.meshes.length - 1;
};

Meshes.prototype.compile = function() {
    this.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);

    console.log(this.meshes);
};

Meshes.prototype.draw = function(id, x, y, angle, scale) {
    var shader = this.shader;
    angle = angle || 0.0;
    scale = scale || 1.0;

    shader.use();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
    gl.enableVertexAttribArray(shader.attributes.vertexAttribute);
    gl.vertexAttribPointer(shader.attributes.vertexAttribute, 3, gl.FLOAT, false, 8, 0)

    var p = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1];

    gl.uniformMatrix4fv(shader.uniforms.projectionMatrix, false, p);
    gl.uniform4fv(shader.uniforms.transform, [x, y, angle, scale]);
    gl.drawArrays(gl.LINE_LOOP, this.meshes[id].offset, this.meshes[id].length);
};