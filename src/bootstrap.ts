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

import debugTexture1Url from "./assets/textures/debug/blue.png";
import debugTexture2Url from "./assets/textures/debug/dark.png";
import debugTexture3Url from "./assets/textures/debug/green.png";
import debugTexture4Url from "./assets/textures/debug/light.png";
import debugTexture5Url from "./assets/textures/debug/orange.png";
import debugTexture6Url from "./assets/textures/debug/pink.png";
import debugTexture7Url from "./assets/textures/debug/red.png";
import debugTexture8Url from "./assets/textures/debug/yellow.png";

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
		new Terrain(gl, new Vector3(0, -5, 0), <string>debugTexture1Url, new Vector2(20)),
		new Cube(gl, new Vector3(-1, +1, 1), <string>debugTexture2Url, Vector3.One()),
		new Cube(gl, new Vector3(+1, +1, -1), <string>debugTexture3Url, Vector3.One()),
		new Cube(gl, new Vector3(+1, -1, 1), <string>debugTexture4Url, Vector3.One()),
		new Cube(gl, new Vector3(-1, -1, -1), <string>debugTexture5Url, Vector3.One()),
		new Plane(gl, new Vector3(0, -2, 0), <string>debugTexture6Url, new Vector2(5)),
		new Plane(gl, new Vector3(0, -3, 0), <string>debugTexture7Url, new Vector2(10)),
		new Plane(gl, new Vector3(0, -4, 0), <string>debugTexture8Url, new Vector2(15))
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
