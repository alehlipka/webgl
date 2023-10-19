export type InitializedBuffers = {
    position: WebGLBuffer,
    normal: WebGLBuffer,
    textureCoords: WebGLBuffer,
    indices: WebGLBuffer,
};

export type ProgramInfo = {
    program: WebGLProgram,
    attribLocations: {
        vertexPosition: number,
        vertexNormal: number,
        textureCoords: number,
    },
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation|null,
        modelMatrix: WebGLUniformLocation|null,
        viewMatrix: WebGLUniformLocation|null,
        normalMatrix: WebGLUniformLocation|null,
        uSampler: WebGLUniformLocation|null,
    },
};
