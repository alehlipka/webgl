import {Matrix4} from "../core/math/Matrix4.ts";
import {Vector3} from "../core/math/Vector3.ts";
import {Buffer} from "../core/Buffer.ts";
import { DrawInfo } from "../core/types.ts";

export class Object3d {
    protected readonly gl: WebGL2RenderingContext;

    protected rotationXMatrix: Matrix4;
    protected rotationYMatrix: Matrix4;
    protected rotationZMatrix: Matrix4;
    protected translationMatrix: Matrix4;

    protected _position: Vector3;
    protected _rotation: Vector3;
    protected _scale: Vector3;
    protected _modelMatrix: Matrix4;

    constructor(gl: WebGL2RenderingContext, position: Vector3, rotation: Vector3 = Vector3.Zero(), scale: Vector3 = Vector3.One()) {
        this.gl = gl;

        this._position = position;
        this._rotation = rotation;
        this._scale = scale;

        this.rotationXMatrix = Matrix4.CreateRotationX(this._rotation.X);
        this.rotationYMatrix = Matrix4.CreateRotationY(this._rotation.Y);
        this.rotationZMatrix = Matrix4.CreateRotationZ(this._rotation.Z);
        this.translationMatrix = Matrix4.CreateTranslation(this._position);

        this._modelMatrix = this.createModelMatrix();
    }

    public Initialize(): void {
        Buffer.FillObjectArray(this.getObjectBuffer());
        Buffer.FillIndexArray(this.getIndexBuffer());
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

    public drawInfo(_elapsedSeconds: number): DrawInfo {
        return {
            modelMatrix: this._modelMatrix,
            elementsCount: this.getIndexBuffer().length
        }
    }

    protected getObjectBuffer(): number[] {
        return [];
    }

    protected getIndexBuffer(): number[] {
        return [];
    }

    protected createModelMatrix(): Matrix4 {
        const rotation: Matrix4 = Matrix4.Multiply(Matrix4.Multiply(this.rotationXMatrix, this.rotationYMatrix), this.rotationZMatrix);
        this._modelMatrix = Matrix4.Multiply(rotation, this.translationMatrix);
        
        return this._modelMatrix;
    }
}