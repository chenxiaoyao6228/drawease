import { ArrowElementData, BaseElementData, DiamondElementData, EllipseElementData, LineElementData, RectElementData } from '../types';
import ArrowElement from './Arrow';
import BaseElement from './Base';
import DiamondElement from './Diamond';
import EllipseElement from './Ellipse';
import LineElement from './Line';
import RectElement from './Rect';

export function createElement(data: Partial<BaseElementData>): BaseElement {
  const _data = {
    ...getDefaultElementData(),
    ...data
  };
  switch (data.type) {
    case 'rectangle':
      return new RectElement(_data as RectElementData);
    case 'ellipse':
      return new EllipseElement(_data as EllipseElementData);
    case 'line':
      return new LineElement(_data as LineElementData);
    case 'diamond':
      return new DiamondElement(_data as DiamondElementData);
    case 'arrow':
      return new ArrowElement(_data as ArrowElementData);
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
  } as Partial<BaseElementData>;
}
