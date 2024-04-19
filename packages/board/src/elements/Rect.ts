import { IRectElementData, IRenderConfig } from '../types';
import BaseElement from './Base';

export default class RectElement extends BaseElement {
  constructor(data: IRectElementData) {
    super(data);
  }

  render(renderConfig: IRenderConfig) {
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

    if (this.isSelected) {
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 4, y - 4, width + 8, height + 8);
    }

    ctx.restore();
  }

  getOBB(): { x: number; y: number; width: number; height: number; angle: number } {
    const { x, y, width, height } = this.getData() as IRectElementData;
    return { x, y, width, height, angle: 0 };
  }
}
