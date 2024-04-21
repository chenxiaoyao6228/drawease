import { Board } from '../Board';
import BaseElement from '../elements/Base';
import { createElement } from '../elements/util';
import { IPoint, ITool, ToolType } from '../types';

// 定义通用图形工具类
export class ShapeTool implements ITool {
  private _app: Board;
  type: ToolType;
  startPoint!: IPoint;
  currentElement: BaseElement | null = null; // 用于跟踪当前绘制的元素
  elementType: ElementType;

  constructor(app: Board, type: ToolType, elementType: ElementType) {
    this._app = app;
    this.type = type;
    this.elementType = elementType;
  }
  active() {}
  deactive() {}

  pointerDown(event: PointerEvent) {
    console.log(`${this.type} 工具：鼠标按下事件`);
    this.startPoint = { x: event.offsetX, y: event.offsetY };
    // 创建一个空白元素，开始绘制
    this.currentElement = createElement({
      type: this.elementType,
      x: this.startPoint.x,
      y: this.startPoint.y,
      width: 0,
      height: 0,
      strokeColor: 'black',
      strokeWidth: 2
    });
    this._app.scene.renderInteractiveElement(this.currentElement);
  }

  pointerMove(event: PointerEvent) {
    console.log(`${this.type} 工具：鼠标移动事件`);
    if (this.startPoint && this.currentElement) {
      const width = event.offsetX - this.startPoint.x;
      const height = event.offsetY - this.startPoint.y;
      // 更新元素的宽度和高度
      this.currentElement.setData({ width, height });
      // 重新绘制
      this._app.scene.renderInteractiveElement(this.currentElement);
    }
  }

  pointerUp(event: PointerEvent) {
    console.log(`${this.type} 工具：鼠标松开事件`);
    if (this.currentElement) {
      // 清空元素的跟踪对象
      this._app.scene.clearInteractiveCanvas();
      this._app.scene.addElements(this.currentElement);
      this.currentElement = null;
    }
  }
}

// 定义元素类型
type ElementType = 'rectangle' | 'diamond' | 'ellipse';

// 定义不同类型的工具
export const RectTool = (app: Board) => new ShapeTool(app, ToolType.Rect, 'rectangle');
export const DiamondTool = (app: Board) => new ShapeTool(app, ToolType.Diamond, 'diamond');
export const EllipseTool = (app: Board) => new ShapeTool(app, ToolType.Ellipse, 'ellipse');
