export type shaderCodes = {
  vertex: string;
  fragment: string;
};

export type ProgramInfo = {
  program: WebGLProgram;
  attribLocations: AttributeLocations;
  uniformLocations: UniformLocations;
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
  uSampler: WebGLUniformLocation | null;
};
