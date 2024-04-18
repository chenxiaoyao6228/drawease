import { LineElementData } from '../types';
import BaseElement, { RenderConfig } from './Base';

export default class LineElement extends BaseElement {
  constructor(data: LineElementData) {
    super(data);
  }

  render(renderConfig: RenderConfig) {
    const { rc, ctx } = renderConfig;

    const { x, y, points, strokeColor, strokeWidth, roughness = 1, seed, fillStyle } = this.getData() as LineElementData;

    const roughOptions = {
      seed,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      roughness: roughness || 1,
      ...(fillStyle && { fillStyle })
    };

    ctx.save();
    ctx.translate(x, y);
    rc.line(points[0][0], points[0][1], points[1][0], points[1][1], roughOptions);
    ctx.restore();
  }
}
