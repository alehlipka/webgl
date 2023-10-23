export function initializeProgram(gl: WebGLRenderingContext, vertexShaderCode: string, fragmentShaderCode: string): WebGLProgram {
    const vertexShader: WebGLShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
    const fragmentShader: WebGLShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);

    const shaderProgram: WebGLProgram | null = gl.createProgram();
    if (shaderProgram === null) throw new Error("Shader program creation error");

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return shaderProgram;
}

function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader: WebGLShader | null = gl.createShader(type);
    if (shader === null) throw new Error("Shader creation error");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    }

    return shader;
}
