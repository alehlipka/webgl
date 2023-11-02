export type shaderCodes = {
	vertex: string;
	fragment: string;
};

export type ProgramInfo = {
	program: WebGLProgram;
	attribLocations: AttributeLocations;
	uniformLocations: UniformLocations;
};

export type KeyCode = {
	code: string;
	isDown: boolean;
};

type AttributeLocations = {
	vertexPosition: number;
	vertexNormal: number;
	vertexTexture: number;
};

type UniformLocations = {
	projectionMatrix: WebGLUniformLocation | null;
	modelMatrix: WebGLUniformLocation | null;
	viewMatrix: WebGLUniformLocation | null;
	cameraPosition: WebGLUniformLocation | null;
	uSampler: WebGLUniformLocation | null;
};
