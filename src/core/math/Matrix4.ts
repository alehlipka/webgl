import { Vector4 } from "./Vector4.ts";
import { Vector3 } from "./Vector3.ts";
import _ from "lodash";

export class Matrix4 {
    public Row0: Vector4;
    public Row1: Vector4;
    public Row2: Vector4;
    public Row3: Vector4;

    constructor(row0: Vector4, row1: Vector4, row2: Vector4, row3: Vector4) {
        this.Row0 = row0;
        this.Row1 = row1;
        this.Row2 = row2;
        this.Row3 = row3;
    }

    public ToArray(): Float32Array {
        return new Float32Array(
            [
                this.Row0.X, this.Row0.Y, this.Row0.Z, this.Row0.W,
                this.Row1.X, this.Row1.Y, this.Row1.Z, this.Row1.W,
                this.Row2.X, this.Row2.Y, this.Row2.Z, this.Row2.W,
                this.Row3.X, this.Row3.Y, this.Row3.Z, this.Row3.W
            ]
        );
    }

    private static readonly identity: Matrix4 = new Matrix4(Vector4.UnixX(), Vector4.UnixY(), Vector4.UnixZ(), Vector4.UnixW());
    private static readonly zero: Matrix4 = new Matrix4(Vector4.Zero(), Vector4.Zero(), Vector4.Zero(), Vector4.Zero());

    public static Identity(): Matrix4 {
        return _.cloneDeep<Matrix4>(Matrix4.identity);
    }

    public static Zero(): Matrix4 {
        return _.cloneDeep<Matrix4>(Matrix4.zero);
    }

    public Column0(): Vector4 {
        return _.cloneDeep<Vector4>(new Vector4(this.Row0.X, this.Row1.X, this.Row2.X, this.Row3.X));
    }

    public Column1(): Vector4 {
        return _.cloneDeep<Vector4>(new Vector4(this.Row0.X, this.Row1.X, this.Row2.X, this.Row3.X));
    }

    public Column2(): Vector4 {
        return _.cloneDeep<Vector4>(new Vector4(this.Row0.X, this.Row1.X, this.Row2.X, this.Row3.X));
    }

    public Column3(): Vector4 {
        return _.cloneDeep<Vector4>(new Vector4(this.Row0.X, this.Row1.X, this.Row2.X, this.Row3.X));
    }

    public clone(): Matrix4 {
        return _.cloneDeep<Matrix4>(this);
    }

    public Determinant(): number {
        const m11: number = this.Row0.X;
        const m12: number = this.Row0.Y;
        const m13: number = this.Row0.Z;
        const m14: number = this.Row0.W;
        const m21: number = this.Row1.X;
        const m22: number = this.Row1.Y;
        const m23: number = this.Row1.Z;
        const m24: number = this.Row1.W;
        const m31: number = this.Row2.X;
        const m32: number = this.Row2.Y;
        const m33: number = this.Row2.Z;
        const m34: number = this.Row2.W;
        const m41: number = this.Row3.X;
        const m42: number = this.Row3.Y;
        const m43: number = this.Row3.Z;
        const m44: number = this.Row3.W;

        return (m11 * m22 * m33 * m44) - (m11 * m22 * m34 * m43) + (m11 * m23 * m34 * m42) - (m11 * m23 * m32 * m44) 
            + (m11 * m24 * m32 * m43) - (m11 * m24 * m33 * m42) - (m12 * m23 * m34 * m41) + (m12 * m23 * m31 * m44)
            - (m12 * m24 * m31 * m43) + (m12 * m24 * m33 * m41) - (m12 * m21 * m33 * m44) + (m12 * m21 * m34 * m43)
            + (m13 * m24 * m31 * m42)
            - (m13 * m24 * m32 * m41) + (m13 * m21 * m32 * m44) - (m13 * m21 * m34 * m42)
            + (m13 * m22 * m34 * m41) - (m13 * m22 * m31 * m44) - (m14 * m21 * m32 * m43) + (m14 * m21 * m33 * m42)
            - (m14 * m22 * m33 * m41) + (m14 * m22 * m31 * m43) - (m14 * m23 * m31 * m42) + (m14 * m23 * m32 * m41);
    }

    public static Perspective(fieldOfView: number, aspect: number, depthNear: number, depthFar: number): Matrix4 {
        if (fieldOfView <= 0 || fieldOfView > Math.PI) {
            throw new Error("Wrong field of view");
        }

        if (aspect <= 0) {
            throw new Error("Wrong aspect ratio");
        }

        if (depthNear <= 0) {
            throw new Error("Depth near must be greater then zero");
        }

        if (depthFar <= 0) {
            throw new Error("Depth far must be greater then zero");
        }

        const maxY: number = depthNear * Math.tan(0.5 * fieldOfView);
        const minY: number = -maxY;
        const minX: number = minY * aspect;
        const maxX: number = maxY * aspect;

        // perspective of center code
        const x: number = 2.0 * depthNear / (maxX - minX);
        const y: number = 2.0 * depthNear / (maxY - minY);
        const a: number = (maxX + minX) / (maxX - minX);
        const b: number = (maxY + minY) / (maxY - minY);
        const c: number = -(depthFar + depthNear) / (depthFar - depthNear);
        const d: number = -(2.0 * depthFar * depthNear) / (depthFar - depthNear);

        return new Matrix4(
            new Vector4(x, 0, 0, 0),
            new Vector4(0, y, 0, 0),
            new Vector4(a, b, c, -1.0),
            new Vector4(0, 0, d, 0),
        );
    }

