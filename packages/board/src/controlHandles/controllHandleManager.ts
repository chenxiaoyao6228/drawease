import { Board } from '..';
import { getMultipleElementsBounds, isPointInBound } from '../elements/util';
import { IPoint, IRenderConfig } from '../types';
import { ControlHandleObj, ControlHandles, ControlHandleType } from './../types/controlHandle';

const TRANSFORM_HANDLE_SIZE = 8;
const ROTATION_RESIZE_HANDLE_GAP = 16;

export class ControllHandleManager {
  _app: Board;
  constructor(app: Board) {
    this._app = app;
  }
  render(renderConfig: IRenderConfig) {
    const { rc, ctx } = renderConfig;
    const selectedElements = this._app.selectedElementsManager.getAll();
    if (selectedElements.length) {
      const handles = this.generateControlHandles();

      ctx.save();
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      Object.keys(handles).forEach((key) => {
        const handle = handles[key as ControlHandleType];
        if (!handle) {
          return;
        }
        ctx.beginPath();
        ctx.rect(handle.x, handle.y, handle.width, handle.height);
        ctx.stroke();
      });
      ctx.restore();
    }
  }

  getControlHandleFromPoint(point: IPoint): ControlHandleObj | null {
    const handles = this.generateControlHandles();

    for (const key in handles) {
      const handle = handles[key as ControlHandleType];
      if (handle && isPointInBound(point, handle)) {
        return {
          type: key,
          bound: handle
        } as ControlHandleObj;
      }
    }

    return null;
  }

  generateControlHandles(): ControlHandles {
    const selectedElements = this._app.selectedElementsManager.getAll();
    const bound = getMultipleElementsBounds(selectedElements);
    const { x, y, width, height } = bound;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const controlHandles = {
      rotation: {
        x: x + halfWidth - TRANSFORM_HANDLE_SIZE / 2,
        y: y - TRANSFORM_HANDLE_SIZE - ROTATION_RESIZE_HANDLE_GAP,
        width: TRANSFORM_HANDLE_SIZE,
        height: TRANSFORM_HANDLE_SIZE
      },
      ne: { x: x + width + TRANSFORM_HANDLE_SIZE / 2, y: y - TRANSFORM_HANDLE_SIZE, width: TRANSFORM_HANDLE_SIZE, height: TRANSFORM_HANDLE_SIZE }
    };

    return controlHandles;
  }
}
