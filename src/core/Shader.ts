import { ProgramInfo, shaderCodes } from "./types.ts";

export class Shader {
  private readonly gl: WebGL2RenderingContext;
  private readonly shaderCodes: shaderCodes;
  private readonly programInfo: ProgramInfo;

  constructor(gl: WebGL2RenderingContext, shaders: shaderCodes) {
    this.gl = gl;
    this.shaderCodes = shaders;
    this.programInfo = this.initializeProgramInfo();
  }

  public getProgramInfo(): ProgramInfo {
    return this.programInfo;
  }

  private initializeProgramInfo(): ProgramInfo {
    const vertexShader: WebGLShader = this.loadShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      this.shaderCodes.vertex,
    );
    const fragmentShader: WebGLShader = this.loadShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      this.shaderCodes.fragment,
    );

    const shaderProgram: WebGLProgram | null = this.gl.createProgram();
    if (shaderProgram === null)
      throw new Error("Shader program creation error");

    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error(
        `Unable to initialize the shader program: ${this.gl.getProgramInfoLog(
          shaderProgram,
        )}`,
      );
    }

    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);

    return {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(
          shaderProgram,
          "aVertexPosition",
        ),
        vertexNormal: this.gl.getAttribLocation(shaderProgram, "aVertexNormal"),
        vertexTexture: this.gl.getAttribLocation(
          shaderProgram,
          "aTextureCoords",
        ),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(
          shaderProgram,
          "uProjectionMatrix",
        ),
        modelMatrix: this.gl.getUniformLocation(shaderProgram, "uModelMatrix"),
        viewMatrix: this.gl.getUniformLocation(shaderProgram, "uViewMatrix"),
        uSampler: this.gl.getUniformLocation(shaderProgram, "uSampler"),
      },
    };
  }

  private loadShader(
    gl: WebGL2RenderingContext,
    type: number,
    source: string,
  ): WebGLShader {
    const shader: WebGLShader | null = gl.createShader(type);
    if (shader === null) throw new Error("Shader creation error");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
          shader,
        )}`,
      );
    }

    return shader;
  }
}
