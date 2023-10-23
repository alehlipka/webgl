import {Matrix4} from "../core/math/Matrix4.ts";
import {Vector3} from "../core/math/Vector3.ts";

export class Object3d {
    protected rotationXMatrix: Matrix4;
    protected rotationYMatrix: Matrix4;
    protected rotationZMatrix: Matrix4;
    protected translationMatrix: Matrix4;

    protected position: Vector3;
    protected rotation: Vector3;
    protected scale: Vector3;

    constructor(position: Vector3, rotation: Vector3 = Vector3.Zero(), scale: Vector3 = Vector3.One()) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;

        this.rotationXMatrix = Matrix4.CreateRotationX(this.rotation.X);
        this.rotationYMatrix = Matrix4.CreateRotationY(this.rotation.Y);
        this.rotationZMatrix = Matrix4.CreateRotationZ(this.rotation.Z);
        this.translationMatrix = Matrix4.CreateTranslation(this.position);
    }

    public resize(width: number, height: number): void {

    }

    public update(elapsedSeconds: number): void {

    }

    public draw(elapsedSeconds: number): void {

    }

    protected createModelMatrix(): Matrix4 {
        return Matrix4.Multiply(
            Matrix4.Multiply(
                Matrix4.Multiply(
                    this.rotationXMatrix,
                    this.rotationYMatrix
                ),
                this.rotationZMatrix
            ),
            this.translationMatrix
        );
    }
}