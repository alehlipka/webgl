import {PositionNormalTextureVertex} from "./types.ts";
import {Vector3} from "./math/Vector3.ts";
import {Vector2} from "./math/Vector2.ts";

export class Buffer {
    public static ObjectsBuffer: PositionNormalTextureVertex[] = [
        // Front face
        { position: new Vector3(-10.0, -10.0, +10.0), normal: new Vector3(+0.0, +0.0, +1.0), texture: new Vector2(0.0, 0.0) },
        { position: new Vector3(+10.0, -10.0, +10.0), normal: new Vector3(+0.0, +0.0, +1.0), texture: new Vector2(1.0, 0.0) },
        { position: new Vector3(+10.0, +10.0, +10.0), normal: new Vector3(+0.0, +0.0, +1.0), texture: new Vector2(1.0, 1.0) },
        { position: new Vector3(-10.0, +10.0, +10.0), normal: new Vector3(+0.0, +0.0, +1.0), texture: new Vector2(0.0, 1.0) },
        // Back face
        { position: new Vector3(-10.0, -10.0, -10.0), normal: new Vector3(+0.0, +0.0, -1.0), texture: new Vector2(0.0, 0.0) },
        { position: new Vector3(-10.0, +10.0, -10.0), normal: new Vector3(+0.0, +0.0, -1.0), texture: new Vector2(1.0, 0.0) },
        { position: new Vector3(+10.0, +10.0, -10.0), normal: new Vector3(+0.0, +0.0, -1.0), texture: new Vector2(1.0, 1.0) },
        { position: new Vector3(+10.0, -10.0, -10.0), normal: new Vector3(+0.0, +0.0, -1.0), texture: new Vector2(0.0, 1.0) },
        // Top face
        { position: new Vector3(-10.0, +10.0, -10.0), normal: new Vector3(+0.0, +1.0, +0.0), texture: new Vector2(0.0, 0.0) },
        { position: new Vector3(+10.0, -10.0, -10.0), normal: new Vector3(+0.0, +1.0, +0.0), texture: new Vector2(1.0, 0.0) },
        { position: new Vector3(+10.0, +10.0, +10.0), normal: new Vector3(+0.0, +1.0, +0.0), texture: new Vector2(1.0, 1.0) },
        { position: new Vector3(+10.0, +10.0, -10.0), normal: new Vector3(+0.0, +1.0, +0.0), texture: new Vector2(0.0, 1.0) },
        // Bottom face
        { position: new Vector3(-10.0, -10.0, -10.0), normal: new Vector3(+0.0, -1.0, +0.0), texture: new Vector2(0.0, 0.0) },
        { position: new Vector3(+10.0, -10.0, -10.0), normal: new Vector3(+0.0, -1.0, +0.0), texture: new Vector2(1.0, 0.0) },
        { position: new Vector3(+10.0, -10.0, +10.0), normal: new Vector3(+0.0, -1.0, +0.0), texture: new Vector2(1.0, 1.0) },
        { position: new Vector3(-10.0, -10.0, +10.0), normal: new Vector3(+0.0, -1.0, +0.0), texture: new Vector2(0.0, 1.0) },
        // Right face
        { position: new Vector3(+10.0, -10.0, -10.0), normal: new Vector3(+1.0, +0.0, +0.0), texture: new Vector2(0.0, 0.0) },
        { position: new Vector3(+10.0, +10.0, -10.0), normal: new Vector3(+1.0, +0.0, +0.0), texture: new Vector2(1.0, 0.0) },
        { position: new Vector3(+10.0, +10.0, +10.0), normal: new Vector3(+1.0, +0.0, +0.0), texture: new Vector2(1.0, 1.0) },
        { position: new Vector3(+10.0, -10.0, +10.0), normal: new Vector3(+1.0, +0.0, +0.0), texture: new Vector2(0.0, 1.0) },
        // Left face
        { position: new Vector3(-10.0, -10.0, -10.0), normal: new Vector3(-1.0, +0.0, +0.0), texture: new Vector2(0.0, 0.0) },
        { position: new Vector3(-10.0, -10.0, +10.0), normal: new Vector3(-1.0, +0.0, +0.0), texture: new Vector2(1.0, 0.0) },
        { position: new Vector3(-10.0, +10.0, +10.0), normal: new Vector3(-1.0, +0.0, +0.0), texture: new Vector2(1.0, 1.0) },
        { position: new Vector3(-10.0, +10.0, -10.0), normal: new Vector3(-1.0, +0.0, +0.0), texture: new Vector2(0.0, 1.0) },
    ];
    public static IndexBuffer: number[] = [
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
}