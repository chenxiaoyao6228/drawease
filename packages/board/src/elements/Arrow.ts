import { ArrowElementData } from '../types';
import BaseElement, { RenderConfig } from './Base';

export default class ArrowElement extends BaseElement {
  constructor(data: ArrowElementData) {
    super(data);
  }

  render(renderConfig: RenderConfig) {
    const { rc, ctx } = renderConfig;

    const { points, x, y, strokeColor, fillStyle, strokeWidth, roughness = 1 } = this.getData() as ArrowElementData;

    ctx.save();
    ctx.translate(x, y);

    // 绘制箭头线段
    const [startX, startY] = points[0];
    const [endX, endY] = points[1];
    rc.line(startX, startY, endX, endY, { stroke: strokeColor, strokeWidth, roughness });

    // 绘制箭头头部
    const dx = endX - startX;
    const dy = endY - startY;
    const arrowHeadSize = 30;
    const arrowAngle = 15;
    const angleRadians = Math.atan2(dy, dx);
    const leftAngle = angleRadians - Math.PI / (180 / arrowAngle);
    const rightAngle = angleRadians + Math.PI / (180 / arrowAngle);
    const leftEndX = endX - arrowHeadSize * Math.cos(leftAngle);
    const leftEndY = endY - arrowHeadSize * Math.sin(leftAngle);
    const rightEndX = endX - arrowHeadSize * Math.cos(rightAngle);
    const rightEndY = endY - arrowHeadSize * Math.sin(rightAngle);
    rc.line(endX, endY, leftEndX, leftEndY, { stroke: strokeColor, strokeWidth, roughness });
    rc.line(endX, endY, rightEndX, rightEndY, { stroke: strokeColor, strokeWidth, roughness });
  }
}
