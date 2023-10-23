import {InitializedBuffers, ProgramInfo} from "./types.ts";
import {Matrix4} from "./math/Matrix4.ts";
import {Vector3} from "./math/Vector3.ts";
import {Shader} from "./Shader.ts";

import {initializeBuffers} from "./buffer.ts";
import {loadTexture} from "./texture.ts";
import textureTest from "./../assets/textures/test.jpg";

export class Renderer {
    private readonly gl: WebGLRenderingContext;
    private readonly texture: WebGLTexture;
    private readonly shader: Shader;

    private programInfo: ProgramInfo;
    private buffers: InitializedBuffers;
    private cubeRotation: number;
    private then: number;

    constructor(gl: WebGLRenderingContext, shader: Shader) {
        this.gl = gl;

        this.texture = this.loadTexture(textureTest);
        this.shader = shader;

        this.programInfo = this.shader.getProgramInfo();
        this.buffers = this.initializeBuffers();
        this.cubeRotation = 0.0;
        this.then = 0;
    }

    public render = (): void => {
        const now: number = performance.now();
        const deltaTime: number = this.calculateDeltaTime(now);
        this.drawScene();
        this.updateCubeRotation(deltaTime);
        requestAnimationFrame(this.render);
    }

    private initializeBuffers(): InitializedBuffers {
        return initializeBuffers(this.gl);
    }

    private loadTexture(url: string): WebGLTexture {
        return loadTexture(this.gl, url);
    }

    private drawScene(): void {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        const fieldOfView: number = (45 * Math.PI) / 180; // in radians
        const aspect: number = this.gl.canvas.width / this.gl.canvas.height;

        const translationMatrix: Matrix4 = Matrix4.CreateTranslation(new Vector3(0.0, 0.0, 0.0));
        const rotationXMatrix: Matrix4 = Matrix4.CreateRotationX(this.cubeRotation * 0.3);
        const rotationYMatrix: Matrix4 = Matrix4.CreateRotationY(this.cubeRotation * 0.7);
        const rotationZMatrix: Matrix4 = Matrix4.CreateRotationZ(this.cubeRotation);

        const viewMatrix: Matrix4 = Matrix4.LookAt(new Vector3(0, 0, 60), new Vector3(0, 0, 0), Vector3.UnixY());
        const projectionMatrix: Matrix4 = Matrix4.Perspective(fieldOfView, aspect, 0.1, 1000.0);
        const modelMatrix: Matrix4 = this.createModelMatrix(rotationXMatrix, rotationYMatrix, rotationZMatrix, translationMatrix);
        const normalMatrix: Matrix4 = Matrix4.Transpose(Matrix4.Invese(modelMatrix));

        this.setPositionAttribute();
        this.setTextureAttribute();
        this.setNormalAttribute();

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

        this.gl.useProgram(this.programInfo.program);
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, modelMatrix.ToArray());
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.viewMatrix, false, viewMatrix.ToArray());
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix.ToArray());
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.normalMatrix, false, normalMatrix.ToArray());

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

        this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
    }

    private createModelMatrix(rotationXMatrix: Matrix4, rotationYMatrix: Matrix4, rotationZMatrix: Matrix4, translationMatrix: Matrix4): Matrix4 {
        return Matrix4.Multiply(Matrix4.Multiply(Matrix4.Multiply(rotationXMatrix, rotationYMatrix), rotationZMatrix), translationMatrix);
    }

    private updateCubeRotation(deltaTime: number): void {
        this.cubeRotation += deltaTime;
    }

    private calculateDeltaTime(now: number): number {
        now *= 0.001; // convert to seconds
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
