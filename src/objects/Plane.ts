import { Vector3 } from "../core/math/Vector3.ts";
import {Object3d} from "./Object3d.ts";

export class Plane extends Object3d {
    protected size: Vector3;

    constructor(gl: WebGLRenderingContext, position: Vector3, size: Vector3 = Vector3.One(), rotation: Vector3 = Vector3.Zero(), scale: Vector3 = Vector3.One()) {
        super(gl, position, rotation, scale);
        this.size = size;
    }

    override update(_elapsedSeconds: number): void {
        this.rotation = new Vector3(
            this._rotation.X + _elapsedSeconds * 0,
            this._rotation.Y + _elapsedSeconds * 1,
            this._rotation.Z + _elapsedSeconds * 0
        );
    }

    override getObjectBuffer(): number[] {
        const halfX = this.size.X / 2;
        const halfY = this.size.Y / 2;
        const halfZ = this.size.Z / 2;

        return [
            // Position             // Normal           // Texture
            -halfX, -halfY, +halfZ, +0.0, +0.0, +1.0,   0.0, 0.0,   // Front face
            +halfX, -halfY, +halfZ, +0.0, +0.0, +1.0,   1.0, 0.0,   // Front face
            +halfX, +halfY, +halfZ, +0.0, +0.0, +1.0,   1.0, 1.0,   // Front face
            -halfX, +halfY, +halfZ, +0.0, +0.0, +1.0,   0.0, 1.0,   // Front face
        ];
    }

    override getIndexBuffer(): number[] {
        return [
            // Front face
            0,  1,  2,  0,  2,  3
        ];
    }
}