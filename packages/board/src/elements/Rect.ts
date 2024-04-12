import { RectElementData } from '../types';
import BaseElement from './Base';

export default class RectElement extends BaseElement {
  constructor(data: RectElementData) {
    super(data);
  }
  render(ctx: CanvasRenderingContext2D) {
    const { width, height, x, y, fillStyle, strokeColor, strokeStyle } = this._data as RectElementData;
    ctx.fillStyle = fillStyle || 'black';
    ctx.fillRect(x, y, width, height);
    if (strokeColor && strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.strokeRect(x, y, width, height);
    }
  }
}
