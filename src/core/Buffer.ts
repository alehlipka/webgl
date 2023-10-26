export class Buffer {
    private static ObjectBufferArray: number[] = [];
    private static IndexBufferArray: number[] = [];

    public static ObjectBuffer: WebGLBuffer|null;
    public static IndexBuffer: WebGLBuffer|null;

    public static InitializeBuffers(gl: WebGL2RenderingContext): void {
        this.ObjectBuffer = gl.createBuffer();
        this.IndexBuffer = gl.createBuffer();

        if (this.ObjectBuffer === null) throw new Error("Position buffer creation error");
        if (this.IndexBuffer === null) throw new Error("Index buffer creation error");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.ObjectBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Buffer.ObjectBufferArray), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Buffer.IndexBufferArray), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public static FillObjectArray(array: number[]): void {
        this.ObjectBufferArray.push(...array);
    }

    public static FillIndexArray(array: number[]): void {
        this.IndexBufferArray.push(...array);
    }
}