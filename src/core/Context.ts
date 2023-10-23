import _ from "lodash";

export class Context {
    private readonly gl: WebGLRenderingContext;

    private readonly HANDLER_DELAY: number = 200;
    private readonly WIDTH_OFFSET: number = 20;
    private readonly HEIGHT_OFFSET: number = 140;

    constructor(canvas_id: string) {
        const canvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvas_id);
        if (canvasElement === null) throw Error(`Canvas with ID "${canvas_id}" not found`);
        const context: WebGLRenderingContext | null = canvasElement.getContext("webgl");
        if (context === null) throw Error('Context initialization fail');
        this.gl = context;

        this.initializeContext();
        this.initializeListeners();
    }

    public getContext(): WebGLRenderingContext {
        return this.gl;
    }

    private initializeContext(): void {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.BLEND);

        this.gl.frontFace(this.gl.CCW);
        this.gl.cullFace(this.gl.BACK);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    private resizeHandler = _.debounce((): void => {
        this.gl.canvas.width = window.innerWidth - this.WIDTH_OFFSET;
        this.gl.canvas.height = window.innerHeight - this.HEIGHT_OFFSET;
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }, this.HANDLER_DELAY);

    private loadHandler = _.debounce((): void => {
        document.getElementById("preloader")?.classList.add("loaded");
        document.getElementById("app")?.classList.add("loaded");
        this.gl.canvas.width = window.innerWidth - this.WIDTH_OFFSET;
        this.gl.canvas.height = window.innerHeight - this.HEIGHT_OFFSET;
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }, this.HANDLER_DELAY);

    private fullscreenHandler = (): void => {
        let elem: HTMLCanvasElement = <HTMLCanvasElement>this.gl.canvas;
        document.fullscreenElement
            ? document.exitFullscreen()
            : elem.requestFullscreen();
    };

    private initializeListeners(): void {
        window.addEventListener("load", this.loadHandler);
        window.addEventListener("resize", this.resizeHandler);
        this.gl.canvas.addEventListener("dblclick", this.fullscreenHandler);
    }
}
