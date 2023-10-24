import "./assets/styles/main.scss";

import {shaderCodes} from "./core/types.ts";
import {Vector3} from "./core/math/Vector3.ts";

import {Context} from "./core/Context.ts";
import {Renderer} from "./core/Renderer.ts";
import {Shader} from "./core/Shader.ts";
import {Cube} from "./objects/Cube.ts";

import vertexShaderCode from './assets/shaders/vertex.glsl';
import fragmentShaderCode from './assets/shaders/fragment.glsl';

const glContext: Context = new Context('gl-canvas');
const gl: WebGLRenderingContext = glContext.getContext();

const shaders: shaderCodes = {vertex: vertexShaderCode, fragment: fragmentShaderCode};
const shader: Shader = new Shader(gl, shaders);

const renderer: Renderer = new Renderer(gl, shader);
renderer.addObject(new Cube(Vector3.Zero()));
renderer.run();

window.addEventListener('load', (): void => {
    glContext.OnLoad(window.innerWidth, window.innerHeight);
    renderer.resize(window.innerWidth, window.innerHeight);
});
window.addEventListener('resize', (): void => {
    glContext.OnResize(window.innerWidth, window.innerHeight);
    renderer.resize(window.innerWidth, window.innerHeight);
});
window.addEventListener('dblclick', (): void => {
    glContext.OnFullscreen(window.innerWidth, window.innerHeight);
    renderer.resize(window.innerWidth, window.innerHeight);
});
