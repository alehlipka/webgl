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
  private static readonly zero: Vector4 = new Vector4(0);
  private static readonly one: Vector4 = new Vector4(1);

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

  public static One(): Vector4 {
    return _.cloneDeep<Vector4>(Vector4.one);
  }

  public Length(): number {
    return Math.sqrt(
      this.X * this.X + this.Y * this.Y + this.Z * this.Z + this.W * this.W,
    );
  }

  public static Substract(a: Vector4, b: Vector4): Vector4 {
    const X: number = a.X - b.X;
    const Y: number = a.Y - b.Y;
    const Z: number = a.Z - b.Z;
    const W: number = a.W - b.W;

    return new Vector4(X, Y, Z, W);
  }

  public static Add(a: Vector4, b: Vector4): Vector4 {
    const X: number = a.X + b.X;
    const Y: number = a.Y + b.Y;
    const Z: number = a.Z + b.Z;
    const W: number = a.W + b.W;

    return new Vector4(X, Y, Z, W);
  }

  public static Multiply(a: Vector4, b: number): Vector4 {
    const X: number = a.X * b;
    const Y: number = a.Y * b;
    const Z: number = a.Z * b;
    const W: number = a.W * b;

    return new Vector4(X, Y, Z, W);
  }

  public static Normalize(vec: Vector4): Vector4 {
    const scale: number = 1.0 / vec.Length();
    const X: number = vec.X * scale;
    const Y: number = vec.Y * scale;
    const Z: number = vec.Z * scale;
    const W: number = vec.W * scale;

    return new Vector4(X, Y, Z, W);
  }
}
