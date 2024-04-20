import { IBaseElementData, IBound, IDiamondElementData, IRenderConfig } from '../types';
import BaseElement from './Base';

export default class DiamondElement extends BaseElement {
  constructor(data: IBaseElementData) {
    super(data);
  }

  render(config: IRenderConfig) {
    const { ctx, rc } = config;
    const { x, y, width, height, strokeColor, strokeWidth, fillStyle, roughness, seed } = this.getData() as IDiamondElementData;

    ctx.save();

    const roughOptions = {
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      roughness: roughness || 1,
      seed,
      ...(fillStyle && { fillStyle })
    };

    const path = [
      [x, y + height / 2], // 左顶点
      [x + width / 2, y], // 上顶点
      [x + width, y + height / 2], // 右顶点
      [x + width / 2, y + height] // 底部顶点
    ] as any;

    rc.polygon(path, roughOptions);

    ctx.restore();
  }
  getBounds(): IBound {}
}
