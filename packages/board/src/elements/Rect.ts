import { IBound, IRectElementData, IRenderConfig } from '../types';
import { getTransformedSize } from '../utils/math/Matrix';
import BaseElement from './Base';
import { SELECTION_BORDRE_OFFSET } from './constant';

export default class RectElement extends BaseElement {
  constructor(data: IRectElementData) {
    super(data);
  }

  render(renderConfig: IRenderConfig) {
    const { rc, ctx } = renderConfig;

    const { x, y, width, height, fillStyle, strokeColor, strokeWidth, strokeStyle, roughness = 1, seed, transform } = this.getData() as IRectElementData;

    const deOffset = Math.max(transform[0], transform[3]);
    const roughOptions = {
      seed,
      stroke: strokeColor,
      strokeWidth: strokeWidth / deOffset, //线宽保持不变
      roughness: roughness || 1,
      ...(fillStyle && { fillStyle })
    };

    ctx.save();
    // 矩阵变换
    if (transform) {
      ctx.transform(...transform);
    }
    rc.rectangle(x, y, width, height, roughOptions);
    ctx.restore();
  }

  renderSelectionBorder(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height, transform } = this.getData() as IRectElementData;
    if (this.isSelected) {
      ctx.save();
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      const { width: newWidth, height: newHeight } = getTransformedSize({ width, height }, transform!);
      ctx.strokeRect(x - SELECTION_BORDRE_OFFSET, y - SELECTION_BORDRE_OFFSET, newWidth, newHeight);
      ctx.restore();
    }
  }

  getBounds(): IBound {
    const { x, y, width, height, transform } = this.getData() as IRectElementData;
    return { x, y, width, height, transform };
  }
}
