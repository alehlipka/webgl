import { Vector3 } from "../core/math/Vector3.ts";
import { Object3d } from "./Object3d.ts";

export class Cube extends Object3d {
  protected size: Vector3;

  constructor(
    gl: WebGL2RenderingContext,
    position: Vector3,
    textureUrl: string,
    size: Vector3 = Vector3.One(),
    rotation: Vector3 = Vector3.Zero(),
    scale: Vector3 = Vector3.One(),
  ) {
    super(gl, position, textureUrl, rotation, scale);
    this.size = size;
  }

  override update(_elapsedSeconds: number): void {
    this.rotation = new Vector3(
      this._rotation.X + _elapsedSeconds * 1,
      this._rotation.Y + _elapsedSeconds * 1,
      this._rotation.Z + _elapsedSeconds * 1,
    );
  }

  override getObjectBuffer(): number[] {
    const halfX: number = this.size.X / 2;
    const halfY: number = this.size.Y / 2;
    const halfZ: number = this.size.Z / 2;

    return [
      // Position             // Normal           // Texture
      -halfX,
      -halfY,
      +halfZ,
      +0.0,
      +0.0,
      +1.0,
      0.0,
      0.0, // Front face
      +halfX,
      -halfY,
      +halfZ,
      +0.0,
      +0.0,
      +1.0,
      1.0,
      0.0, // Front face
      +halfX,
      +halfY,
      +halfZ,
      +0.0,
      +0.0,
      +1.0,
      1.0,
      1.0, // Front face
      -halfX,
      +halfY,
      +halfZ,
      +0.0,
      +0.0,
      +1.0,
      0.0,
      1.0, // Front face

      // Position             // Normal           // Texture
      -halfX,
      -halfY,
      -halfZ,
      +0.0,
      +0.0,
      -1.0,
      0.0,
      0.0, // Back face
      -halfX,
      +halfY,
      -halfZ,
      +0.0,
      +0.0,
      -1.0,
      1.0,
      0.0, // Back face
      +halfX,
      +halfY,
      -halfZ,
      +0.0,
      +0.0,
      -1.0,
      1.0,
      1.0, // Back face
      +halfX,
      -halfY,
      -halfZ,
      +0.0,
      +0.0,
      -1.0,
      0.0,
      1.0, // Back face

      // Position             // Normal           // Texture
      -halfX,
      +halfY,
      -halfZ,
      +0.0,
      +1.0,
      +0.0,
      0.0,
      0.0, // Top face
      -halfX,
      +halfY,
      +halfZ,
      +0.0,
      +1.0,
      +0.0,
      1.0,
      0.0, // Top face
      +halfX,
      +halfY,
      +halfZ,
      +0.0,
      +1.0,
      +0.0,
      1.0,
      1.0, // Top face
      +halfX,
      +halfY,
      -halfZ,
      +0.0,
      +1.0,
      +0.0,
      0.0,
      1.0, // Top face

      // Position             // Normal           // Texture
      -halfX,
      -halfY,
      -halfZ,
      +0.0,
      -1.0,
      +0.0,
      0.0,
      0.0, // Bottom face
      +halfX,
      -halfY,
      -halfZ,
      +0.0,
      -1.0,
      +0.0,
      1.0,
      0.0, // Bottom face
      +halfX,
      -halfY,
      +halfZ,
      +0.0,
      -1.0,
      +0.0,
      1.0,
      1.0, // Bottom face
      -halfX,
      -halfY,
      +halfZ,
      +0.0,
      -1.0,
      +0.0,
      0.0,
      1.0, // Bottom face

      // Position             // Normal           // Texture
      +halfX,
      -halfY,
      -halfZ,
      +1.0,
      +0.0,
      +0.0,
      0.0,
      0.0, // Right face
      +halfX,
      +halfY,
      -halfZ,
      +1.0,
      +0.0,
      +0.0,
      1.0,
      0.0, // Right face
      +halfX,
      +halfY,
      +halfZ,
      +1.0,
      +0.0,
      +0.0,
      1.0,
      1.0, // Right face
      +halfX,
      -halfY,
      +halfZ,
      +1.0,
      +0.0,
      +0.0,
      0.0,
      1.0, // Right face

      // Position             // Normal           // Texture
      -halfX,
      -halfY,
      -halfZ,
      -1.0,
      +0.0,
      +0.0,
      0.0,
      0.0, // Left face
      -halfX,
      -halfY,
      +halfZ,
      -1.0,
      +0.0,
      +0.0,
      1.0,
      0.0, // Left face
      -halfX,
      +halfY,
      +halfZ,
      -1.0,
      +0.0,
      +0.0,
      1.0,
      1.0, // Left face
      -halfX,
      +halfY,
      -halfZ,
      -1.0,
      +0.0,
      +0.0,
      0.0,
      1.0, // Left face
    ];
  }

  override getIndexBuffer(): number[] {
    return [
      // Front face
      0, 1, 2, 0, 2, 3,
      // Back face
      4, 5, 6, 4, 6, 7,
      // Top face
      8, 9, 10, 8, 10, 11,
      // Bottom face
      12, 13, 14, 12, 14, 15,
      // Right face
      16, 17, 18, 16, 18, 19,
      // Left face
      20, 21, 22, 20, 22, 23,
    ];
  }
}
