import {Matrix4} from "../core/math/Matrix4.ts";
import {Vector3} from "../core/math/Vector3.ts";
import {Buffer} from "../core/Buffer.ts";
import { DrawInfo } from "../core/types.ts";

export class Object3d {
    protected readonly gl: WebGLRenderingContext;

    protected rotationXMatrix: Matrix4;
    protected rotationYMatrix: Matrix4;
    protected rotationZMatrix: Matrix4;
    protected translationMatrix: Matrix4;

    protected _position: Vector3;
    protected _rotation: Vector3;
    protected _scale: Vector3;
    protected _modelMatrix: Matrix4;

    protected readonly objectBuffer: number[] = [
        // Position             // Normal           // Texture
        -10.0, -10.0, +10.0,    +0.0, +0.0, +1.0,   0.0, 0.0,   // Front face
        +10.0, -10.0, +10.0,    +0.0, +0.0, +1.0,   1.0, 0.0,   // Front face
        +10.0, +10.0, +10.0,    +0.0, +0.0, +1.0,   1.0, 1.0,   // Front face
        -10.0, +10.0, +10.0,    +0.0, +0.0, +1.0,   0.0, 1.0,   // Front face

        // Position             // Normal           // Texture
        -10.0, -10.0, -10.0,    +0.0, +0.0, -1.0,   0.0, 0.0,   // Back face
        -10.0, +10.0, -10.0,    +0.0, +0.0, -1.0,   1.0, 0.0,   // Back face
        +10.0, +10.0, -10.0,    +0.0, +0.0, -1.0,   1.0, 1.0,   // Back face
        +10.0, -10.0, -10.0,    +0.0, +0.0, -1.0,   0.0, 1.0,   // Back face

        // Position             // Normal           // Texture
        -10.0, +10.0, -10.0,    +0.0, +1.0, +0.0,   0.0, 0.0,   // Top face
        -10.0, +10.0, +10.0,    +0.0, +1.0, +0.0,   1.0, 0.0,   // Top face
        +10.0, +10.0, +10.0,    +0.0, +1.0, +0.0,   1.0, 1.0,   // Top face
        +10.0, +10.0, -10.0,    +0.0, +1.0, +0.0,   0.0, 1.0,   // Top face

        // Position             // Normal           // Texture
        -10.0, -10.0, -10.0,    +0.0, -1.0, +0.0,   0.0, 0.0,   // Bottom face
        +10.0, -10.0, -10.0,    +0.0, -1.0, +0.0,   1.0, 0.0,   // Bottom face
        +10.0, -10.0, +10.0,    +0.0, -1.0, +0.0,   1.0, 1.0,   // Bottom face
        -10.0, -10.0, +10.0,    +0.0, -1.0, +0.0,   0.0, 1.0,   // Bottom face

        // Position             // Normal           // Texture
        +10.0, -10.0, -10.0,    +1.0, +0.0, +0.0,   0.0, 0.0,   // Right face
        +10.0, +10.0, -10.0,    +1.0, +0.0, +0.0,   1.0, 0.0,   // Right face
        +10.0, +10.0, +10.0,    +1.0, +0.0, +0.0,   1.0, 1.0,   // Right face
        +10.0, -10.0, +10.0,    +1.0, +0.0, +0.0,   0.0, 1.0,   // Right face

        // Position             // Normal           // Texture
        -10.0, -10.0, -10.0,    -1.0, +0.0, +0.0,   0.0, 0.0,   // Left face
        -10.0, -10.0, +10.0,    -1.0, +0.0, +0.0,   1.0, 0.0,   // Left face
        -10.0, +10.0, +10.0,    -1.0, +0.0, +0.0,   1.0, 1.0,   // Left face
        -10.0, +10.0, -10.0,    -1.0, +0.0, +0.0,   0.0, 1.0,   // Left face
    ];

    protected readonly indexBuffer: number[] = [
        // Front face
        0,  1,  2,  0,  2,  3,
        // Back face
        4,  5,  6,  4,  6,  7,
        // Top face
        8,  9,  10, 8,  10, 11,
        // Bottom face
        12, 13, 14, 12, 14, 15,
        // Right face
        16, 17, 18, 16, 18, 19,
        // Left face
        20, 21, 22, 20, 22, 23,
    ];

    constructor(gl: WebGLRenderingContext, position: Vector3, rotation: Vector3 = Vector3.Zero(), scale: Vector3 = Vector3.One()) {
        this.gl = gl;

        this._position = position;
        this._rotation = rotation;
        this._scale = scale;

        this.rotationXMatrix = Matrix4.CreateRotationX(this._rotation.X);
        this.rotationYMatrix = Matrix4.CreateRotationY(this._rotation.Y);
        this.rotationZMatrix = Matrix4.CreateRotationZ(this._rotation.Z);
        this.translationMatrix = Matrix4.CreateTranslation(this._position);

        this._modelMatrix = this.createModelMatrix();

        Buffer.FillObjectArray(this.objectBuffer);
        Buffer.FillIndexArray(this.indexBuffer);
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

    public get modelMatrix(): Matrix4 {
        return this._modelMatrix;
    }

    public resize(width: number, height: number): void {
        
    }

    public update(elapsedSeconds: number): void {
        this.rotation = new Vector3(
            this._rotation.X + elapsedSeconds,
            this._rotation.Y + elapsedSeconds,
            this._rotation.Z + elapsedSeconds);
    }

    public drawInfo(elapsedSeconds: number): DrawInfo {
        return {
            modelMatrix: this.modelMatrix
        }
    }

    protected createModelMatrix(): Matrix4 {
        this._modelMatrix = Matrix4.Multiply(
            Matrix4.Multiply(
                Matrix4.Multiply(
                    this.rotationXMatrix,
                    this.rotationYMatrix
                ),
                this.rotationZMatrix
            ),
            this.translationMatrix
        );

        return this.modelMatrix;
    }
}