import { IBound, IRectElementData, IRenderConfig } from '../types';
import BaseElement from './Base';
import { SELECTION_BORDRE_OFFSET } from './constant';

export default class RectElement extends BaseElement {
  constructor(data: IRectElementData) {
    super(data);
  }

  render(renderConfig: IRenderConfig) {
    const { rc, ctx } = renderConfig;
    const { width, height, transform, fillStyle, strokeColor, strokeWidth, strokeStyle, roughness = 1, seed } = this.getData() as IRectElementData;
    const roughOptions = {
      seed,
      stroke: strokeColor,
      strokeWidth,
      roughness,
      ...(fillStyle && { fillStyle })
    };

    ctx.save();
    ctx.transform(...transform);
    rc.rectangle(0, 0, width, height, roughOptions);
    ctx.restore();
  }

  renderSelectionBorder(ctx: CanvasRenderingContext2D) {
    if (this.isSelected) {
      const { width, height, transform } = this.getData() as IRectElementData;
      ctx.save();
      ctx.transform(...transform);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      ctx.strokeRect(-SELECTION_BORDRE_OFFSET, -SELECTION_BORDRE_OFFSET, width + 2 * SELECTION_BORDRE_OFFSET, height + 2 * SELECTION_BORDRE_OFFSET);
      ctx.restore();
    }
  }

  getBounds(): IBound {
    const { width, height, transform } = this.getData() as IRectElementData;
    return { width, height, transform };
  }
}
