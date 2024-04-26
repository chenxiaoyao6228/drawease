import { Board } from '..';
import { isPointInBound } from '../elements/util';
import { IPoint, IRenderConfig } from '../types';
import { Matrix } from '../utils/math/Matrix';
import { ControlHandleObj, ControlHandles, ControlHandleType } from './../types/controlHandle';

const TRANSFORM_HANDLE_SIZE = 8;
const ROTATION_RESIZE_HANDLE_GAP = 36;

export class ControllHandleManager {
  _app: Board;
  constructor(app: Board) {
    this._app = app;
  }

  render(renderConfig: IRenderConfig) {
    const { rc, ctx } = renderConfig;
    const selectedElements = this._app.selectedElementsManager.getAll();

    if (selectedElements.length === 1) {
      const handles = this.generateControlHandles();

      ctx.save();
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;

      Object.keys(handles).forEach((key) => {
        const handle = handles[key as ControlHandleType];
        if (!handle) {
          return;
        }
        ctx.save();
        if (handle.transform) {
          ctx.transform(...handle.transform);
        }
        ctx.beginPath();
        ctx.rect(0, 0, handle.width, handle.height);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      });

      ctx.restore();
    } else {
      // TODO
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
    if (!selectedElements.length) {
      return {};
    }
    const element = selectedElements[0];
    const { width, height, transform } = element.getBounds();

    // 使用元素的变换矩阵作为基础
    const baseMatrix = new Matrix(...transform);

    // 计算控制点位置
    const handleSize = TRANSFORM_HANDLE_SIZE;
    const controlHandles: ControlHandles = {
      rotation: {
        transform: baseMatrix
          .clone()
          .translate(width / 2, -ROTATION_RESIZE_HANDLE_GAP)
          .toArray(),
        width: handleSize,
        height: handleSize
      },
      ne: {
        transform: baseMatrix.clone().translate(width, 0).toArray(),
        width: handleSize,
        height: handleSize
      },
      se: {
        transform: baseMatrix.clone().translate(width, height).toArray(),
        width: handleSize,
        height: handleSize
      },
      sw: {
        transform: baseMatrix.clone().translate(0, height).toArray(),
        width: handleSize,
        height: handleSize
      },
      nw: {
        transform: baseMatrix.clone().toArray(),
        width: handleSize,
        height: handleSize
      }
    };

    return controlHandles;
  }
}
