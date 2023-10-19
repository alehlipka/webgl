export class Context {
    private gl: WebGLRenderingContext;

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

    private initializeListeners(): void {
        window.addEventListener("load", (): void => {
            document.querySelector("#preloader")?.classList.add("loaded");
            document.querySelector("#app")?.classList.add("loaded");
            this.gl.canvas.width = window.innerWidth - 20;
            this.gl.canvas.height = window.innerHeight - 140;
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        });

        window.addEventListener("resize", (): void => {
            this.gl.canvas.width = window.innerWidth - 20;
            this.gl.canvas.height = window.innerHeight - 140;
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        });

        this.gl.canvas.addEventListener("dblclick", (): void => {
            let elem = <HTMLCanvasElement>this.gl.canvas;
            document.fullscreenElement
                ? document.exitFullscreen()
                : elem.requestFullscreen();
        });
    }
}
