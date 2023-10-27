import _ from "lodash";

export class Vector2 {
  public X: number;
  public Y: number;

  constructor(x: number, y?: number) {
    this.X = x;
    this.Y = y ?? x;
  }

  private static readonly unitX: Vector2 = new Vector2(1, 0);
  private static readonly unitY: Vector2 = new Vector2(0, 1);
  private static readonly zero: Vector2 = new Vector2(0, 0);
  private static readonly one: Vector2 = new Vector2(1, 1);

  public static UnitX(): Vector2 {
    return _.cloneDeep<Vector2>(Vector2.unitX);
  }

  public static UnitY(): Vector2 {
    return _.cloneDeep<Vector2>(Vector2.unitY);
  }

  public static Zero(): Vector2 {
    return _.cloneDeep<Vector2>(Vector2.zero);
  }

  public static One(): Vector2 {
    return _.cloneDeep<Vector2>(Vector2.one);
  }

  public ToArray(): number[] {
    return [this.X, this.Y];
  }

  public Length(): number {
    return Math.sqrt(this.X * this.X + this.Y * this.Y);
  }

  public static Substract(a: Vector2, b: Vector2): Vector2 {
    const X: number = a.X - b.X;
    const Y: number = a.Y - b.Y;

    return new Vector2(X, Y);
  }

  public static Add(a: Vector2, b: Vector2): Vector2 {
    const X: number = a.X + b.X;
    const Y: number = a.Y + b.Y;

    return new Vector2(X, Y);
  }
}
