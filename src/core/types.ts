import {Vector3} from "./math/Vector3.ts";
import {Vector2} from "./math/Vector2.ts";

export type PositionNormalTextureVertex = {
    position: Vector3,
    normal: Vector3,
    texture: Vector2,
}

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
