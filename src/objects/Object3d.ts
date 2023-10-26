import {Matrix4} from "../core/math/Matrix4.ts";
import {Vector3} from "../core/math/Vector3.ts";
import {ProgramInfo} from "../core/types.ts";
import {FLOAT_SIZE, VERTEX_LENGTH} from "../core/constants.ts";
import {Loader} from "../core/Loader.ts";

export class Object3d {
    protected readonly gl: WebGL2RenderingContext;

    protected rotationXMatrix: Matrix4;
    protected rotationYMatrix: Matrix4;
    protected rotationZMatrix: Matrix4;
    protected translationMatrix: Matrix4;

    protected _position: Vector3;
    protected _rotation: Vector3;
    protected _scale: Vector3;
    protected modelMatrix: Matrix4;

    protected objectBufferArray: number[];
    protected indexBufferArray: number[];
    protected objectBuffer: WebGLBuffer;
    protected indexBuffer: WebGLBuffer;

    private readonly texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, position: Vector3, textureUrl: string, rotation: Vector3 = Vector3.Zero(), scale: Vector3 = Vector3.One()) {
        this.gl = gl;

        this._position = position;
        this._rotation = rotation;
        this._scale = scale;

        this.rotationXMatrix = Matrix4.CreateRotationX(this._rotation.X);
        this.rotationYMatrix = Matrix4.CreateRotationY(this._rotation.Y);
        this.rotationZMatrix = Matrix4.CreateRotationZ(this._rotation.Z);

        this.translationMatrix = Matrix4.CreateTranslation(this._position);

        this.modelMatrix = this.createModelMatrix();

        this.objectBufferArray = [];
        this.indexBufferArray = [];

        const objectBuffer: WebGLBuffer|null = this.gl.createBuffer();
        const indexBuffer: WebGLBuffer|null = this.gl.createBuffer();

        if (objectBuffer === null) throw new Error("Position buffer creation error");
        if (indexBuffer === null) throw new Error("Index buffer creation error");

        this.objectBuffer = objectBuffer;
        this.indexBuffer = indexBuffer;

        this.texture = Loader.loadTexture(this.gl, textureUrl);
    }

    public InitializeBuffers(): void {
        this.objectBufferArray = this.getObjectBuffer();
        this.indexBufferArray = this.getIndexBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.objectBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.objectBufferArray), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBufferArray), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public get position(): Vector3 {
        return this._position;
    }
    
    public set position(value: Vector3) {
        this._position = value;
        this.translationMatrix = Matrix4.CreateTranslation(this._position);
        this.createModelMatrix();
    }
    
    public get rotation(): Vector3 {
        return this._rotation;
    }
    
    public set rotation(value: Vector3) {
        this._rotation = value;
        this.rotationXMatrix = Matrix4.CreateRotationX(this._rotation.X);
        this.rotationYMatrix = Matrix4.CreateRotationY(this._rotation.Y);
        this.rotationZMatrix = Matrix4.CreateRotationZ(this._rotation.Z);
        this.createModelMatrix();
    }
    
    public get scale(): Vector3 {
        return this._scale;
    }
    
    public set scale(value: Vector3) {
        this._scale = value;
    }

    public resize(_width: number, _height: number): void {}

    public update(_elapsedSeconds: number): void {}

    public draw(_elapsedSeconds: number, programInfo: ProgramInfo): void {
        const stride: number = VERTEX_LENGTH * FLOAT_SIZE;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.objectBuffer);
        this.gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, stride, 0);
        this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        this.gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, this.gl.FLOAT, false, stride, 3 * FLOAT_SIZE);
        this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
        this.gl.vertexAttribPointer(programInfo.attribLocations.vertexTexture, 2, this.gl.FLOAT, false, stride, 6 * FLOAT_SIZE);
        this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexTexture);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, this.modelMatrix.ToArray());
        this.gl.drawElements(this.gl.TRIANGLES, this.indexBufferArray.length, this.gl.UNSIGNED_SHORT, 0);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    protected getObjectBuffer(): number[] {
        return [];
    }

    protected getIndexBuffer(): number[] {
        return [];
    }

    protected createModelMatrix(): Matrix4 {
        const rotation: Matrix4 = Matrix4.Multiply(Matrix4.Multiply(this.rotationZMatrix, this.rotationYMatrix), this.rotationXMatrix);
        this.modelMatrix = Matrix4.Multiply(rotation, this.translationMatrix);

        return this.modelMatrix;
    }
}