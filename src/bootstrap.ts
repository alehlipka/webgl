import "./styles/main.scss";

import { ProgramInfo, shaderCodes } from "./core/types.ts";
import { Vector2 } from "./core/math/Vector2.ts";
import { Vector3 } from "./core/math/Vector3.ts";
import { Context } from "./core/Context.ts";
import { Renderer } from "./core/Renderer.ts";
import { Shader } from "./core/Shader.ts";
import { Cube } from "./objects/Cube.ts";
import { Plane } from "./objects/Plane.ts";
import { Terrain } from "./objects/Terrain.ts";
import { Camera } from "./core/Camera.ts";
import { MathHelper } from "./core/math/MathHelper.ts";

import vertexShaderCode from "./shaders/vertex.glsl";
import fragmentShaderCode from "./shaders/fragment.glsl";

const glContext: Context = new Context("gl-canvas");
const gl: WebGL2RenderingContext = glContext.getContext();

const shaders: shaderCodes = {
	vertex: vertexShaderCode,
	fragment: fragmentShaderCode
};
const shader: Shader = new Shader(gl, shaders);
const shaderProgramInfo: ProgramInfo = shader.getProgramInfo();
const camera: Camera = new Camera(gl, gl.canvas.width / gl.canvas.height, MathHelper.ToRadians(45), 0.1, 10000);

const renderer: Renderer = new Renderer(gl, shaderProgramInfo, camera);
renderer.addObject(
	new Terrain(gl, new Vector3(-50, 0, -50), "assets/textures/hm.png", "assets/textures/debug/grey.png")
);
renderer.addObjects([
	new Cube(gl, new Vector3(-0.8, 6, 0), "assets/textures/debug/blue.png", Vector3.One()),
	new Cube(gl, new Vector3(+0.8, 6, 0), "assets/textures/debug/green.png", Vector3.One()),
	new Cube(gl, new Vector3(+0.8, 4, 0), "assets/textures/debug/grey.png", Vector3.One()),
	new Cube(gl, new Vector3(-0.8, 4, 0), "assets/textures/debug/red.png", Vector3.One()),
	new Plane(gl, new Vector3(0, 3, 0), "assets/textures/debug/violet.png", new Vector2(4)),
	new Cube(gl, new Vector3(0, 5, 0), "assets/textures/debug/light.png", new Vector3(0.2))
]);
renderer.initialize().then(() => {
	renderer.run();

	window.addEventListener("load", (): void => {
		glContext.OnLoad(window.innerWidth, window.innerHeight);
		renderer.resize(window.innerWidth, window.innerHeight);
	});
	window.addEventListener("resize", (): void => {
		glContext.OnResize(window.innerWidth, window.innerHeight);
		renderer.resize(window.innerWidth, window.innerHeight);
	});
});
