import { MathHelper } from "./math/MathHelper";

export class Loader {
	public static loadTexture(gl: WebGL2RenderingContext, url: string): WebGLTexture {
		const texture: WebGLTexture | null = gl.createTexture();
		if (texture === null) throw new Error("Texture creation error");

		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

		const image: HTMLImageElement = new Image();
		image.onload = (): void => {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

			if (MathHelper.IsPowerOfTwo(image.width) && MathHelper.IsPowerOfTwo(image.height)) {
				gl.generateMipmap(gl.TEXTURE_2D);
			} else {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}
		};
		image.onerror = (): void => {
			throw new Error("Image loading error");
		};
		image.src = url;

		gl.bindTexture(gl.TEXTURE_2D, null);

		return texture;
	}

	public static loadHeighMapArray(url: string): number[][] {
		const image: HTMLImageElement = new Image();
		const result: number[][] = [];

		image.onload = (): void => {
			const canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
			const context = canvas.getContext("2d");
			if (context === null) throw new Error("Height map context error");
			context.drawImage(image, 0, 0);
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

			for (let x = 0; x < image.width; x++) {
				for (let z = 0; z < image.height; z++) {
					const index = 4 * x * image.width + 4 * z;
					if (!result[x]) result[x] = [];
					result[x][z] = imageData[index];
				}
			}
		};
		image.onerror = (): void => {
			throw new Error("Height map loading error");
		};
		image.src = url;

		return result;
	}
}
