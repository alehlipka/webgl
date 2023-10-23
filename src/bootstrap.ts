import "./assets/styles/main.scss";

import {initializeProgram} from "./core/shader.ts";
import {InitializedBuffers, ProgramInfo} from "./core/types.ts";
import {initializeBuffers} from "./core/buffer.ts";
import {loadTexture} from "./core/texture.ts";

import textureTest from "./assets/textures/test.jpg";
import { Context } from "./core/Context.ts";
import {Renderer} from "./core/Renderer.ts";

import vertexShaderCode from './assets/shaders/vertex.glsl';
import fragmentShaderCode from './assets/shaders/fragment.glsl';

const glContext: Context = new Context('gl-canvas');
const gl: WebGLRenderingContext = glContext.getContext();

const shaderProgram: WebGLProgram = initializeProgram(gl, vertexShaderCode, fragmentShaderCode);
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

const renderer: Renderer = new Renderer(gl, programInfo, buffers, texture);
renderer.render(performance.now());
