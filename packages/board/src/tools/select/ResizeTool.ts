import { IBound, IPoint, ITool, ToolType } from '@drawease/board/types';
import { ControlHandleObj } from '@drawease/board/types/controlHandle';
import { Matrix } from '@drawease/board/utils/math/Matrix';

import { Board } from '../..';

export class ResizeTool implements ITool {
  type: ToolType = ToolType.Resize;
  _app: Board;
  private _initialPointerPosition: IPoint | null = null;
  private _isResizingSingleElement: boolean = false;
  private _currentControlHandle: ControlHandleObj | null = null;
  private _originalBound: IBound | null = null;

  constructor(app: Board) {
    this._app = app;
  }

  active() {
    console.log('ResizeTool：active');
    const selectedElements = this._app.selectedElementsManager.getAll();
    this._isResizingSingleElement = selectedElements.length === 1;
  }

  deactive() {
    console.log('ResizeTool：deactive');
  }

  pointerDown(event: PointerEvent) {
    console.log('ResizeTool：鼠标按下事件');
    // 记录起点
    this._initialPointerPosition = {
      x: event.offsetX,
      y: event.offsetY
    };
    // 记录当前类型
    this._currentControlHandle = this._app.controllHandleManager.getControlHandleFromPoint(this._initialPointerPosition);
    // 初始化矩阵
    this._originalBound = this._app.selectedElementsManager.getSelectedElements()[0].getBounds();
  }

  pointerMove(event: PointerEvent) {
    console.log('ResizeTool：鼠标移动事件');
    if (!this._initialPointerPosition || !this._currentControlHandle) return;

    const currentPointerPosition: IPoint = {
      x: event.offsetX,
      y: event.offsetY
    };

    const deltaX = currentPointerPosition.x - this._initialPointerPosition.x;
    const deltaY = currentPointerPosition.y - this._initialPointerPosition.y;

    console.log('deltaX, deltaY', deltaX, deltaY); // deltaY是负数！！！！

    if (this._isResizingSingleElement) {
      this.resizeSingleElement(deltaX, deltaY);
    } else {
      this.resizeMultipleElements(deltaX, deltaY);
    }

    this._app.scene.renderAll();
  }

  pointerUp(event: PointerEvent) {
    console.log('ResizeTool：鼠标松开事件');
    this._initialPointerPosition = null;
    this._currentControlHandle = null;
    this._originalBound = null;
  }

  private resizeSingleElement(deltaX: number, deltaY: number) {
    console.log('deltaX, deltaY', deltaX, deltaY);
    const element = this._app.selectedElementsManager.getAll()[0];
    if (!element) return;

    const { width, height, transform } = this._originalBound!;

    // 计算新的缩放因子
    const scaleX = (width + deltaX) / width;
    const scaleY = (height + deltaY) / height;

    // 创建一个新的变换矩阵
    const transformMatrix = new Matrix(...transform);

    // 计算元素的中心点位置
    const centerX = width / 2;
    const centerY = height / 2;

    // 先将元素移动到原点进行缩放
    transformMatrix.translate(-centerX, -centerY);
    // 应用缩放
    transformMatrix.scale(scaleX, scaleY);
    // 将元素移回原来的中心位置
    transformMatrix.translate(centerX, centerY);

    // 更新元素的变换矩阵
    element.updateTransform(transformMatrix);
  }

  private resizeMultipleElements(deltaX: number, deltaY: number) {
    const elements = this._app.selectedElementsManager.getAll();
    elements.forEach((element) => {
      const { width, height, transform } = element.getBounds();

      const scaleX = (width + deltaX) / width;
      const scaleY = (height + deltaY) / height;

      const centerX = width / 2;
      const centerY = height / 2;

      const transformMatrix = new Matrix(...transform);
      transformMatrix.translate(-centerX, -centerY);
      transformMatrix.scale(scaleX, scaleY);
      transformMatrix.translate(centerX, centerY);

      element.updateTransform(transformMatrix);
    });

    this._app.scene.renderAll();
  }
}
