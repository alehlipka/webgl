import "./assets/styles/main.scss";

import {ProgramInfo, shaderCodes} from "./core/types.ts";
import {Vector2} from "./core/math/Vector2.ts";
import {Vector3} from "./core/math/Vector3.ts";

import {Context} from "./core/Context.ts";
import {Renderer} from "./core/Renderer.ts";
import {Shader} from "./core/Shader.ts";
import {Cube} from "./objects/Cube.ts";
import {Plane} from "./objects/Plane.ts";

import vertexShaderCode from './assets/shaders/vertex.glsl';
import fragmentShaderCode from './assets/shaders/fragment.glsl';

import textureDebug from "./assets/textures/debug.jpg";
import textureTest from "./assets/textures/test.jpg";

const glContext: Context = new Context('gl-canvas');
const gl: WebGL2RenderingContext = glContext.getContext();

const shaders: shaderCodes = {vertex: vertexShaderCode, fragment: fragmentShaderCode};
const shader: Shader = new Shader(gl, shaders);
const shaderProgramInfo: ProgramInfo = shader.getProgramInfo();

const renderer: Renderer = new Renderer(gl, shaderProgramInfo);
renderer
    .addObjects([
        new Cube(gl, new Vector3(-1, +1, 0), textureTest,  Vector3.One()),
        new Cube(gl, new Vector3(+1, +1, 0), textureTest, Vector3.One()),
        new Plane(gl, new Vector3(0, +0, 0), textureDebug, new Vector2(2,2)),
        new Cube(gl, new Vector3(+1, -1, 0), textureTest, Vector3.One()),
        new Cube(gl, new Vector3(-1, -1, 0), textureTest, Vector3.One()),
    ])
    .initialize()
    .run();

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
