import { KeyCode } from "./types";

export class Keyboard {
	private static KeyState: KeyCode[] = [];

	public static Down(keyCode: string): void {
		const state = this.getStateByCode(keyCode);
		if (state === null) {
			this.KeyState.push({ code: keyCode, isDown: true });
		} else {
			state.isDown = true;
		}
	}

	public static Up(keyCode: string): void {
		const state = this.getStateByCode(keyCode);
		if (state === null) {
			this.KeyState.push({ code: keyCode, isDown: false });
		} else {
			state.isDown = false;
		}
	}

	public static IsDown(keyCode: string): boolean {
		const state = this.getStateByCode(keyCode) ?? false;

		return state && state.isDown;
	}

	private static getStateByCode(keyCode: string): KeyCode | null {
		const state = this.KeyState.find((code) => code.code == keyCode);
		if (!state) return null;

		return state;
	}
}
