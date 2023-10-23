import "./assets/styles/main.scss";
import {Context} from "./core/Context.ts";
import {Renderer} from "./core/Renderer.ts";

const glContext: Context = new Context('gl-canvas');
const gl: WebGLRenderingContext = glContext.getContext();
const renderer: Renderer = new Renderer(gl);
renderer.render();
