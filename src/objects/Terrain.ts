import { Loader } from "../core/Loader.ts";
import { Object3d } from "./Object3d.ts";

export class Terrain extends Object3d {
	protected heightMapData: ImageData;
	protected indices: number[] = [];
	protected vertices: number[] = [];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	override update(_elapsedSeconds: number): void {}

	override async Initialize(): Promise<void> {
		this.texture = await Loader.LoadTexture(this.gl, this.textureUrl);
		this.heightMapData = await Loader.GetImageData("assets/textures/hm.png");

		this.calculateVertexIndexData();

		this.objectBufferArray = this.getObjectBuffer();
		this.indexBufferArray = this.getIndexBuffer();

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.objectBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.objectBufferArray), this.gl.STATIC_DRAW);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBufferArray), this.gl.STATIC_DRAW);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	}

	protected getHeight(offset: number) {
		const v = this.heightMapData.data[offset * 4]; // x4 because RGBA
		return (v * 10) / 255; // 0 to 10
	}

	protected calculateVertexIndexData(): void {
		this.vertices = [];
		this.indices = [];

		const cellsAcross = this.heightMapData.width - 1;
		const cellsDeep = this.heightMapData.height - 1;
		for (let z = 0; z < cellsDeep; ++z) {
			for (let x = 0; x < cellsAcross; ++x) {
				const base0 = z * this.heightMapData.width + x;
				const base1 = base0 + this.heightMapData.width;

				const h00 = this.getHeight(base0);
				const h01 = this.getHeight(base0 + 1);
				const h10 = this.getHeight(base1);
				const h11 = this.getHeight(base1 + 1);
				const hm = (h00 + h01 + h10 + h11) / 4;

				const x0 = x;
				const x1 = x + 1;
				const z0 = z;
				const z1 = z + 1;

				const ndx = this.vertices.length / 8;

				const u0 = x / cellsAcross;
				const v0 = z / cellsDeep;
				const u1 = (x + 1) / cellsAcross;
				const v1 = (z + 1) / cellsDeep;

				// prettier-ignore
				this.vertices.push(
					x0, h00, z0, 0, 1, 0, u0, v0,
					x1, h01, z0, 0, 1, 0, u1, v0,
					x0, h10, z1, 0, 1, 0, u0, v1,
					x1, h11, z1, 0, 1, 0, u1, v1,
					(x0 + x1) / 2, hm, (z0 + z1) / 2, 0, 1, 0, (u0 + u1) / 2, (v0 + v1) / 2,
				);

				//      0----1
				//      |\  /|
				//      | \/4|
				//      | /\ |
				//      |/  \|
				//      2----3

				// prettier-ignore
				this.indices.push(
					ndx, ndx + 4, ndx + 1,
					ndx, ndx + 2, ndx + 4,
					ndx + 2, ndx + 3, ndx + 4,
					ndx + 1, ndx + 4, ndx + 3,
				);
			}
		}
	}

	override getObjectBuffer(): number[] {
		return this.vertices;
	}

	override getIndexBuffer(): number[] {
		return this.indices;
	}
}
