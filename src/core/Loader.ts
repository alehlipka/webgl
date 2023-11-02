import { MathHelper } from "./math/MathHelper";

export class Loader {
	public static async LoadTexture(gl: WebGL2RenderingContext, url: string): Promise<WebGLTexture> {
		const texture: WebGLTexture | null = gl.createTexture();
		if (texture === null) throw new Error("Texture creation error");

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

		const image = await this.LoadImage(url);

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		if (MathHelper.IsPowerOfTwo(image.width) && MathHelper.IsPowerOfTwo(image.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);

		return texture;
	}

	public static async LoadHeighMapArray(url: string): Promise<number[][]> {
		const result: number[][] = [];
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		if (context === null) throw new Error("Height map context error");

		await this.LoadImage(url).then((image) => {
			canvas.width = image.width;
			canvas.height = image.height;
			context.drawImage(image, 0, 0);
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

			for (let x = 0; x < image.width; x++) {
				for (let z = 0; z < image.height; z++) {
					const index = 4 * x * image.width + 4 * z;
					if (!result[x]) result[x] = [];
					result[x][z] = imageData[index];
				}
			}
		});

		return result;
	}

	public static async LoadImage(url: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = reject;
			image.src = url;
		});
	}
}
