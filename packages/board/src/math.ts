import { IPoint } from './types';

export const centerPoint = (a: IPoint, b: IPoint): IPoint => {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
};
