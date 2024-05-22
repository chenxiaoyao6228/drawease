import { Board } from '..';
import { isPointInBound } from '../elements/util';
import { IPoint, IRenderConfig } from '../types';
import { Matrix } from '../utils/math/Matrix';
import { ControlHandleObj, ControlHandles, ControlHandleType } from './../types/controlHandle';

const TRANSFORM_HANDLE_SIZE = 8;
const ROTATION_RESIZE_HANDLE_GAP = 22;

export class ControlHandleManager {
  _app: Board;
  constructor(app: Board) {
    this._app = app;
  }

  render(renderConfig: IRenderConfig) {
    const { rc, ctx } = renderConfig;
    const selectedElements = this._app.selectedElementsManager.getAll();

    if (selectedElements.length === 1) {
      const handles = this.generateControlHandles();
      console.log('handles', handles);

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
    console.log(`[drawease:] transform: ${transform}`);
    const matrix = new Matrix(...transform);

    // 提取缩放因子
    const scaleX = matrix.a;
    const scaleY = matrix.d;

    // 计算控制柄的逆缩放
    const inverseScaleX = 1 / scaleX;
    const inverseScaleY = 1 / scaleY;

    // 假设控制柄的尺寸是固定的
    const handleSize = TRANSFORM_HANDLE_SIZE;

    // 控制柄位置调整，同时逆向调整缩放
    const controlHandles: ControlHandles = {
      rotation: {
        transform: matrix
          .append(new Matrix(inverseScaleX, 0, 0, inverseScaleY, width / 2 - handleSize / 2, -(handleSize + ROTATION_RESIZE_HANDLE_GAP)))
          .toArray(),
        width: handleSize,
        height: handleSize
      }
      // ne: {
      //   transform: new Matrix(inverseScaleX, 0, 0, inverseScaleY, width, 0).append(matrix).toArray(),
      //   width: handleSize,
      //   height: handleSize
      // },
      // se: {
      //   transform: new Matrix(inverseScaleX, 0, 0, inverseScaleY, width, height).append(matrix).toArray(),
      //   width: handleSize,
      //   height: handleSize
      // },

      // nw: {
      //   transform: new Matrix(inverseScaleX, 0, 0, inverseScaleY, 0, 0).append(matrix).toArray(),
      //   width: handleSize,
      //   height: handleSize
      // },
      // sw: {
      //   transform: new Matrix(inverseScaleX, 0, 0, inverseScaleY, 0, height).append(matrix).toArray(),
      //   width: handleSize,
      //   height: handleSize
      // },
    };

    return controlHandles;
  }
}
