import { ArrowElementData, BaseElementData, DiamondElementData, EllipseElementData, LineElementData, RectElementData } from '../types';
import ArrowElement from './Arrow';
import BaseElement from './Base';
import DiamondElement from './Diamond';
import EllipseElement from './Ellipse';
import LineElement from './Line';
import RectElement from './Rect';

export function createElement(data: BaseElementData): BaseElement {
  switch (data.type) {
    case 'rectangle':
      return new RectElement(data as RectElementData);
    case 'ellipse':
      return new EllipseElement(data as EllipseElementData);
    case 'line':
      return new LineElement(data as LineElementData);
    case 'diamond':
      return new DiamondElement(data as DiamondElementData);
    case 'arrow':
      return new ArrowElement(data as ArrowElementData);
    default:
      throw new Error(`Unknown element type: ${data.type}`);
  }
}

export function getDefaultElementData() {
  return {} as BaseElementData;
}
