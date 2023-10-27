export class Loader {
  public static loadTexture(
    gl: WebGL2RenderingContext,
    url: string,
  ): WebGLTexture {
    const texture: WebGLTexture | null = gl.createTexture();
    if (texture === null) throw new Error("Texture creation error");

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255]),
    );

    const image: HTMLImageElement = new Image();
    image.onload = (): void => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      if (this.isPowerOfTwo(image.width) && this.isPowerOfTwo(image.height)) {
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

  private static isPowerOfTwo(value: number): boolean {
    if (value < 1) {
      return false;
    }
    return (value & (value - 1)) === 0;
  }
}
