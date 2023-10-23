import _ from "lodash";

export class Context {
    private readonly gl: WebGLRenderingContext;

    private readonly WIDTH_OFFSET: number = 20;
    private readonly HEIGHT_OFFSET: number = 140;

    constructor(canvas_id: string) {
        const canvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvas_id);
        if (canvasElement === null) throw Error(`Canvas with ID "${canvas_id}" not found`);

        const context: WebGLRenderingContext | null = canvasElement.getContext("webgl");
        if (context === null) throw Error('Context initialization fail');
        this.gl = context;
    }

    public getContext(): WebGLRenderingContext {
        return this.gl;
    }

    public OnLoad(width: number, height: number): void {
        document.getElementById("preloader")?.classList.add("loaded");
        document.getElementById("app")?.classList.add("loaded");
        this.OnResize(width, height);
    }

    public OnResize(width: number, height: number): void {
        this.gl.canvas.width = width - this.WIDTH_OFFSET;
        this.gl.canvas.height = height - this.HEIGHT_OFFSET;
    }

    public OnFullscreen(width: number, height: number): void {
        let elem: HTMLCanvasElement = <HTMLCanvasElement>this.gl.canvas;
        document.fullscreenElement
            ? document.exitFullscreen()
            : elem.requestFullscreen();
        this.OnResize(width, height);
    }
}
