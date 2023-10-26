import {DrawInfo, perspectiveSettings, ProgramInfo} from "./types.ts";
import {Matrix4} from "./math/Matrix4.ts";
import {Vector3} from "./math/Vector3.ts";
import {Loader} from "./Loader.ts";
import {Buffer} from "./Buffer.ts";
import {FLOAT_SIZE, U_SHORT_SIZE, VERTEX_LENGTH} from "./constants.ts";

import textureTest from "./../assets/textures/debug.jpg";
import {Object3d} from "../objects/Object3d.ts";

export class Renderer {
    private readonly gl: WebGL2RenderingContext;
    private readonly texture: WebGLTexture;

    private programInfo: ProgramInfo;
    private then: number;

    private viewMatrix: Matrix4;
    private perspective: perspectiveSettings;
    private projectionMatrix: Matrix4;
    private objects: Object3d[];

    constructor(gl: WebGL2RenderingContext, programInfo: ProgramInfo) {
        this.gl = gl;
        this.objects = [];

        this.texture = Loader.loadTexture(this.gl, textureTest);

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
            object3d.Initialize();
        });

        Buffer.InitializeBuffers(this.gl);

        const stride: number = VERTEX_LENGTH * FLOAT_SIZE;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, Buffer.ObjectBuffer);

        this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, stride, 0);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);

        this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexNormal, 3, this.gl.FLOAT, false, stride, 3 * FLOAT_SIZE);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexNormal);

        this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexTexture, 2, this.gl.FLOAT, false, stride, 6 * FLOAT_SIZE);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexTexture);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, Buffer.IndexBuffer);


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

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, Buffer.IndexBuffer);

        let offset: number = 0;
        this.objects.forEach((object3d: Object3d): void => {
            const drawInfo: DrawInfo = object3d.drawInfo(elapsedSeconds);
            this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, drawInfo.modelMatrix.ToArray());
            this.gl.drawElements(
                this.gl.TRIANGLES,
                drawInfo.elementsCount,
                this.gl.UNSIGNED_SHORT,
                offset * U_SHORT_SIZE
            );

            offset += drawInfo.elementsCount;
        });

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    private getDeltaTime(): number {
        const now: number = performance.now() * 0.001; // convert to seconds
        const deltaTime: number = now - this.then;
        this.then = now;

        return deltaTime;
    }
}
