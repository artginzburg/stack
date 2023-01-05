import { MeshPhongMaterial, Vector2, Vector3 } from 'three';
import { Tile } from './Tile';

export class FadingTile extends Tile {
  private material: MeshPhongMaterial;
  private timer = 0;
  private animationTime = 0.3;

  constructor(position: Vector3, size: Vector2, index: number) {
    super(position, size, index);
    this.material = this.mesh.material as MeshPhongMaterial;
    this.material.transparent = true;
  }

  update(delta: number) {
    const ease = (t: number) => t * t * (3.0 - 2.0 * t);
    if (this.timer < this.animationTime) {
      this.material.opacity = 1 - ease(this.timer / this.animationTime);
      this.timer += delta;
    }
  }
}
