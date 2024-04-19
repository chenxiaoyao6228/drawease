import { EventEmitter } from '@drawease/board/utils';

import { Board } from '.';
import { IBaseElement } from './types';

// 负责元素的选中逻辑，并通过事件通知外部UI的选中状态
export class SelectedElementsManager {
  private _emitter: EventEmitter = new EventEmitter();
  private _elements: IBaseElement[] = [];
  private _app: Board;
  constructor(app: Board) {
    this._app = app;
  }
  add(element: IBaseElement) {
    if (this._elements.indexOf(element) === -1) {
      this._elements.push(element);
      element.setSelected(true);
    }
  }

  remove(element: IBaseElement) {
    const index = this._elements.indexOf(element);
    if (index !== -1) {
      this._elements.splice(index, 1);
      element.setSelected(false);
    }
  }

  clear() {
    this._elements.forEach((element) => element.setSelected(false));
    this._elements = [];
  }

  getSelectedElements() {
    return this._elements;
  }

  deselectAllElements() {
    return this.clear();
  }

  toggleElementSelection(element: IBaseElement) {
    if (this._elements.indexOf(element) !== -1) {
      this.remove(element);
    } else {
      this.add(element);
    }
  }

  selectSingleElement(element: IBaseElement) {
    this.clear();
    this.add(element);
  }
  // 显式声明事件： onElementSelected, onElementDeslected
  onSelectionChanged(callback: (data: { elements: IBaseElement[] }) => void) {
    // TODO:
  }
}
