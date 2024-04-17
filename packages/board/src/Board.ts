import { createElement } from './elements/util';
import { Scene } from './Scene';
import ToolManager from './tools';
import { BaseElementData, Options } from './types';

export class Board {
  tool: ToolManager;
  scene: Scene;
  constructor(options: Options) {
    this.scene = new Scene(this, options);
    this.tool = new ToolManager(this);
  }

  loadDatas(datas: BaseElementData[]) {
    const elements = datas.map((data) => createElement(data));
    this.scene.addElements(elements);
  }
}
