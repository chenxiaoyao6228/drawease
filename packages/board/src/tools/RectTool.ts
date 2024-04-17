import { Board } from '../Board';
import RectElement from '../elements/Rect';
import { createElement } from '../elements/util';
import { Point, RectElementData, Tool, ToolType } from '../types';

// 定义矩形工具类
export class RectTool implements Tool {
  _app: Board;
  type: ToolType = ToolType.Rect;
  startPoint!: Point;
  currentRect: RectElement | null = null; // 用于跟踪当前绘制的矩形
  constructor(app: Board) {
    this._app = app;
  }

  pointerDown(event: PointerEvent) {
    console.log('矩形工具：鼠标按下事件');
    this.startPoint = { x: event.offsetX, y: event.offsetY };
    // 创建一个空白矩形元素，开始绘制
    this.currentRect = createElement({
      type: 'rectangle',
      x: this.startPoint.x,
      y: this.startPoint.y,
      width: 0,
      height: 0,
      strokeColor: 'black',
      strokeWidth: 2
    } as RectElementData);
    this._app.scene.addElements(this.currentRect);
  }

  pointerMove(event: PointerEvent) {
    console.log('矩形工具：鼠标移动事件');
    if (this.startPoint && this.currentRect) {
      const width = event.offsetX - this.startPoint.x;
      const height = event.offsetY - this.startPoint.y;
      // 更新矩形的宽度和高度
      this.currentRect.setData({ width, height });
      // 重新绘制
      this._app.scene.renderAll();
    }
  }

  pointerUp(event: PointerEvent) {
    console.log('矩形工具：鼠标松开事件');
    if (this.currentRect) {
      // 清空矩形的跟踪对象
      this.currentRect = null;
    }
  }
}
