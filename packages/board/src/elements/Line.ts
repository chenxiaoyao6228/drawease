import { ILineElementData, IRenderConfig } from '../types';
import BaseElement from './Base';

export default class LineElement extends BaseElement {
  constructor(data: ILineElementData) {
    super(data);
  }

  render(renderConfig: IRenderConfig) {
    const { rc, ctx } = renderConfig;

    const { x, y, points, strokeColor, strokeWidth, roughness = 1, seed, fillStyle } = this.getData() as ILineElementData;

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

  getOBB(): { x: number; y: number; width: number; height: number; angle: number } {
    // Calculate OBB for LineElement
    // You need to implement this based on the specific shape and properties of LineElement
  }
}
