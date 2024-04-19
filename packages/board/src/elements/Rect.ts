import { IRectElementData } from '../types';
import BaseElement, { RenderConfig } from './Base';

export default class RectElement extends BaseElement {
  constructor(data: IRectElementData) {
    super(data);
  }

  render(renderConfig: RenderConfig) {
    const { rc, ctx } = renderConfig;

    const { x, y, width, height, fillStyle, strokeColor, strokeWidth, strokeStyle, roughness = 1, seed } = this.getData() as IRectElementData;

    const roughOptions = {
      seed,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      roughness: roughness || 1,
      ...(fillStyle && { fillStyle })
    };

    ctx.save();
    rc.rectangle(x, y, width, height, roughOptions);
    ctx.restore();
  }
}
