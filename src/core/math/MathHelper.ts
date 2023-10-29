export class MathHelper {
	public static ToRadians(degrees: number) {
		return degrees * (Math.PI / 180);
	}

	public static ToDegrees(radians: number) {
		return radians * (180 / Math.PI);
	}

	public static Clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}

	public static IsPowerOfTwo(value: number): boolean {
		if (value < 1) {
			return false;
		}
		return (value & (value - 1)) === 0;
	}
}
