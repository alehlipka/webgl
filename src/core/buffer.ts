import {InitializedBuffers} from "./types";

export function initializeBuffers(gl: WebGLRenderingContext): InitializedBuffers {
    const positionBuffer: WebGLBuffer = initializePositionBuffer(gl);
    const normalBuffer: WebGLBuffer = initializeNormalBuffer(gl);
    const indexBuffer: WebGLBuffer = initializeIndexBuffer(gl);
    const textureCoordsBuffer: WebGLBuffer = initializeTextureBuffer(gl);

    return {
        position: positionBuffer,
        normal: normalBuffer,
        textureCoords: textureCoordsBuffer,
        indices: indexBuffer,
    };
}

function initializePositionBuffer(gl: WebGLRenderingContext): WebGLBuffer {
    const positionBuffer: WebGLBuffer | null = gl.createBuffer();
    if (positionBuffer === null) throw new Error("Position buffer creation error");

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions: number[] = [
        // Front face
        -10.0, -10.0, 10.0, 10.0, -10.0, 10.0, 10.0, 10.0, 10.0, -10.0, 10.0, 10.0,
        // Back face
        -10.0, -10.0, -10.0, -10.0, 10.0, -10.0, 10.0, 10.0, -10.0, 10.0, -10.0, -10.0,
        // Top face
        -10.0, 10.0, -10.0, -10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, -10.0,
        // Bottom face
        -10.0, -10.0, -10.0, 10.0, -10.0, -10.0, 10.0, -10.0, 10.0, -10.0, -10.0, 10.0,
        // Right face
        10.0, -10.0, -10.0, 10.0, 10.0, -10.0, 10.0, 10.0, 10.0, 10.0, -10.0, 10.0,
        // Left face
        -10.0, -10.0, -10.0, -10.0, -10.0, 10.0, -10.0, 10.0, 10.0, -10.0, 10.0, -10.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

function initializeNormalBuffer(gl: WebGLRenderingContext): WebGLBuffer {
    const normalBuffer = gl.createBuffer();
    if (normalBuffer === null) throw new Error("Normal buffer creation error");
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    const vertexNormals: number[] = [
        // Front
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        // Back
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
        // Top
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        // Bottom
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        // Right
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // Left
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

    return normalBuffer;
}

function initializeTextureBuffer(gl: WebGLRenderingContext): WebGLBuffer {
    const textureCoordsBuffer: WebGLBuffer | null = gl.createBuffer();
    if (textureCoordsBuffer === null) throw new Error("Texture buffer creation error");
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordsBuffer);

    const textureCoordinates: number[] = [
        // Front
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Back
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Top
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Bottom
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Right
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Left
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    return textureCoordsBuffer;
}

function initializeIndexBuffer(gl: WebGLRenderingContext): WebGLBuffer {
    const indexBuffer: WebGLBuffer | null = gl.createBuffer();
    if (indexBuffer === null) throw new Error("Index buffer creation error");

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const indices: number[] = [
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // back
        8, 9, 10, 8, 10, 11, // top
        12, 13, 14, 12, 14, 15, // bottom
        16, 17, 18, 16, 18, 19, // right
        20, 21, 22, 20, 22, 23, // left
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return indexBuffer;
}
