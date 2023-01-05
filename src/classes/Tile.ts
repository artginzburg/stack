import { BoxGeometry, Color, Mesh, MeshPhongMaterial, Vector2, Vector3 } from 'three';

export class Tile {
  mesh: Mesh;
  private height = 10;

  constructor(position: Vector3, size: Vector2, private index: number) {
    const material = new MeshPhongMaterial();
    // material.color.setHSL((index * 5) / 360, 0.5, 0.5);
    material.color = new Color(`hsl(${index * 5}, 50%, 50%)`);
    const geometry = new BoxGeometry(size.x, this.height, size.y);
    this.mesh = new Mesh(geometry, material);
    this.mesh.receiveShadow = true;
    this.mesh.position.set(position.x, this.index * this.height, position.z);
  }
}
