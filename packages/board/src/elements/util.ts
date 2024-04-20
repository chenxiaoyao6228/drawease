import {
  IArrowElementData,
  IBaseElement,
  IBaseElementData,
  IBound,
  IDiamondElementData,
  IEllipseElementData,
  ILineElementData,
  IPoint,
  IRectElementData
} from '../types';
import { randomInteger } from '../utils';
import ArrowElement from './Arrow';
import BaseElement from './Base';
import DiamondElement from './Diamond';
import EllipseElement from './Ellipse';
import LineElement from './Line';
import RectElement from './Rect';

export function createElement(data: Partial<IBaseElementData>): BaseElement {
  const _data = {
    ...getDefaultElementData(),
    ...data
  };
  switch (data.type) {
    case 'rectangle':
      return new RectElement(_data as IRectElementData);
    case 'ellipse':
      return new EllipseElement(_data as IEllipseElementData);
    case 'line':
      return new LineElement(_data as ILineElementData);
    case 'diamond':
      return new DiamondElement(_data as IDiamondElementData);
    case 'arrow':
      return new ArrowElement(_data as IArrowElementData);
    default:
      throw new Error(`Unknown element type: ${_data.type}`);
  }
}

export function getDefaultElementData() {
  return {
    id: String(randomInteger()),
    strokeColor: 'black',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    locked: false,
    seed: randomInteger()
  } as Partial<IBaseElementData>;
}

export function getMultipleElementsBounds(elements: IBaseElement[]) {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const element of elements) {
    const bounds = element.getBounds();
    const { x, y, width, height, angle = 0 } = bounds;

    const topLeft = rotatePoint({ x, y }, { x: x + width / 2, y: y + height / 2 }, angle);
    const topRight = rotatePoint({ x: x + width, y }, { x: x + width / 2, y: y + height / 2 }, angle);
    const bottomLeft = rotatePoint({ x, y: y + height }, { x: x + width / 2, y: y + height / 2 }, angle);
    const bottomRight = rotatePoint({ x: x + width, y: y + height }, { x: x + width / 2, y: y + height / 2 }, angle);

    minX = Math.min(minX, topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    minY = Math.min(minY, topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    maxX = Math.max(maxX, topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    maxY = Math.max(maxY, topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
  }

  const width = maxX - minX;
  const height = maxY - minY;

  return { x: minX, y: minY, width, height };
}

export function isPointInBound(point: IPoint, bound: IBound) {
  const { x, y, width, height } = bound;

  return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
}

function rotatePoint(point: IPoint, center: IPoint, angle: number) {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const x = cos * (point.x - center.x) + sin * (point.y - center.y) + center.x;
  const y = cos * (point.y - center.y) - sin * (point.x - center.x) + center.y;
  return { x, y };
}
