import {InitializedBuffers, ProgramInfo} from "./types.ts";
import {Matrix4} from "./math/Matrix4.ts";
import {Vector3} from "./math/Vector3.ts";

export class Renderer {
    private gl: WebGLRenderingContext;
    private programInfo: ProgramInfo;
    private buffers: InitializedBuffers;
    private texture: WebGLTexture;
    private cubeRotation: number;
    private then: number;

    constructor(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: InitializedBuffers, texture: WebGLTexture) {
        this.gl = gl;
        this.programInfo = programInfo;
        this.buffers = buffers;
        this.texture = texture;
        this.cubeRotation = 0.0;
        this.then = 0;
    }

    public render(now: number): void {
        const deltaTime: number = this.calculateDeltaTime(now);
        this.drawScene();
        this.updateCubeRotation(deltaTime);
        requestAnimationFrame(this.render.bind(this));
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
        let modelMatrix: Matrix4 = Matrix4.Multiply(rotationXMatrix, rotationYMatrix);
        modelMatrix = Matrix4.Multiply(modelMatrix, rotationZMatrix);
        modelMatrix = Matrix4.Multiply(modelMatrix, translationMatrix);
        const normalMatrix: Matrix4 = Matrix4.Transpose(Matrix4.Invese(modelMatrix));

        this.setPositionAttribute(this.gl, this.programInfo, this.buffers);
        this.setTextureAttribute(this.gl, this.programInfo, this.buffers);
        this.setNormalAttribute(this.gl, this.programInfo, this.buffers);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

        this.gl.useProgram(this.programInfo.program);
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, modelMatrix.ToArray());
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.viewMatrix, false, viewMatrix.ToArray());
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix.ToArray());
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.normalMatrix, false, normalMatrix.ToArray());

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

        {
            this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
        }
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

    private setPositionAttribute(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: InitializedBuffers): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    private setNormalAttribute(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: InitializedBuffers): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
    }

    private setTextureAttribute(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: InitializedBuffers): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoords);
        gl.vertexAttribPointer(programInfo.attribLocations.textureCoords, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoords);
    }
}
