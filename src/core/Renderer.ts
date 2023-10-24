import {InitializedBuffers, perspectiveSettings, ProgramInfo} from "./types.ts";
import {Matrix4} from "./math/Matrix4.ts";
import {Vector3} from "./math/Vector3.ts";
import {Shader} from "./Shader.ts";
import {Loader} from "./Loader.ts";

import {initializeBuffers} from "./buffer_old.ts";
import textureTest from "./../assets/textures/test.jpg";
import {Object3d} from "../objects/Object3d.ts";

export class Renderer {
    private readonly gl: WebGLRenderingContext;
    private readonly texture: WebGLTexture;
    private readonly shader: Shader;

    private programInfo: ProgramInfo;
    private buffers: InitializedBuffers;
    private cubeRotation: number;
    private then: number;

    private viewMatrix: Matrix4;
    private perspective: perspectiveSettings;
    private projectionMatrix: Matrix4;
    private objects: Object3d[];

    constructor(gl: WebGLRenderingContext, shader: Shader) {
        this.gl = gl;
        this.objects = [];

        this.texture = Loader.loadTexture(this.gl, textureTest);
        this.shader = shader;

        this.programInfo = this.shader.getProgramInfo();
        this.buffers = this.initializeBuffers();
        this.cubeRotation = 0.0;
        this.then = 0;

        this.perspective = {
            aspect: this.gl.canvas.width / this.gl.canvas.height,
            fov: (45 * Math.PI) / 180,
            near:  0.1,
            far: 10000.0,
        };

        this.projectionMatrix = Matrix4.Perspective(this.perspective.fov, this.perspective.aspect, this.perspective.near, this.perspective.far);
        this.viewMatrix = Matrix4.LookAt(new Vector3(0, 0, 60), new Vector3(0, 0, 0), Vector3.UnixY());
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.BLEND);

        this.gl.frontFace(this.gl.CCW);
        this.gl.cullFace(this.gl.BACK);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    }

    public addObject(object3d: Object3d): this {
        this.objects.push(object3d);

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

        this.objects.forEach((object3d: Object3d): void => {
            object3d.resize(width, height);
        });
    }

    private update(elapsedSeconds: number): void {
        this.cubeRotation += elapsedSeconds;

        this.objects.forEach((object3d: Object3d): void => {
            object3d.update(elapsedSeconds);
        });
    }

    private draw(elapsedSeconds: number): void {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.drawScene();

        this.objects.forEach((object3d: Object3d): void => {
            object3d.draw(elapsedSeconds);
        });
    }

    private initializeBuffers(): InitializedBuffers {
        return initializeBuffers(this.gl);
    }
    private drawScene(): void {
        const translationMatrix: Matrix4 = Matrix4.CreateTranslation(new Vector3(0.0, 0.0, 0.0));
        const rotationXMatrix: Matrix4 = Matrix4.CreateRotationX(this.cubeRotation * 0.3);
        const rotationYMatrix: Matrix4 = Matrix4.CreateRotationY(this.cubeRotation * 0.7);
        const rotationZMatrix: Matrix4 = Matrix4.CreateRotationZ(this.cubeRotation);

        const modelMatrix: Matrix4 = this.createModelMatrix(rotationXMatrix, rotationYMatrix, rotationZMatrix, translationMatrix);
        const normalMatrix: Matrix4 = Matrix4.Transpose(Matrix4.Invese(modelMatrix));

        this.setPositionAttribute();
        this.setTextureAttribute();
        this.setNormalAttribute();

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

        this.gl.useProgram(this.programInfo.program);
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, modelMatrix.ToArray());
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.viewMatrix, false, this.viewMatrix.ToArray());
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, this.projectionMatrix.ToArray());
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.normalMatrix, false, normalMatrix.ToArray());

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

        this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
    }
    private createModelMatrix(rotationXMatrix: Matrix4, rotationYMatrix: Matrix4, rotationZMatrix: Matrix4, translationMatrix: Matrix4): Matrix4 {
        return Matrix4.Multiply(Matrix4.Multiply(Matrix4.Multiply(rotationXMatrix, rotationYMatrix), rotationZMatrix), translationMatrix);
    }

    private getDeltaTime(): number {
        const now: number = performance.now() * 0.001; // convert to seconds
        const deltaTime: number = now - this.then;
        this.then = now;

        return deltaTime;
    }
    private setAttribute(attributeLocation: number, buffer: WebGLBuffer, size: number): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.vertexAttribPointer(attributeLocation, size, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(attributeLocation);
    }
    private setPositionAttribute(): void {
        this.setAttribute(this.programInfo.attribLocations.vertexPosition, this.buffers.position, 3);
    }
    private setNormalAttribute(): void {
        this.setAttribute(this.programInfo.attribLocations.vertexNormal, this.buffers.normal, 3);
    }
    private setTextureAttribute(): void {
        this.setAttribute(this.programInfo.attribLocations.textureCoords, this.buffers.textureCoords, 2);
    }
}
