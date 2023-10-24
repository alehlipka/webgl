export class Buffer {
    public static readonly ObjectBufferArray: number[] = [
        // Position             // Normal           // Texture
        -10.0, -10.0, +10.0,    +0.0, +0.0, +1.0,   0.0, 0.0,   // Front face
        +10.0, -10.0, +10.0,    +0.0, +0.0, +1.0,   1.0, 0.0,   // Front face
        +10.0, +10.0, +10.0,    +0.0, +0.0, +1.0,   1.0, 1.0,   // Front face
        -10.0, +10.0, +10.0,    +0.0, +0.0, +1.0,   0.0, 1.0,   // Front face

        // Position             // Normal           // Texture
        -10.0, -10.0, -10.0,    +0.0, +0.0, -1.0,   0.0, 0.0,   // Back face
        -10.0, +10.0, -10.0,    +0.0, +0.0, -1.0,   1.0, 0.0,   // Back face
        +10.0, +10.0, -10.0,    +0.0, +0.0, -1.0,   1.0, 1.0,   // Back face
        +10.0, -10.0, -10.0,    +0.0, +0.0, -1.0,   0.0, 1.0,   // Back face

        // Position             // Normal           // Texture
        -10.0, +10.0, -10.0,    +0.0, +1.0, +0.0,   0.0, 0.0,   // Top face
        -10.0, +10.0, +10.0,    +0.0, +1.0, +0.0,   1.0, 0.0,   // Top face
        +10.0, +10.0, +10.0,    +0.0, +1.0, +0.0,   1.0, 1.0,   // Top face
        +10.0, +10.0, -10.0,    +0.0, +1.0, +0.0,   0.0, 1.0,   // Top face

        // Position             // Normal           // Texture
        -10.0, -10.0, -10.0,    +0.0, -1.0, +0.0,   0.0, 0.0,   // Bottom face
        +10.0, -10.0, -10.0,    +0.0, -1.0, +0.0,   1.0, 0.0,   // Bottom face
        +10.0, -10.0, +10.0,    +0.0, -1.0, +0.0,   1.0, 1.0,   // Bottom face
        -10.0, -10.0, +10.0,    +0.0, -1.0, +0.0,   0.0, 1.0,   // Bottom face

        // Position             // Normal           // Texture
        +10.0, -10.0, -10.0,    +1.0, +0.0, +0.0,   0.0, 0.0,   // Right face
        +10.0, +10.0, -10.0,    +1.0, +0.0, +0.0,   1.0, 0.0,   // Right face
        +10.0, +10.0, +10.0,    +1.0, +0.0, +0.0,   1.0, 1.0,   // Right face
        +10.0, -10.0, +10.0,    +1.0, +0.0, +0.0,   0.0, 1.0,   // Right face

        // Position             // Normal           // Texture
        -10.0, -10.0, -10.0,    -1.0, +0.0, +0.0,   0.0, 0.0,   // Left face
        -10.0, -10.0, +10.0,    -1.0, +0.0, +0.0,   1.0, 0.0,   // Left face
        -10.0, +10.0, +10.0,    -1.0, +0.0, +0.0,   1.0, 1.0,   // Left face
        -10.0, +10.0, -10.0,    -1.0, +0.0, +0.0,   0.0, 1.0,   // Left face
    ];

    public static readonly IndexBufferArray: number[] = [
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
}