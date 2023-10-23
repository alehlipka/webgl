import _ from "lodash";

export class Vector3 {
    public X: number;
    public Y: number;
    public Z: number;

    constructor(x: number, y: number, z: number) {
        this.X = x;
        this.Y = y;
        this.Z = z;
    }

    private static readonly unixX: Vector3 = new Vector3(1, 0, 0);
    private static readonly unixY: Vector3 = new Vector3(0, 1, 0);
    private static readonly unixZ: Vector3 = new Vector3(0, 0, 1);
    private static readonly zero: Vector3 = new Vector3(0, 0, 0);
    private static readonly one: Vector3 = new Vector3(1, 1, 1);

    public static UnixX(): Vector3 {
        return _.cloneDeep<Vector3>(Vector3.unixX);
    }

    public static UnixY(): Vector3 {
        return _.cloneDeep<Vector3>(Vector3.unixY);
    }

    public static UnixZ(): Vector3 {
        return _.cloneDeep<Vector3>(Vector3.unixZ);
    }

    public static Zero(): Vector3 {
        return _.cloneDeep<Vector3>(Vector3.zero);
    }

    public static One(): Vector3 {
        return _.cloneDeep<Vector3>(Vector3.one);
    }

    public Length(): number {
        return Math.sqrt((this.X * this.X) + (this.Y * this.Y) + (this.Z * this.Z));
    }

    public static Substract(a: Vector3, b: Vector3): Vector3 {
        const X: number = a.X - b.X;
        const Y: number = a.Y - b.Y;
        const Z: number = a.Z - b.Z;

        return new Vector3(X, Y, Z);
    }

    public static Normalize(vec: Vector3): Vector3 {
        const scale: number = 1.0 / vec.Length();
        const X: number = vec.X * scale;
        const Y: number = vec.Y * scale;
        const Z: number = vec.Z * scale;

        return new Vector3(X, Y, Z);
    }

    public static Cross(left: Vector3, right: Vector3): Vector3 {
        const X: number = (left.Y * right.Z) - (left.Z * right.Y);
        const Y: number = (left.Z * right.X) - (left.X * right.Z);
        const Z: number = (left.X * right.Y) - (left.Y * right.X);

        return new Vector3(X, Y, Z);
    }
}