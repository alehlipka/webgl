export class Buffer {
    private static ObjectBufferArray: number[] = [];
    private static IndexBufferArray: number[] = [];

    public static ObjectBuffer: WebGLBuffer;
    public static IndexBuffer: WebGLBuffer;

    public static InitializeBuffers(gl: WebGLRenderingContext): void {
        const objectBuffer: WebGLBuffer | null = gl.createBuffer();
        const indexBuffer: WebGLBuffer | null = gl.createBuffer();

        if (objectBuffer === null) throw new Error("Position buffer creation error");
        if (indexBuffer === null) throw new Error("Index buffer creation error");

        gl.bindBuffer(gl.ARRAY_BUFFER, objectBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Buffer.ObjectBufferArray), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Buffer.IndexBufferArray), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        this.ObjectBuffer = objectBuffer;
        this.IndexBuffer = indexBuffer;
    }

    public static FillObjectArray(array: number[]): void {
        this.ObjectBufferArray.push(...array);
    }

    public static FillIndexArray(array: number[]): void {
        this.IndexBufferArray.push(...array);
    }
}