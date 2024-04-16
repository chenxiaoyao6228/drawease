import { ArrowElementData } from '../types';
import BaseElement, { RenderConfig } from './Base';

export default class ArrowElement extends BaseElement {
  constructor(data: ArrowElementData) {
    super(data);
  }

  render(renderConfig: RenderConfig) {
    const { rc, ctx } = renderConfig;

    const { points, strokeColor, strokeWidth, roughness = 1 } = this._data as ArrowElementData;

    //TODO
  }
}
