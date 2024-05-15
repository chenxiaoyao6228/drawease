import { IBaseElement, IPoint, ITool, ToolType } from '@drawease/board/types';
import { Matrix } from '@drawease/board/utils/math/Matrix';

import { Board } from '../..';

export class MoveTool implements ITool {
  type: ToolType = ToolType.Move;
  _app: Board;
  private _initialPointerPosition: IPoint | null = null;
  constructor(app: Board) {
    this._app = app;
  }
  active() {}
  deactive() {}
  pointerDown(event: PointerEvent) {
    this._initialPointerPosition = this._app.viewportManager.getMousePosition(event);
  }
  pointerMove(event: PointerEvent) {
    const point = this._app.viewportManager.getMousePosition(event);
    if (this._app.selectedElementsManager.getSelectedElements().length > 0) {
      const dx = point.x - this._initialPointerPosition!.x;
      const dy = point.y - this._initialPointerPosition!.y;
      this.moveSelectedElements(this._app.selectedElementsManager.getSelectedElements(), dx, dy);
      this._initialPointerPosition = point;
    }
  }
  pointerUp(event: PointerEvent) {
    this._initialPointerPosition = null;
  }

  moveSelectedElements(elements: IBaseElement[], dx: number, dy: number) {
    elements.forEach((element) => {
      const rotation = element.getRotation();
      const matrix = new Matrix();
      matrix.translate(dx, dy);
      matrix.rotate(-rotation);
      const transformedPoint = matrix.apply({ x: 0, y: 0 });

      element.translate(transformedPoint.x, transformedPoint.y);
    });
    this._app.scene.renderAll();
  }
}
