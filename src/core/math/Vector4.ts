import _ from "lodash";

export class Vector4 {
    public X: number;
    public Y: number;
    public Z: number;
    public W: number;

    constructor(x: number, y?: number, z?: number, w?: number) {
        this.X = x;
        this.Y = y ?? x;
        this.Z = z ?? x;
        this.W = w ?? x;
    }

    private static readonly unitX: Vector4 = new Vector4(1, 0, 0, 0);
    private static readonly unitY: Vector4 = new Vector4(0, 1, 0, 0);
    private static readonly unitZ: Vector4 = new Vector4(0, 0, 1, 0);
    private static readonly unitW: Vector4 = new Vector4(0, 0, 0, 1);
    private static readonly zero: Vector4 = new Vector4(0, 0, 0, 0);

    public static UnitX(): Vector4 {
        return _.cloneDeep<Vector4>(Vector4.unitX);
    }
    public static UnitY(): Vector4 {
        return _.cloneDeep<Vector4>(Vector4.unitY);
    }
    public static UnitZ(): Vector4 {
        return _.cloneDeep<Vector4>(Vector4.unitZ);
    }
    public static UnitW(): Vector4 {
        return _.cloneDeep<Vector4>(Vector4.unitW);
    }
    public static Zero(): Vector4 {
        return _.cloneDeep<Vector4>(Vector4.zero);
    }
}
