export class Context {
  /**
   * Manages the WebGL context and handles events related to the canvas element.
   */
  private readonly gl: WebGL2RenderingContext;

  private readonly WIDTH_OFFSET: number = 20;
  private readonly HEIGHT_OFFSET: number = 140;

  /**
   * Initializes a new instance of the Context class.
   * @param canvas_id - The ID of the canvas element.
   * @throws Error if the canvas element with the specified ID is not found.
   * @throws Error if the WebGL context initialization fails.
   */
  constructor(canvas_id: string) {
    const canvasElement: HTMLCanvasElement = <HTMLCanvasElement>(
      document.getElementById(canvas_id)
    );
    if (canvasElement === null)
      throw Error(`Canvas with ID "${canvas_id}" not found`);

    const context: WebGL2RenderingContext | null =
      canvasElement.getContext("webgl2");
    if (context === null) throw Error("Context initialization fail");
    this.gl = context;
  }

  /**
   * Returns the WebGL rendering context.
   * @returns The WebGL rendering context.
   */
  public getContext(): WebGL2RenderingContext {
    return this.gl;
  }

  /**
   * Performs actions when the page finishes loading.
   * @param width - The width of the window.
   * @param height - The height of the window.
   */
  public OnLoad(width: number, height: number): void {
    document.getElementById("preloader")?.classList.add("loaded");
    document.getElementById("app")?.classList.add("loaded");
    this.OnResize(width, height);
  }

  /**
   * Adjusts the canvas size based on the specified width and height.
   * @param width - The width of the window.
   * @param height - The height of the window.
   */
  public OnResize(width: number, height: number): void {
    this.gl.canvas.width = width - this.WIDTH_OFFSET;
    this.gl.canvas.height = height - this.HEIGHT_OFFSET;
  }
}
