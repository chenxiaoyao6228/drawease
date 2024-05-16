import { IBaseElement, IPoint, ITool, ToolType } from '@drawease/board/types';
import { Matrix } from '@drawease/board/utils';

import { Board } from '../..';

export class RotateTool implements ITool {
  type: ToolType = ToolType.Rotate;
  _app: Board;
  private _initialPointerPos: IPoint;
  private _isRotatingSingleElement: boolean;
  private _selectedElement: IBaseElement | null;
  private _initialTransform: Matrix;
  private _initialAngle: number;

  constructor(app: Board) {
    this._app = app;
  }

  active() {
    this._app.cursorManager.applyRegisteredCursor('grab');
  }

  deactive() {
    this._app.cursorManager.applyRegisteredCursor('default');
  }

  pointerDown(event: PointerEvent) {
    console.log('RotateTool：鼠标按下事件');
    console.log('Initial angle:', this._initialAngle);

    this._initialPointerPos = this._app.viewportManager.getMousePosition(event);
    const selectedElements = this._app.selectedElementsManager.getSelectedElements();
    this._isRotatingSingleElement = selectedElements.length === 1;

    if (this._isRotatingSingleElement) {
      this._selectedElement = selectedElements[0];
      this._initialTransform = new Matrix(...this._selectedElement.getData().transform);
      console.log('Initial transform:', this._initialTransform);
      console.log('this._selectedElement.getData().transform', this._selectedElement.getData().transform);

      const center = this._selectedElement.getCenter();
      console.log('Initial center:', center);

      const initialVector = {
        x: this._initialPointerPos.x - center.x,
        y: this._initialPointerPos.y - center.y
      };
      this._initialAngle = Math.atan2(initialVector.y, initialVector.x);
    } else {
      this._initialTransform = new Matrix();
    }
  }

  pointerMove(event: PointerEvent) {
    const currentPointerPos = this._app.viewportManager.getMousePosition(event);

    if (this._isRotatingSingleElement) {
      this.rotateSingleElements(currentPointerPos);
    } else {
      this.rotateMultipleElements();
    }
  }

  rotateSingleElements(currentPointerPos: IPoint) {
    if (!this._selectedElement) return;
    const center = this._selectedElement.getCenter();
    console.log('Rotation center:', center);

    const currentVector = {
      x: currentPointerPos.x - center.x,
      y: currentPointerPos.y - center.y
    };

    const initialAngle = this._initialAngle;
    const currentAngle = Math.atan2(currentVector.y, currentVector.x);
    const angleDelta = currentAngle - initialAngle;
    console.log('Initial angle:', initialAngle);
    console.log('Current angle:', currentAngle);
    console.log('Angle delta:', angleDelta);

    this._selectedElement.rotate(angleDelta);
    this._app.scene.renderAll();
  }

  rotateMultipleElements() {
    throw new Error('Method not implemented.');
  }

  pointerUp(event: PointerEvent) {
    // this._selectedElement = null;
    this._initialTransform = new Matrix();
    this._initialPointerPos = { x: 0, y: 0 };
    this._isRotatingSingleElement = false;
  }
}
