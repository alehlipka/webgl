import {Vector4} from "./Vector4.ts";
import {Vector3} from "./Vector3.ts";
import _ from "lodash";
import {Epsilon} from "./costants.ts";

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

    public static Perspective(fieldOfView: number, aspect: number, depthNear: number, depthFar: number): Matrix4 {
        if (fieldOfView <= 0 || fieldOfView > Math.PI)
        {
            throw new Error("Wrong field of view");
        }

        if (aspect <= 0)
        {
            throw new Error("Wrong aspect ratio");
        }

        if (depthNear <= 0)
        {
            throw new Error("Depth near must be greater then zero");
        }

        if (depthFar <= 0)
        {
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
        const z: Vector3 = Vector3.Normalize( Vector3.Substract(eye, target));
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

    public static Invert(mat: Matrix4): Matrix4 {
        const a: number = mat.Row0.X;
        const b: number = mat.Row1.X;
        const c: number = mat.Row2.X;
        const d: number = mat.Row3.X;
        const e: number = mat.Row0.Y;
        const f: number = mat.Row1.Y;
        const g: number = mat.Row2.Y;
        const h: number = mat.Row3.Y;
        const i: number = mat.Row0.Z;
        const j: number = mat.Row1.Z;
        const k: number = mat.Row2.Z;
        const l: number = mat.Row3.Z;
        const m: number = mat.Row0.W;
        const n: number = mat.Row1.W;
        const o: number = mat.Row2.W;
        const p: number = mat.Row3.W;

        const kp_lo: number = k * p - l * o;
        const jp_ln: number = j * p - l * n;
        const jo_kn: number = j * o - k * n;
        const ip_lm: number = i * p - l * m;
        const io_km: number = i * o - k * m;
        const in_jm: number = i * n - j * m;

        const a11: number = +(f * kp_lo - g * jp_ln + h * jo_kn);
        const a12: number = -(e * kp_lo - g * ip_lm + h * io_km);
        const a13: number = +(e * jp_ln - f * ip_lm + h * in_jm);
        const a14: number = -(e * jo_kn - f * io_km + g * in_jm);

        const det: number = a * a11 + b * a12 + c * a13 + d * a14;

        if (Math.abs(det) < Epsilon)
        {
            throw new Error("Matrix is singular and cannot be inverted.");
        }

        const invDet: number = 1.0 / det;

        const row0: Vector4 = new Vector4(a11 * invDet, a12 * invDet, a13 * invDet, a14 * invDet);

        const row1: Vector4 = new Vector4(
            -(b * kp_lo - c * jp_ln + d * jo_kn) * invDet,
            +(a * kp_lo - c * ip_lm + d * io_km) * invDet,
            -(a * jp_ln - b * ip_lm + d * in_jm) * invDet,
            +(a * jo_kn - b * io_km + c * in_jm) * invDet
        );

        const gp_ho: number = g * p - h * o;
        const fp_hn: number = f * p - h * n;
        const fo_gn: number = f * o - g * n;
        const ep_hm: number = e * p - h * m;
        const eo_gm: number = e * o - g * m;
        const en_fm: number = e * n - f * m;

        const row2: Vector4 = new Vector4(
            +(b * gp_ho - c * fp_hn + d * fo_gn) * invDet,
            -(a * gp_ho - c * ep_hm + d * eo_gm) * invDet,
            +(a * fp_hn - b * ep_hm + d * en_fm) * invDet,
            -(a * fo_gn - b * eo_gm + c * en_fm) * invDet
        );

        const gl_hk: number = g * l - h * k;
        const fl_hj: number = f * l - h * j;
        const fk_gj: number = f * k - g * j;
        const el_hi: number = e * l - h * i;
        const ek_gi: number = e * k - g * i;
        const ej_fi: number = e * j - f * i;

        const row3: Vector4 = new Vector4(
            -(b * gl_hk - c * fl_hj + d * fk_gj) * invDet,
            +(a * gl_hk - c * el_hi + d * ek_gi) * invDet,
            -(a * fl_hj - b * el_hi + d * ej_fi) * invDet,
            +(a * fk_gj - b * ek_gi + c * ej_fi) * invDet
        );

        return new Matrix4(row0, row1, row2, row3);
    }

    public static Transpose(matrix: Matrix4): Matrix4 {
        return new Matrix4(matrix.Column0(), matrix.Column1(), matrix.Column2(), matrix.Column3());
    }
}
