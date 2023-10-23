import {Matrix4} from "../core/math/Matrix4.ts";
import {Vector3} from "../core/math/Vector3.ts";

export class Object3d {
    protected rotationXMatrix: Matrix4;
    protected rotationYMatrix: Matrix4;
    protected rotationZMatrix: Matrix4;
    protected translationMatrix: Matrix4;

    protected _position: Vector3;
    protected _rotation: Vector3;
    protected _scale: Vector3;
    protected _modelMatrix: Matrix4;

    constructor(position: Vector3, rotation: Vector3 = Vector3.Zero(), scale: Vector3 = Vector3.One()) {
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;

        this.rotationXMatrix = Matrix4.CreateRotationX(this._rotation.X);
        this.rotationYMatrix = Matrix4.CreateRotationY(this._rotation.Y);
        this.rotationZMatrix = Matrix4.CreateRotationZ(this._rotation.Z);
        this.translationMatrix = Matrix4.CreateTranslation(this._position);

        this._modelMatrix = this.createModelMatrix();
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

    }

    public draw(elapsedSeconds: number): void {

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