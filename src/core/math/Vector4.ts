import _ from "lodash";

export class Vector4 {
    public X: number;
    public Y: number;
    public Z: number;
    public W: number;

    constructor(x: number, y: number, z: number, w: number) {
        this.X = x;
        this.Y = y;
        this.Z = z;
        this.W = w;
    }

    private static readonly unixX: Vector4 = new Vector4(1, 0, 0, 0);
    private static readonly unixY: Vector4 = new Vector4(0, 1, 0, 0);
    private static readonly unixZ: Vector4 = new Vector4(0, 0, 1, 0);
    private static readonly unixW: Vector4 = new Vector4(0, 0, 0, 1);
    private static readonly zero: Vector4 = new Vector4(0, 0, 0, 0);

    public static UnixX(): Vector4 {
        return _.cloneDeep<Vector4>(Vector4.unixX);
    }
    public static UnixY(): Vector4 {
        return _.cloneDeep<Vector4>(Vector4.unixY);
    }
    public static UnixZ(): Vector4 {
        return _.cloneDeep<Vector4>(Vector4.unixZ);
    }
    public static UnixW(): Vector4 {
        return _.cloneDeep<Vector4>(Vector4.unixW);
    }
    public static Zero(): Vector4 {
        return _.cloneDeep<Vector4>(Vector4.zero);
    }
}
