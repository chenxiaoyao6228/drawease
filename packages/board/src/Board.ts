import { createElement } from './elements/util';
import { Scene } from './scene/Scene';
import ToolManager from './tools';
import { IBaseElementData, IOptions } from './types';

export class Board {
  tool: ToolManager;
  scene: Scene;
  constructor(options: IOptions) {
    this.scene = new Scene(this, options);
    this.tool = new ToolManager(this);
  }

  loadDatas(datas: IBaseElementData[]) {
    const elements = datas.map((data) => createElement(data));
    this.scene.addElements(elements);
  }
}
