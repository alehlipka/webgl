import "./assets/styles/main.scss";

import { ProgramInfo, shaderCodes } from "./core/types.ts";
import { Vector2 } from "./core/math/Vector2.ts";
import { Vector3 } from "./core/math/Vector3.ts";

import { Context } from "./core/Context.ts";
import { Renderer } from "./core/Renderer.ts";
import { Shader } from "./core/Shader.ts";
import { Cube } from "./objects/Cube.ts";
import { Plane } from "./objects/Plane.ts";

import vertexShaderCode from "./assets/shaders/vertex.glsl";
import fragmentShaderCode from "./assets/shaders/fragment.glsl";

import blueTextureUrl from "./assets/textures/debug/blue.png";
import greenTextureUrl from "./assets/textures/debug/green.png";
import greyTextureUrl from "./assets/textures/debug/grey.png";
import redTextureUrl from "./assets/textures/debug/red.png";
import violetTextureUrl from "./assets/textures/debug/violet.png";

import hmTextureUrl from "./assets/textures/hm.png";
import { Terrain } from "./objects/Terrain.ts";
import { Camera } from "./core/Camera.ts";
import { MathHelper } from "./core/math/MathHelper.ts";
import { Loader } from "./core/Loader.ts";

const glContext: Context = new Context("gl-canvas");
const gl: WebGL2RenderingContext = glContext.getContext();

const hm: number[][] = Loader.loadHeighMapArray(hmTextureUrl);
console.log(hm);

const shaders: shaderCodes = {
	vertex: vertexShaderCode,
	fragment: fragmentShaderCode
};
const shader: Shader = new Shader(gl, shaders);
const shaderProgramInfo: ProgramInfo = shader.getProgramInfo();

const camera: Camera = new Camera(gl, gl.canvas.width / gl.canvas.height, MathHelper.ToRadians(45), 0.1, 1000);

const renderer: Renderer = new Renderer(gl, shaderProgramInfo, camera);
renderer
	.addObjects([
		new Terrain(gl, new Vector3(0, -5, 0), <string>hmTextureUrl, new Vector2(20)),
		new Cube(gl, Vector3.Zero(), <string>greyTextureUrl, new Vector3(0.1)),
		new Cube(gl, new Vector3(-1, +1, 0), <string>redTextureUrl, Vector3.One()),
		new Cube(gl, new Vector3(+1, +1, 0), <string>greenTextureUrl, Vector3.One()),
		new Cube(gl, new Vector3(+1, -1, 0), <string>violetTextureUrl, Vector3.One()),
		new Cube(gl, new Vector3(-1, -1, 0), <string>blueTextureUrl, Vector3.One()),
		new Plane(gl, new Vector3(0, -2, 0), <string>blueTextureUrl, new Vector2(7)),
		new Plane(gl, new Vector3(0, -3, 0), <string>greyTextureUrl, new Vector2(14))
	])
	.initialize()
	.run();

window.addEventListener("load", (): void => {
	glContext.OnLoad(window.innerWidth, window.innerHeight);
	renderer.resize(window.innerWidth, window.innerHeight);
});
window.addEventListener("resize", (): void => {
	glContext.OnResize(window.innerWidth, window.innerHeight);
	renderer.resize(window.innerWidth, window.innerHeight);
});
