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
import { Matrix } from '../utils/math/Matrix';
import ArrowElement from './Arrow';
import BaseElement from './Base';
import { IDENTITY_TRANSFORM_DATA } from './constant';
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
    transform: IDENTITY_TRANSFORM_DATA,
    seed: randomInteger()
  } as Partial<IBaseElementData>;
}

export function isSameElement(el1: IBaseElement, el2: IBaseElement) {
  return el1.getData().id === el2.getData().id;
}

export function isPointInBound(point: IPoint, bound: IBound) {
  const { width, height, transform } = bound;

  // Create a matrix and calculate the inverse transformation of the point
  const matrix = new Matrix(...transform);
  const inversePoint = matrix.applyInverse(point);

  // Check if the transformed point falls within the origin-aligned rectangle
  return inversePoint.x >= 0 && inversePoint.x <= width && inversePoint.y >= 0 && inversePoint.y <= height;
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
    const { width, height, transform } = element.getBounds();
    const matrix = new Matrix(...transform);

    // Transform each corner of the rectangle
    const corners = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: 0, y: height },
      { x: width, y: height }
    ].map((corner) => matrix.apply(corner));

    // Update min and max coordinates
    corners.forEach((corner) => {
      minX = Math.min(minX, corner.x);
      minY = Math.min(minY, corner.y);
      maxX = Math.max(maxX, corner.x);
      maxY = Math.max(maxY, corner.y);
    });
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    transform: IDENTITY_TRANSFORM_DATA
  };
}
