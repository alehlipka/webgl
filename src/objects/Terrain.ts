import { Vector2 } from "../core/math/Vector2.ts";
import { Vector3 } from "../core/math/Vector3.ts";
import { Object3d } from "./Object3d.ts";

export class Terrain extends Object3d {
	protected size: Vector2;

	constructor(
		gl: WebGL2RenderingContext,
		position: Vector3,
		textureUrl: string,
		size: Vector2 = Vector2.One(),
		rotation: Vector3 = Vector3.Zero(),
		scale: Vector3 = Vector3.One()
	) {
		super(gl, position, textureUrl, rotation, scale);
		this.size = size;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	override update(_elapsedSeconds: number): void {
		this.rotation = new Vector3(this._rotation.X, this._rotation.Y, this._rotation.Z);
	}

	override getObjectBuffer(): number[] {
		const halfX: number = this.size.X / 2;
		const halfY: number = this.size.Y / 2;

		return [
			// Position             // Normal           // Texture
			-halfX,
			0,
			-halfY,
			+0.0,
			+1.0,
			+0.0,
			0.0,
			0.0, // Top face
			-halfX,
			0,
			+halfY,
			+0.0,
			+1.0,
			+0.0,
			0.0,
			1.0, // Top face
			+halfX,
			0,
			+halfY,
			+0.0,
			+1.0,
			+0.0,
			1.0,
			1.0, // Top face
			+halfX,
			0,
			-halfY,
			+0.0,
			+1.0,
			+0.0,
			1.0,
			0.0 // Top face
		];
	}

	override getIndexBuffer(): number[] {
		return [
			// Front face
			0, 1, 2, 0, 2, 3
		];
	}
}
