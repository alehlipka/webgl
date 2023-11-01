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

import debugTexture1Url from "./assets/textures/debug/dark/texture_13.png";
import debugTexture2Url from "./assets/textures/debug/green/texture_01.png";
import debugTexture3Url from "./assets/textures/debug/orange/texture_01.png";
import debugTexture4Url from "./assets/textures/debug/purple/texture_01.png";
import debugTexture5Url from "./assets/textures/debug/red/texture_01.png";
import debugTexture6Url from "./assets/textures/debug/light/texture_12.png";

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
	.addObject(new Terrain(gl, new Vector3(0, -3, 0), <string>debugTexture1Url, new Vector2(20)))
	.addObjects([
		new Cube(gl, new Vector3(-1, +1, 0), <string>debugTexture2Url, Vector3.One()),
		new Cube(gl, new Vector3(+1, +1, 0), <string>debugTexture3Url, Vector3.One()),
		new Cube(gl, new Vector3(+1, -1, 0), <string>debugTexture5Url, Vector3.One()),
		new Cube(gl, new Vector3(-1, -1, 0), <string>debugTexture6Url, Vector3.One())
	])
	.addObject(new Plane(gl, new Vector3(0, -2, 0), <string>debugTexture4Url, new Vector2(15)))
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
