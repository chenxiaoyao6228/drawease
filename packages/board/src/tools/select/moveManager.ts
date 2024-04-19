import { IBaseElement } from '@drawease/board/types';

import { Board } from '../..';

export class MoveManager {
  _app: Board;
  constructor(app: Board) {
    this._app = app;
  }
  moveSelectedElements(elements: IBaseElement[], dx: number, dy: number) {
    elements.forEach((element) => {
      element.move(dx, dy);
    });
    this._app.scene.renderAll();
  }
}
