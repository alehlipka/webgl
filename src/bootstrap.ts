import "./assets/styles/main.scss";

import {initializeProgram} from "./core/shader.ts";
import {InitializedBuffers, ProgramInfo} from "./core/types.ts";
import {initializeBuffers} from "./core/buffer.ts";
import {drawScene} from "./core/draw.ts";
import {loadTexture} from "./core/texture.ts";

import textureTest from "./assets/textures/test.jpg";
import { Context } from "./core/Context.ts";

const glContext: Context = new Context('gl-canvas');
const gl = glContext.getContext();

let cubeRotation: number = 0.0;
let deltaTime: number = 0;

const shaderProgram: WebGLProgram = initializeProgram(gl);
const programInfo: ProgramInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
        textureCoords: gl.getAttribLocation(shaderProgram, "aTextureCoords"),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        modelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
        viewMatrix: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
        normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
        uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
    },
};
const buffers: InitializedBuffers = initializeBuffers(gl);
const texture: WebGLTexture = loadTexture(gl, textureTest);

let then: number = 0;
function render(now: number): void {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, texture, cubeRotation);
    cubeRotation += deltaTime;

    requestAnimationFrame(render);
}

requestAnimationFrame(render);
