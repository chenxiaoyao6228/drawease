export interface BaseElementData {
  id: string;
  type: string; // 元素类型
  x: number;
  y: number;
  angle: number;
  strokeColor: string;
  strokeStyle: string;
  strokeWidth: string;
  fillStyle: string;
  opacity: number;
}

export interface RectElementData extends BaseElementData {
  type: 'rectangle';
  width: number;
  height: number;
}

export interface EllipseElementData extends BaseElementData {
  type: 'ellipse';
  width: number;
  height: number;
}
