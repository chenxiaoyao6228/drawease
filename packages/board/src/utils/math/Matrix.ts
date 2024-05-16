import { IMatrixArr, IPoint } from '@drawease/board/types';

import { ISize } from './../../types/element';

export class Matrix {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;

  constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }

  toArray(): IMatrixArr {
    return [this.a, this.b, this.c, this.d, this.tx, this.ty];
  }

  set(a: number, b: number = 0, c: number = 0, d: number, tx: number, ty: number): Matrix {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;

    return this;
  }

  translate(x: number, y: number): Matrix {
    this.tx += x;
    this.ty += y;
    return this;
  }

  scale(x: number, y: number): Matrix {
    this.a *= x;
    this.b *= x;
    this.c *= y;
    this.d *= y;
    return this;
  }

  rotate(angle: number): Matrix {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const { a, b, c, d, tx, ty } = this;

    // Update the matrix elements for rotation
    this.a = a * cos + b * sin;
    this.b = b * cos - a * sin;
    this.c = c * cos + d * sin;
    this.d = d * cos - c * sin;

    // Update the translation elements
    this.tx = tx * cos + ty * sin;
    this.ty = ty * cos - tx * sin;

    return this;
  }

  append(matrix: Matrix): Matrix {
    const a1 = this.a;
    const b1 = this.b;
    const c1 = this.c;
    const d1 = this.d;
    const tx1 = this.tx;
    const ty1 = this.ty;

    const a2 = matrix.a;
    const b2 = matrix.b;
    const c2 = matrix.c;
    const d2 = matrix.d;
    const tx2 = matrix.tx;
    const ty2 = matrix.ty;

    const a = a1 * a2 + c1 * b2;
    const b = b1 * a2 + d1 * b2;
    const c = a1 * c2 + c1 * d2;
    const d = b1 * c2 + d1 * d2;
    const tx = a1 * tx2 + c1 * ty2 + tx1;
    const ty = b1 * tx2 + d1 * ty2 + ty1;

    this.set(a, b, c, d, tx, ty);

    return this;
  }

  clone(): Matrix {
    return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }

  apply(pos: IPoint, newPos?: IPoint) {
    const x = pos.x;
    const y = pos.y;

    newPos = newPos || pos;

    newPos.x = this.a * x + this.c * y + this.tx;
    newPos.y = this.b * x + this.d * y + this.ty;

    return newPos;
  }

  applyInverse(pos: IPoint, newPos?: IPoint) {
    const id = 1 / (this.a * this.d + this.c * -this.b);
    const x = pos.x;
    const y = pos.y;

    newPos = newPos || { x: 0, y: 0 };

    newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
    newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;

    return newPos;
  }
}

export function getTransformedSize(s: ISize, transform: IMatrixArr) {
  const matrix = new Matrix(...transform!);
  const width = matrix.a * s.width;
  const height = matrix.d * s.height;
  return {
    width,
    height
  };
}
