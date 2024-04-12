import { EllipseElementData } from '../types';
import BaseElement from './Base';

export default class EllipseElement extends BaseElement {
  constructor(data: EllipseElementData) {
    super(data);
  }

  render(ctx: CanvasRenderingContext2D) {
    const { width, height, x, y, fillStyle, strokeColor, strokeWidth, strokeStyle } = this._data as EllipseElementData;

    ctx.fillStyle = fillStyle || 'black';
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Stroke
    if (strokeColor && strokeWidth && strokeStyle) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = parseFloat(strokeWidth); // Assuming strokeWidth is a string
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }
}
