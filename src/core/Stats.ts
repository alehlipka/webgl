export enum StatsMode {
	FPS = 0,
	MS = 1
}

export class Stats {
	public container: HTMLDivElement;

	private beginTime: number;
	private prevTime: number;
	private frames: number;
	private fpsPanel: StatsPanel;
	private msPanel: StatsPanel;

	constructor(
		mode: StatsMode = StatsMode.FPS,
		top: number = 0,
		right: number = 0,
		opacity: number = 0.9,
		z_index: number = 90000
	) {
		this.beginTime = performance.now();
		this.prevTime = this.beginTime;
		this.frames = 0;

		this.container = document.createElement("div");
		this.container.style.cssText = `position:fixed;top:${top}px;right:${right}px;cursor:pointer;opacity:${opacity};z-index:${z_index}`;
		this.container.addEventListener(
			"click",
			(event: MouseEvent): void => {
				event.preventDefault();
				this.showPanel(++mode % this.container.children.length);
			},
			false
		);

		this.fpsPanel = this.addPanel(new StatsPanel("FPS", "#0ff", "#002"));
		this.msPanel = this.addPanel(new StatsPanel("MS", "#0f0", "#020"));

		this.showPanel(mode);
	}

	public begin(): void {
		this.beginTime = performance.now();
	}

	public end(): number {
		this.frames++;
		const time: number = performance.now();
		this.msPanel.update(time - this.beginTime, 100);
		if (time >= this.prevTime + 1000) {
			this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 120);
			this.prevTime = time;
			this.frames = 0;
		}

		return time;
	}

	private addPanel(panel: StatsPanel): StatsPanel {
		this.container.appendChild(panel.canvas);
		return panel;
	}

	public showPanel(mode: StatsMode): void {
		for (let i: number = 0; i < this.container.children.length; i++) {
			const element: HTMLElement = <HTMLElement>this.container.children[i];
			element.style.display = i === mode ? "block" : "none";
		}
	}
}

class StatsPanel {
	public canvas: HTMLCanvasElement;

	private min: number;
	private max: number;
	private context: CanvasRenderingContext2D;
	private readonly PR: number;
	private readonly name: string;
	private readonly foreground: string;
	private readonly background: string;
	private readonly WIDTH: number;
	private readonly HEIGHT: number;
	private readonly TEXT_X: number;
	private readonly TEXT_Y: number;
	private readonly GRAPH_X: number;
	private readonly GRAPH_Y: number;
	private readonly GRAPH_WIDTH: number;
	private readonly GRAPH_HEIGHT: number;

	constructor(name: string, foreground: string, background: string) {
		this.name = name;
		this.foreground = foreground;
		this.background = background;

		this.min = Infinity;
		this.max = 0;
		this.PR = Math.round(window.devicePixelRatio || 1);

		this.WIDTH = 180 * this.PR;
		this.HEIGHT = 48 * this.PR;
		this.TEXT_X = 3 * this.PR;
		this.TEXT_Y = 3 * this.PR;
		this.GRAPH_X = 3 * this.PR;
		this.GRAPH_Y = 15 * this.PR;
		this.GRAPH_WIDTH = 174 * this.PR;
		this.GRAPH_HEIGHT = 30 * this.PR;

		this.canvas = document.createElement("canvas");
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.canvas.style.cssText = "width:180px;height:48px";

		const context: CanvasRenderingContext2D | null = this.canvas.getContext("2d");
		if (context === null) throw new Error("Stats context not found");

		this.context = context;
		this.context.font = "bold " + 9 * this.PR + "px Helvetica,Arial,sans-serif";
		this.context.textBaseline = "top";
		this.context.fillStyle = this.background;
		this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
		this.context.fillStyle = this.foreground;
		this.context.fillText(this.name, this.TEXT_X, this.TEXT_Y);
		this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
		this.context.fillStyle = this.background;
		this.context.globalAlpha = 0.9;
		this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
	}

	public update(value: number, maxValue: number): void {
		this.min = Math.min(this.min, value);
		this.max = Math.max(this.max, value);

		this.context.fillStyle = this.background;
		this.context.globalAlpha = 1;
		this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y);
		this.context.fillStyle = this.foreground;
		this.context.fillText(
			Math.round(value) + " " + this.name + " (" + Math.round(this.min) + "-" + Math.round(this.max) + ")",
			this.TEXT_X,
			this.TEXT_Y
		);

		this.context.drawImage(
			this.canvas,
			this.GRAPH_X + this.PR,
			this.GRAPH_Y,
			this.GRAPH_WIDTH - this.PR,
			this.GRAPH_HEIGHT,
			this.GRAPH_X,
			this.GRAPH_Y,
			this.GRAPH_WIDTH - this.PR,
			this.GRAPH_HEIGHT
		);

		this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT);

		this.context.fillStyle = this.background;
		this.context.globalAlpha = 0.9;
		this.context.fillRect(
			this.GRAPH_X + this.GRAPH_WIDTH - this.PR,
			this.GRAPH_Y,
			this.PR,
			Math.round((1 - value / maxValue) * this.GRAPH_HEIGHT)
		);
	}
}
