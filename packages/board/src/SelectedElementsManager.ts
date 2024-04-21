import { Board } from '.';
import { IBaseElement } from './types';
import { EventEmitter } from './utils';

type ISelectedElementsManagerEvent = {
  selectionChange: IBaseElement[];
};

// 负责元素的选中逻辑，并通过事件通知外部UI的选中状态
export class SelectedElementsManager {
  eventEmitter = new EventEmitter<ISelectedElementsManagerEvent>();
  private _elements: IBaseElement[] = [];
  private _app: Board;
  constructor(app: Board) {
    this._app = app;
  }
  add(element: IBaseElement) {
    if (this._elements.indexOf(element) === -1) {
      this._elements.push(element);
      element.setSelected(true);
      this.eventEmitter.emit('selectionChange', this._elements);
    }
  }

  remove(element: IBaseElement) {
    const index = this._elements.indexOf(element);
    if (index !== -1) {
      this._elements.splice(index, 1);
      element.setSelected(false);
      this.eventEmitter.emit('selectionChange', this._elements);
    }
  }

  clear() {
    this._elements.forEach((element) => element.setSelected(false));
    this._elements = [];
    this.eventEmitter.emit('selectionChange', this._elements);
  }

  addMultipleElements(elements: IBaseElement[]) {
    for (const element of elements) {
      this.add(element);
    }
  }

  getAll() {
    return this._elements;
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
}
