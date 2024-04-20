import { IBound, IEllipseElementData, IRenderConfig } from '../types';
import BaseElement from './Base';

export default class EllipseElement extends BaseElement {
  constructor(data: IEllipseElementData) {
    super(data);
  }

  render(renderConfig: IRenderConfig) {
    const { rc, ctx } = renderConfig;
    const { width, height, x, y, fillStyle, strokeColor, strokeWidth, roughness = 1, strokeStyle, seed } = this.getData() as IEllipseElementData;

    const roughOptions = {
      seed,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      roughness: roughness || 1,
      ...(fillStyle && { fillStyle })
    };

    ctx.save();
    rc.ellipse(x + width / 2, y + height / 2, width, height, roughOptions);
    ctx.restore();
  }

  getBounds(): IBound {
    const { x, y, width, height } = this.getData() as IEllipseElementData;
    return { x, y, width, height };
  }
}
