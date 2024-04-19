import { IArrowElementData, IBaseElementData, IDiamondElementData, IEllipseElementData, ILineElementData, IRectElementData } from '../types';
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
    ...data,
    seed: randomInteger()
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
    strokeColor: 'black',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    locked: false
  } as Partial<IBaseElementData>;
}
