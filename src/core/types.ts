import { Matrix4 } from "./math/Matrix4";

export type DrawInfo = {
    modelMatrix: Matrix4,
    elementsCount: number,
};

export type shaderCodes = {
    vertex: string,
    fragment: string
};

export type perspectiveSettings = {
    aspect: number,
    fov: number,
    near: number,
    far: number,
};

export type ProgramInfo = {
    program: WebGLProgram,
    attribLocations: AttributeLocations,
    uniformLocations: UniformLocations,
};

type AttributeLocations = {
    vertexPosition: number,
    vertexNormal: number,
    vertexTexture: number,
};

type UniformLocations = {
    projectionMatrix: WebGLUniformLocation|null,
    modelMatrix: WebGLUniformLocation|null,
    viewMatrix: WebGLUniformLocation|null,
    uSampler: WebGLUniformLocation|null,
};
