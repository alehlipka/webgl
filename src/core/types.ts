export type InitializedBuffers = {
    position: WebGLBuffer,
    normal: WebGLBuffer,
    textureCoords: WebGLBuffer,
    indices: WebGLBuffer,
};

export type shaderCodes = {
    vertex: string,
    fragment: string
};

export type ProgramInfo = {
    program: WebGLProgram,
    attribLocations: AttributeLocations,
    uniformLocations: UniformLocations,
};

export type perspectiveSettings = {
    aspect: number,
    fov: number,
    near: number,
    far: number,
};

type AttributeLocations = {
    vertexPosition: number,
    vertexNormal: number,
    textureCoords: number,
};

type UniformLocations = {
    projectionMatrix: WebGLUniformLocation|null,
    modelMatrix: WebGLUniformLocation|null,
    viewMatrix: WebGLUniformLocation|null,
    normalMatrix: WebGLUniformLocation|null,
    uSampler: WebGLUniformLocation|null,
};
