import "./assets/styles/main.scss";

import {shaderCodes} from "./core/types.ts";
import {Context} from "./core/Context.ts";
import {Renderer} from "./core/Renderer.ts";

import vertexShaderCode from './assets/shaders/vertex.glsl';
import fragmentShaderCode from './assets/shaders/fragment.glsl';
import {Shader} from "./core/Shader.ts";

const shaders: shaderCodes = {
    vertex: vertexShaderCode,
    fragment: fragmentShaderCode
};

const glContext: Context = new Context('gl-canvas');
const gl: WebGLRenderingContext = glContext.getContext();

const shader: Shader = new Shader(gl, shaders);

new Renderer(gl, shader).render();
