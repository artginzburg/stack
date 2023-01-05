import {
  DoubleSide,
  Material,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector2,
  Vector3,
} from 'three';

export class PerfectEffect {
  mesh: Mesh;
  constructor(position: Vector3, size: Vector2, private destroyFunction: () => void) {
    const geometry = new PlaneGeometry(size.x + 10, size.y + 10);
    const material = new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide });
    material.transparent = true;
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(position.x, position.y - 5, position.z);
    this.mesh.rotation.x = Math.PI / 2;
  }

  update(delta: number) {
    const mat = this.mesh.material as Material;
    if (mat.opacity <= 0) {
      this.destroy();
    }

    mat.opacity -= delta * 2;
  }

  destroy() {
    this.destroyFunction();
  }
}
