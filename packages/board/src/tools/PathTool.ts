import { Board } from '../Board';
import BaseElement from '../elements/Base';
import { createElement } from '../elements/util';
import { Point, Tool, ToolType } from '../types';

export class LineTool implements Tool {
  _app: Board;
  type: ToolType;
  startPoint!: Point;
  currentElement: BaseElement | null = null; // Used to track the current line being drawn

  constructor(app: Board) {
    this._app = app;
    this.type = ToolType.Line;
  }

  pointerDown(event: PointerEvent) {
    console.log(`${this.type} tool: Pointer down event`);
    this.startPoint = { x: event.offsetX, y: event.offsetY };
    // Create a new line element and start drawing
    this.currentElement = createElement({
      type: 'line',
      points: [
        [this.startPoint.x, this.startPoint.y],
        [this.startPoint.x, this.startPoint.y]
      ],
      strokeColor: 'black',
      strokeWidth: 2
    });
    this._app.scene.addElements(this.currentElement);
  }

  pointerMove(event: PointerEvent) {
    console.log(`${this.type} tool: Pointer move event`);
    if (this.startPoint && this.currentElement) {
      const [startX, startY] = [this.startPoint.x, this.startPoint.y];
      const [endX, endY] = [event.offsetX, event.offsetY];
      // Update the points of the line
      this.currentElement.setData({
        points: [
          [startX, startY],
          [endX, endY]
        ]
      });
      // Redraw the scene
      this._app.scene.renderAll();
    }
  }

  pointerUp(event: PointerEvent) {
    console.log(`${this.type} tool: Pointer up event`);
    if (this.currentElement) {
      // Clear the tracking object
      this.currentElement = null;
    }
  }
}