    public static LookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix4 {
        const z: Vector3 = Vector3.Normalize(Vector3.Substract(eye, target));
        const x: Vector3 = Vector3.Normalize(Vector3.Cross(up, z));
        const y: Vector3 = Vector3.Normalize(Vector3.Cross(z, x));

        let result: Matrix4 = Matrix4.Zero();
        result.Row0.X = x.X;
        result.Row0.Y = y.X;
        result.Row0.Z = z.X;
        result.Row0.W = 0;
        result.Row1.X = x.Y;
        result.Row1.Y = y.Y;
        result.Row1.Z = z.Y;
        result.Row1.W = 0;
        result.Row2.X = x.Z;
        result.Row2.Y = y.Z;
        result.Row2.Z = z.Z;
        result.Row2.W = 0;
        result.Row3.X = -((x.X * eye.X) + (x.Y * eye.Y) + (x.Z * eye.Z));
        result.Row3.Y = -((y.X * eye.X) + (y.Y * eye.Y) + (y.Z * eye.Z));
        result.Row3.Z = -((z.X * eye.X) + (z.Y * eye.Y) + (z.Z * eye.Z));
        result.Row3.W = 1;

        return result;
    }

    public static CreateTranslation(vector: Vector3): Matrix4 {
        let result: Matrix4 = Matrix4.Identity();
        result.Row3.X = vector.X;
        result.Row3.Y = vector.Y;
        result.Row3.Z = vector.Z;

        return result;
    }

    public static CreateRotationX(angle: number): Matrix4 {
        const cos: number = Math.cos(angle);
        const sin: number = Math.sin(angle);

        let result: Matrix4 = Matrix4.Identity();
        result.Row1.Y = cos;
        result.Row1.Z = sin;
        result.Row2.Y = -sin;
        result.Row2.Z = cos;

        return result;
    }

    public static CreateRotationY(angle: number): Matrix4 {
        const cos: number = Math.cos(angle);
        const sin: number = Math.sin(angle);

        let result: Matrix4 = Matrix4.Identity();
        result.Row0.X = cos;
        result.Row0.Z = -sin;
        result.Row2.X = sin;
        result.Row2.Z = cos;

        return result;
    }

    public static CreateRotationZ(angle: number): Matrix4 {
        const cos: number = Math.cos(angle);
        const sin: number = Math.sin(angle);

        let result: Matrix4 = Matrix4.Identity();
        result.Row0.X = cos;
        result.Row0.Y = sin;
        result.Row1.X = -sin;
        result.Row1.Y = cos;

        return result;
    }

    public static Multiply(left: Matrix4, right: Matrix4): Matrix4 {
        const leftM11: number = left.Row0.X;
        const leftM12: number = left.Row0.Y;
        const leftM13: number = left.Row0.Z;
        const leftM14: number = left.Row0.W;
        const leftM21: number = left.Row1.X;
        const leftM22: number = left.Row1.Y;
        const leftM23: number = left.Row1.Z;
        const leftM24: number = left.Row1.W;
        const leftM31: number = left.Row2.X;
        const leftM32: number = left.Row2.Y;
        const leftM33: number = left.Row2.Z;
        const leftM34: number = left.Row2.W;
        const leftM41: number = left.Row3.X;
        const leftM42: number = left.Row3.Y;
        const leftM43: number = left.Row3.Z;
        const leftM44: number = left.Row3.W;
        const rightM11: number = right.Row0.X;
        const rightM12: number = right.Row0.Y;
        const rightM13: number = right.Row0.Z;
        const rightM14: number = right.Row0.W;
        const rightM21: number = right.Row1.X;
        const rightM22: number = right.Row1.Y;
        const rightM23: number = right.Row1.Z;
        const rightM24: number = right.Row1.W;
        const rightM31: number = right.Row2.X;
        const rightM32: number = right.Row2.Y;
        const rightM33: number = right.Row2.Z;
        const rightM34: number = right.Row2.W;
        const rightM41: number = right.Row3.X;
        const rightM42: number = right.Row3.Y;
        const rightM43: number = right.Row3.Z;
        const rightM44: number = right.Row3.W;

        let result: Matrix4 = Matrix4.Identity();
        result.Row0.X = (leftM11 * rightM11) + (leftM12 * rightM21) + (leftM13 * rightM31) + (leftM14 * rightM41);
        result.Row0.Y = (leftM11 * rightM12) + (leftM12 * rightM22) + (leftM13 * rightM32) + (leftM14 * rightM42);
        result.Row0.Z = (leftM11 * rightM13) + (leftM12 * rightM23) + (leftM13 * rightM33) + (leftM14 * rightM43);
        result.Row0.W = (leftM11 * rightM14) + (leftM12 * rightM24) + (leftM13 * rightM34) + (leftM14 * rightM44);
        result.Row1.X = (leftM21 * rightM11) + (leftM22 * rightM21) + (leftM23 * rightM31) + (leftM24 * rightM41);
        result.Row1.Y = (leftM21 * rightM12) + (leftM22 * rightM22) + (leftM23 * rightM32) + (leftM24 * rightM42);
        result.Row1.Z = (leftM21 * rightM13) + (leftM22 * rightM23) + (leftM23 * rightM33) + (leftM24 * rightM43);
        result.Row1.W = (leftM21 * rightM14) + (leftM22 * rightM24) + (leftM23 * rightM34) + (leftM24 * rightM44);
        result.Row2.X = (leftM31 * rightM11) + (leftM32 * rightM21) + (leftM33 * rightM31) + (leftM34 * rightM41);
        result.Row2.Y = (leftM31 * rightM12) + (leftM32 * rightM22) + (leftM33 * rightM32) + (leftM34 * rightM42);
        result.Row2.Z = (leftM31 * rightM13) + (leftM32 * rightM23) + (leftM33 * rightM33) + (leftM34 * rightM43);
        result.Row2.W = (leftM31 * rightM14) + (leftM32 * rightM24) + (leftM33 * rightM34) + (leftM34 * rightM44);
        result.Row3.X = (leftM41 * rightM11) + (leftM42 * rightM21) + (leftM43 * rightM31) + (leftM44 * rightM41);
        result.Row3.Y = (leftM41 * rightM12) + (leftM42 * rightM22) + (leftM43 * rightM32) + (leftM44 * rightM42);
        result.Row3.Z = (leftM41 * rightM13) + (leftM42 * rightM23) + (leftM43 * rightM33) + (leftM44 * rightM43);
        result.Row3.W = (leftM41 * rightM14) + (leftM42 * rightM24) + (leftM43 * rightM34) + (leftM44 * rightM44);

        return result;
    }

