import { InitializedBuffers, ProgramInfo } from "./types";
import { Matrix4 } from "./math/Matrix4.ts";
import { Vector3 } from "./math/Vector3.ts";

export function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: InitializedBuffers, texture: WebGLTexture, cubeRotation: number): void {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const fieldOfView: number = (45 * Math.PI) / 180; // in radians
    const aspect: number = gl.canvas.width / gl.canvas.height;

    const translationMatrix: Matrix4 = Matrix4.CreateTranslation(new Vector3(0.0, 0.0, 0.0));
    const rotationXMatrix: Matrix4 = Matrix4.CreateRotationX(cubeRotation * 0.3);
    const rotationYMatrix: Matrix4 = Matrix4.CreateRotationY(cubeRotation * 0.7);
    const rotationZMatrix: Matrix4 = Matrix4.CreateRotationZ(cubeRotation);

    const viewMatrix: Matrix4 = Matrix4.LookAt(new Vector3(0, 0, 60), new Vector3(0, 0, 0), Vector3.UnixY());
    const projectionMatrix: Matrix4 = Matrix4.Perspective(fieldOfView, aspect, 0.1, 1000.0);
    let modelMatrix: Matrix4 = Matrix4.Multiply(rotationXMatrix, rotationYMatrix);
    modelMatrix = Matrix4.Multiply(modelMatrix, rotationZMatrix);
    modelMatrix = Matrix4.Multiply(modelMatrix, translationMatrix);
    const normalMatrix: Matrix4 = Matrix4.Transpose(Matrix4.Invese(modelMatrix));

    setPositionAttribute(gl, programInfo, buffers);
    setTextureAttribute(gl, programInfo, buffers);
    setNormalAttribute(gl, programInfo, buffers);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, modelMatrix.ToArray());
    gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix.ToArray());
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix.ToArray());
    gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix.ToArray());

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    {
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}

function setPositionAttribute(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: InitializedBuffers): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setNormalAttribute(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: InitializedBuffers): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

function setTextureAttribute(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: InitializedBuffers): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoords);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoords, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoords);
}
