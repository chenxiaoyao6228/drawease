import { ControllHandleManager } from './controlHandles/controllHandleManager';
import { createElement } from './elements/util';
import { Scene } from './scene/Scene';
import { SelectedElementsManager } from './SelectedElementsManager';
import ToolManager from './tools';
import { IBaseElementData, IOptions } from './types';

export class Board {
  tool: ToolManager;
  scene: Scene;
  selectedElementsManager: SelectedElementsManager;
  controllHandleManager: ControllHandleManager;
  constructor(options: IOptions) {
    this.scene = new Scene(this, options);
    this.tool = new ToolManager(this);
    this.selectedElementsManager = new SelectedElementsManager(this);
    this.controllHandleManager = new ControllHandleManager(this);
  }

  loadDatas(datas: IBaseElementData[]) {
    const elements = datas.map((data) => createElement(data));
    this.scene.addElements(elements);
  }
}
