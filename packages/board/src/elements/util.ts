import { BaseElementData, EllipseElementData, RectElementData } from '../types';
import BaseElement from './Base';
import EllipseElement from './Ellipse';
import RectElement from './Rect';

export function createElement(data: BaseElementData): BaseElement {
  switch (data.type) {
    case 'rectangle':
      return new RectElement(data as RectElementData);
    case 'ellipse':
      return new EllipseElement(data as EllipseElementData);
    // Add cases for other types if needed
    default:
      throw new Error(`Unknown element type: ${data.type}`);
  }
}
