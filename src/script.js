const IDs = {
    canvas: 'noisy-canvas',
    shaders: {
        vertex: 'vertex-shader',
        fragment: 'fragment-shader'
    }
};


const CANVAS = document.getElementById(IDs.canvas);
const GL     = CANVAS.getContext('webgl');

let PROGRAM;


main();


function main() {
    clearCanvas();
    createPlane();
    createProgram();
    updateCanvasSize();
    initEventListeners();
    draw();
}


function clearCanvas() {
    GL.clearColor(0.26, 1, 0.93, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT);
}


function createPlane() {
    GL.bindBuffer(GL.ARRAY_BUFFER, GL.createBuffer());
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array([
            -1, -1,
            -1,  1,
             1, -1,
             1,  1
        ]),
        GL.STATIC_DRAW
    );
}


function createProgram() {
    const shaders = getShaders();

    PROGRAM = GL.createProgram();

    GL.attachShader(PROGRAM, shaders.vertex);
    GL.attachShader(PROGRAM, shaders.fragment);
    GL.linkProgram(PROGRAM);
    
    const vertexPositionAttribute = GL.getAttribLocation(PROGRAM, 'a_position');
    
    GL.enableVertexAttribArray(vertexPositionAttribute);
    GL.vertexAttribPointer(vertexPositionAttribute, 2, GL.FLOAT, false, 0, 0);

    GL.useProgram(PROGRAM);
}


function getShaders() {
    return {
        vertex: compileShader(
            GL.VERTEX_SHADER,
            document.getElementById(IDs.shaders.vertex).textContent
        ),
        fragment: compileShader(
            GL.FRAGMENT_SHADER,
            document.getElementById(IDs.shaders.fragment).textContent
        )
    };
}


function compileShader(type, source) {
    const shader = GL.createShader(type);

    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    
    console.log(GL.getShaderInfoLog(shader));

    return shader;
}


function updateCanvasSize() {
    CANVAS.height = window.innerHeight;
    CANVAS.width = window.innerWidth;

    GL.viewport(0, 0, GL.canvas.width, GL.canvas.height);
}


function initEventListeners() {
    window.addEventListener('resize', updateCanvasSize);
}


function draw(timeStamp) {
    GL.uniform1f(GL.getUniformLocation(PROGRAM, 'u_time'), timeStamp / 1000.0);
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(draw);
}
