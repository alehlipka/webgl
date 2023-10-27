import _ from "lodash";
import { Matrix4 } from "./Matrix4";

export class Vector3 {
  public X: number;
  public Y: number;
  public Z: number;

  constructor(x: number, y?: number, z?: number) {
    this.X = x;
    this.Y = y ?? x;
    this.Z = z ?? x;
  }

  private static readonly unitX: Vector3 = new Vector3(1, 0, 0);
  private static readonly unitY: Vector3 = new Vector3(0, 1, 0);
  private static readonly unitZ: Vector3 = new Vector3(0, 0, 1);
  private static readonly zero: Vector3 = new Vector3(0, 0, 0);
  private static readonly one: Vector3 = new Vector3(1, 1, 1);

  public static UnitX(): Vector3 {
    return _.cloneDeep<Vector3>(Vector3.unitX);
  }

  public static UnitY(): Vector3 {
    return _.cloneDeep<Vector3>(Vector3.unitY);
  }

  public static UnitZ(): Vector3 {
    return _.cloneDeep<Vector3>(Vector3.unitZ);
  }

  public static Zero(): Vector3 {
    return _.cloneDeep<Vector3>(Vector3.zero);
  }

  public static One(): Vector3 {
    return _.cloneDeep<Vector3>(Vector3.one);
  }

  public ToArray(): number[] {
    return [this.X, this.Y, this.Z];
  }

  public Length(): number {
    return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
  }

  public static Substract(a: Vector3, b: Vector3): Vector3 {
    const X: number = a.X - b.X;
    const Y: number = a.Y - b.Y;
    const Z: number = a.Z - b.Z;

    return new Vector3(X, Y, Z);
  }

  public static Add(a: Vector3, b: Vector3): Vector3 {
    const X: number = a.X + b.X;
    const Y: number = a.Y + b.Y;
    const Z: number = a.Z + b.Z;

    return new Vector3(X, Y, Z);
  }

  public static Multiply(a: Vector3, b: number): Vector3 {
    const X: number = a.X * b;
    const Y: number = a.Y * b;
    const Z: number = a.Z * b;

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
    const X: number = left.Y * right.Z - left.Z * right.Y;
    const Y: number = left.Z * right.X - left.X * right.Z;
    const Z: number = left.X * right.Y - left.Y * right.X;

    return new Vector3(X, Y, Z);
  }

  public static Transform(vec: Vector3, mat: Matrix4): Vector3 {
    const X = vec.X * mat.Row0.X + vec.Y * mat.Row1.X + vec.Z * mat.Row2.X;

    const Y = vec.X * mat.Row0.Y + vec.Y * mat.Row1.Y + vec.Z * mat.Row2.Y;

    const Z = vec.X * mat.Row0.Z + vec.Y * mat.Row1.Z + vec.Z * mat.Row2.Z;

    return new Vector3(X, Y, Z);
  }
}
