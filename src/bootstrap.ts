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

import debugTextureUrl from "./assets/textures/debug.png";
import raccoonTextureUrl from "./assets/textures/raccoon.jpg";
import { Terrain } from "./objects/Terrain.ts";
import { Camera } from "./core/Camera.ts";
import { MathHelper } from "./core/math/MathHelper.ts";

const glContext: Context = new Context("gl-canvas");
const gl: WebGL2RenderingContext = glContext.getContext();

const shaders: shaderCodes = {
  vertex: vertexShaderCode,
  fragment: fragmentShaderCode,
};
const shader: Shader = new Shader(gl, shaders);
const shaderProgramInfo: ProgramInfo = shader.getProgramInfo();

const camera: Camera = new Camera(
  gl,
  gl.canvas.width / gl.canvas.height,
  MathHelper.ToRadians(45),
  0.1,
  1000,
);

const renderer: Renderer = new Renderer(gl, shaderProgramInfo, camera);
renderer
  .addObject(
    new Terrain(gl, new Vector3(0, -3, 0), <string>debugTextureUrl, new Vector2(10)),
  )
  .addObjects([
    new Cube(gl, new Vector3(-1, +1, 0), <string>raccoonTextureUrl, Vector3.One()),
    new Cube(gl, new Vector3(+1, +1, 0), <string>raccoonTextureUrl, Vector3.One()),
    new Plane(gl, new Vector3(0, +0, 0), <string>raccoonTextureUrl, new Vector2(5)),
    new Cube(gl, new Vector3(+1, -1, 0), <string>raccoonTextureUrl, Vector3.One()),
    new Cube(gl, new Vector3(-1, -1, 0), <string>raccoonTextureUrl, Vector3.One()),
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
