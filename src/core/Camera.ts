import { MathHelper } from "./math/MathHelper";
import { Matrix4 } from "./math/Matrix4";
import { Vector2 } from "./math/Vector2";
import { Vector3 } from "./math/Vector3";
import { PiOver2 } from "./math/costants";

export class Camera {
  private gl;

  private position: Vector3;
  private front: Vector3;
  private up: Vector3;
  private right: Vector3;

  private _pitch: number;
  private _yaw: number;

  private aspectRatio: number;
  private fov: number;
  private near: number;
  private far: number;

  private firstMove: boolean;
  private lastPosition: Vector2;

  constructor(
    gl: WebGL2RenderingContext,
    aspectRatio: number,
    fov: number,
    near: number,
    far: number,
  ) {
    this.gl = gl;

    this.position = new Vector3(0, 0, 10);

    this.front = new Vector3(0, 0, -1);
    this.up = Vector3.UnitY();
    this.right = Vector3.UnitX();

    this._yaw = -PiOver2;
    this._pitch = 0;

    this.aspectRatio = aspectRatio;
    this.fov = fov;
    this.near = near;
    this.far = far;

    this.firstMove = true;
    this.lastPosition = Vector2.Zero();

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>this.gl.canvas;
    canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const cameraSpeed: number = 1.5;

    if (event.code == "KeyW") {
      const frontSpeed = Vector3.Multiply(this.front, cameraSpeed);
      this.position = Vector3.Add(this.position, frontSpeed);
    }

    if (event.code == "KeyS") {
      const backSpeed = Vector3.Multiply(this.front, cameraSpeed);
      this.position = Vector3.Substract(this.position, backSpeed);
    }

    if (event.code == "KeyA") {
      const leftSpeed = Vector3.Multiply(this.right, cameraSpeed);
      this.position = Vector3.Substract(this.position, leftSpeed);
    }

    if (event.code == "KeyD") {
      const rightSpeed = Vector3.Multiply(this.right, cameraSpeed);
      this.position = Vector3.Add(this.position, rightSpeed);
    }

    if (event.code == "Space") {
      const upSpeed = Vector3.Multiply(this.up, cameraSpeed);
      this.position = Vector3.Add(this.position, upSpeed);
    }

    if (event.code == "ShiftLeft") {
      const downSpeed = Vector3.Multiply(this.up, cameraSpeed);
      this.position = Vector3.Substract(this.position, downSpeed);
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    const sensitivity: number = 0.2;

    if ((event.buttons | event.button) === 1) {
      if (this.firstMove) {
        // This bool variable is initially set to true.
        this.lastPosition = new Vector2(event.clientX, event.clientY);
        this.firstMove = false;
      } else {
        // Calculate the offset of the mouse position
        var deltaX = event.clientX - this.lastPosition.X;
        var deltaY = event.clientY - this.lastPosition.Y;
        this.lastPosition = new Vector2(event.clientX, event.clientY);

        // Apply the camera pitch and yaw (we clamp the pitch in the camera class)
        this.yaw += deltaX * sensitivity;
        this.pitch -= deltaY * sensitivity; // Reversed since y-coordinates range from bottom to top
      }
    } else {
      this.firstMove = true;
    }
  }

  public get pitch(): number {
    return MathHelper.ToDegrees(this._pitch);
  }
  public set pitch(value: number) {
    // We clamp the pitch value between -89 and 89 to prevent the camera from going upside down, and a bunch
    // of weird "bugs" when you are using euler angles for rotation.
    // If you want to read more about this you can try researching a topic called gimbal lock
    const angle: number = MathHelper.Clamp(value, -89, 89);
    this._pitch = MathHelper.ToRadians(angle);
    this.updateVectors();
  }

  public get yaw(): number {
    return MathHelper.ToDegrees(this._yaw);
  }
  public set yaw(value: number) {
    this._yaw = MathHelper.ToRadians(value);
    this.updateVectors();
  }

  public resize(width: number, height: number): void {
    this.aspectRatio = width / height;
  }

  public getViewMatrix(): Matrix4 {
    return Matrix4.LookAt(
      this.position,
      Vector3.Add(this.position, this.front),
      this.up,
    );
  }

  public getProjectionMatrix(): Matrix4 {
    return Matrix4.Perspective(this.fov, this.aspectRatio, this.near, this.far);
  }

  private updateVectors(): void {
    // First, the front matrix is calculated using some basic trigonometry.
    this.front.X = Math.cos(this._pitch) * Math.cos(this._yaw);
    this.front.Y = Math.sin(this._pitch);
    this.front.Z = Math.cos(this._pitch) * Math.sin(this._yaw);

    // We need to make sure the vectors are all normalized, as otherwise we would get some funky results.
    this.front = Vector3.Normalize(this.front);

    // Calculate both the right and the up vector using cross product.
    // Note that we are calculating the right from the global up; this behaviour might
    // not be what you need for all cameras so keep this in mind if you do not want a FPS camera.
    this.right = Vector3.Normalize(Vector3.Cross(this.front, Vector3.UnitY()));
    this.up = Vector3.Normalize(Vector3.Cross(this.right, this.front));
  }
}