    public static Invese(mat: Matrix4): Matrix4 {
        const a00: number = mat.Row0.X;
        const a01: number = mat.Row0.Y;
        const a02: number = mat.Row0.Z;
        const a03: number = mat.Row0.W;
        const a10: number = mat.Row1.X;
        const a11: number = mat.Row1.Y;
        const a12: number = mat.Row1.Z;
        const a13: number = mat.Row1.W;
        const a20: number = mat.Row2.X;
        const a21: number = mat.Row2.Y;
        const a22: number = mat.Row2.Z;
        const a23: number = mat.Row2.W;
        const a30: number = mat.Row3.X;
        const a31: number = mat.Row3.Y;
        const a32: number = mat.Row3.Z;
        const a33: number = mat.Row3.W;

        const b00: number = a00 * a11 - a01 * a10;
        const b01: number = a00 * a12 - a02 * a10;
        const b02: number = a00 * a13 - a03 * a10;
        const b03: number = a01 * a12 - a02 * a11;
        const b04: number = a01 * a13 - a03 * a11;
        const b05: number = a02 * a13 - a03 * a12;
        const b06: number = a20 * a31 - a21 * a30;
        const b07: number = a20 * a32 - a22 * a30;
        const b08: number = a20 * a33 - a23 * a30;
        const b09: number = a21 * a32 - a22 * a31;
        const b10: number = a21 * a33 - a23 * a31;
        const b11: number = a22 * a33 - a23 * a32;

        let det: number = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (det == 0) throw new Error("Inverse error");
        det = 1.0 / det;


        let result: Matrix4 = new Matrix4(
            new Vector4(
                (a11 * b11 - a12 * b10 + a13 * b09) * det,
                (a02 * b10 - a01 * b11 - a03 * b09) * det,
                (a31 * b05 - a32 * b04 + a33 * b03) * det,
                (a22 * b04 - a21 * b05 - a23 * b03) * det,
            ),
            new Vector4(
                (a12 * b08 - a10 * b11 - a13 * b07) * det,
                (a00 * b11 - a02 * b08 + a03 * b07) * det,
                (a32 * b02 - a30 * b05 - a33 * b01) * det,
                (a20 * b05 - a22 * b02 + a23 * b01) * det,
            ),
            new Vector4(
                (a10 * b10 - a11 * b08 + a13 * b06) * det,
                (a01 * b08 - a00 * b10 - a03 * b06) * det,
                (a30 * b04 - a31 * b02 + a33 * b00) * det,
                (a21 * b02 - a20 * b04 - a23 * b00) * det,
            ),
            new Vector4(
                (a11 * b07 - a10 * b09 - a12 * b06) * det,
                (a00 * b09 - a01 * b07 + a02 * b06) * det,
                (a31 * b01 - a30 * b03 - a32 * b00) * det,
                (a20 * b03 - a21 * b01 + a22 * b00) * det,
            )
        );

        return result;
    }

    public static Transpose(matrix: Matrix4): Matrix4 {
        return new Matrix4(matrix.Column0(), matrix.Column1(), matrix.Column2(), matrix.Column3());
    }
}
