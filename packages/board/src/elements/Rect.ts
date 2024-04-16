import { RectElementData } from '../types';
import BaseElement, { RenderConfig } from './Base';

export default class RectElement extends BaseElement {
  constructor(data: RectElementData) {
    super(data);
  }

  render(renderConfig: RenderConfig) {
    const { rc, ctx } = renderConfig;

    const { x, y, width, height, fillStyle, strokeColor, strokeWidth, strokeStyle, roughness = 1 } = this._data as RectElementData;

    ctx.save();
    ctx.fillStyle = fillStyle;
    rc.rectangle(x, y, width, height, { stroke: strokeColor, strokeWidth, roughness });
    ctx.fill();
    ctx.restore();
  }
}
