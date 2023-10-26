import {perspectiveSettings, ProgramInfo} from "./types.ts";
import {Matrix4} from "./math/Matrix4.ts";
import {Vector3} from "./math/Vector3.ts";
import {Object3d} from "../objects/Object3d.ts";

export class Renderer {
    private readonly gl: WebGL2RenderingContext;

    private programInfo: ProgramInfo;
    private then: number;

    private viewMatrix: Matrix4;
    private perspective: perspectiveSettings;
    private projectionMatrix: Matrix4;
    private objects: Object3d[];

    constructor(gl: WebGL2RenderingContext, programInfo: ProgramInfo) {
        this.gl = gl;
        this.objects = [];

        this.programInfo = programInfo;
        this.then = 0;

        this.perspective = {
            aspect: this.gl.canvas.width / this.gl.canvas.height,
            fov: (45 * Math.PI) / 180,
            near:  0.1,
            far: 10000.0,
        };

        this.projectionMatrix = Matrix4.Perspective(this.perspective.fov, this.perspective.aspect, this.perspective.near, this.perspective.far);
        this.viewMatrix = Matrix4.LookAt(new Vector3(0, 0, 6), new Vector3(0, 0, 0), Vector3.UnixY());
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        // this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.BLEND);

        this.gl.frontFace(this.gl.CCW);
        this.gl.cullFace(this.gl.BACK);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

        this.gl.useProgram(this.programInfo.program);
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.viewMatrix, false, this.viewMatrix.ToArray());
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, this.projectionMatrix.ToArray());
    }

    public addObject(object3d: Object3d): this {
        this.objects.push(object3d);

        return this;
    }

    public initialize(): this {
        this.objects.forEach((object3d: Object3d): void => {
            object3d.InitializeBuffers();
        });

        return this;
    }

    public run = (): void => {
        const delta: number = this.getDeltaTime();

        this.update(delta);
        this.draw(delta);

        requestAnimationFrame(this.run);
    }

    public resize(width: number, height: number): void {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.perspective.aspect = width / height;
        this.projectionMatrix = Matrix4.Perspective(
            this.perspective.fov,
            this.perspective.aspect,
            this.perspective.near,
            this.perspective.far
        );

        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, this.projectionMatrix.ToArray());

        this.objects.forEach((object3d: Object3d): void => {
            object3d.resize(width, height);
        });
    }

    private update(elapsedSeconds: number): void {
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
