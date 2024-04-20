import { IBound, IRectElementData, IRenderConfig } from '../types';
import BaseElement from './Base';
import { SELECTION_BORDRE_OFFSET } from './constant';

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
    this._renderSelectionBorder(renderConfig);
    ctx.restore();
  }

  _renderSelectionBorder(renderConfig: IRenderConfig) {
    const { ctx } = renderConfig;
    const { x, y, width, height } = this.getData() as IRectElementData;
    if (this.isSelected) {
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - SELECTION_BORDRE_OFFSET, y - SELECTION_BORDRE_OFFSET, width + SELECTION_BORDRE_OFFSET * 2, height + SELECTION_BORDRE_OFFSET * 2);
    }
  }

  getBounds(): IBound {
    const { x, y, width, height } = this.getData() as IRectElementData;
    return { x, y, width, height };
  }
}
