import { EllipseElementData } from '../types';
import BaseElement, { RenderConfig } from './Base';

export default class EllipseElement extends BaseElement {
  constructor(data: EllipseElementData) {
    super(data);
  }

  render(renderConfig: RenderConfig) {
    const { rc, ctx } = renderConfig;
    const { width, height, x, y, fillStyle, strokeColor, strokeWidth, roughness = 1, strokeStyle } = this.getData() as EllipseElementData;

    const roughOptions = {
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      roughness: roughness || 1,
      ...(fillStyle && { fillStyle })
    };

    ctx.save();
    rc.ellipse(x + width / 2, y + height / 2, width, height, roughOptions);
    ctx.restore();
  }
}
