import { EllipseElementData } from '../types';
import BaseElement, { RenderConfig } from './Base';

export default class EllipseElement extends BaseElement {
  constructor(data: EllipseElementData) {
    super(data);
  }

  render(renderConfig: RenderConfig) {
    const { rc, ctx } = renderConfig;
    const { width, height, x, y, fillStyle, strokeColor, strokeWidth, roughness = 1, strokeStyle } = this._data as EllipseElementData;

    ctx.save();
    ctx.fillStyle = fillStyle;
    rc.ellipse(x + width / 2, y + height / 2, width, height, { stroke: strokeColor, strokeWidth, roughness });
    ctx.fill();
    ctx.restore();
  }
}
