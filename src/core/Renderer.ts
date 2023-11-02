import { ProgramInfo } from "./types.ts";
import { Object3d } from "./../objects/Object3d.ts";
import { Camera } from "./Camera.ts";
import { Vector3 } from "./math/Vector3.ts";
import { Stats, StatsMode } from "./Stats.ts";

export class Renderer {
	private readonly gl: WebGL2RenderingContext;
	private readonly programInfo: ProgramInfo;

	private then: number;
	private objects: Object3d[];
	private camera: Camera;
	private stats: Stats;

	constructor(gl: WebGL2RenderingContext, programInfo: ProgramInfo, camera: Camera) {
		this.gl = gl;
		this.programInfo = programInfo;
		this.camera = camera;

		this.objects = [];
		this.then = 0;

		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.enable(this.gl.BLEND);

		this.gl.frontFace(this.gl.CCW);
		this.gl.cullFace(this.gl.BACK);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		this.gl.useProgram(this.programInfo.program);

		this.stats = new Stats(StatsMode.MS, 5, 5);
		document.body.appendChild(this.stats.container);
	}

	public addObject(object3d: Object3d): this {
		this.objects.push(object3d);

		return this;
	}

	public addObjects(objects3d: Object3d[]): this {
		objects3d.forEach((object3d: Object3d): void => {
			this.objects.push(object3d);
		});

		return this;
	}

	public initialize(): this {
		this.objects.forEach((object3d: Object3d): void => {
			object3d.InitializeBuffers();
		});

		return this;
	}

	public run = (): void => {
		this.stats.begin();

		const delta: number = this.getDeltaTime();
		this.update(delta);
		this.draw(delta);
		requestAnimationFrame(this.run);

		this.stats.end();
	};

	public resize(width: number, height: number): void {
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

		this.camera.resize(width, height);
		this.gl.uniformMatrix4fv(
			this.programInfo.uniformLocations.projectionMatrix,
			false,
			this.camera.getProjectionMatrix().ToArray()
		);

		this.objects.forEach((object3d: Object3d): void => {
			object3d.resize(width, height);
		});
	}

	private update(elapsedSeconds: number): void {
		this.gl.uniformMatrix4fv(
			this.programInfo.uniformLocations.viewMatrix,
			false,
			this.camera.getViewMatrix().ToArray()
		);
		this.gl.uniformMatrix4fv(
			this.programInfo.uniformLocations.projectionMatrix,
			false,
			this.camera.getProjectionMatrix().ToArray()
		);

		const cameraPosition: Vector3 = this.camera.getPosition();
		this.gl.uniform3fv(
			this.programInfo.uniformLocations.cameraPosition,
			new Float32Array([cameraPosition.X, cameraPosition.Y, cameraPosition.Z])
		);

		this.objects.forEach((object3d: Object3d): void => {
			object3d.update(elapsedSeconds);
		});
	}

	private draw(elapsedSeconds: number): void {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.objects.forEach((object3d: Object3d): void => {
			object3d.draw(elapsedSeconds, this.programInfo);
		});
	}

	private getDeltaTime(): number {
		const now: number = performance.now() * 0.001; // convert to seconds
		const deltaTime: number = now - this.then;
		this.then = now;

		return deltaTime;
	}
}
