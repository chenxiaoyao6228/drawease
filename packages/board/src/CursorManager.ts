export type ICursor = 'default' | 'grab' | 'grabbing' | 'move' | 'pointer' | 'crosshair' | 'text' | 'testSvg';
import { Board } from '.';
import { svgToDataURL } from './utils';

export class CursorManager {
  private defaultCursor: ICursor;
  private cursorMap: Map<ICursor, string>;
  private _app: Board;

  constructor(app: Board) {
    this._app = app;
    this.defaultCursor = 'default';
    this.cursorMap = new Map();
    this.registerDefaultCursors();
    this.setCursorStyle(this.defaultCursor);
  }

  private registerDefaultCursors(): void {
    const standardCursors: ICursor[] = ['default', 'grab', 'grabbing', 'move', 'pointer', 'crosshair', 'text', 'testSvg'];

    standardCursors.forEach((cursor) => {
      this.registerCursorStyle(cursor, cursor);
    });

    // Assume SVG cursors are added separately
    this.registerCursorStyle('testSvg', getFancyCursor());
  }

  registerCursorStyle(cursorName: ICursor, cursorStyle: string, size?: { width: number; height: number }): void {
    if (cursorStyle.startsWith('<svg')) {
      const url = svgToDataURL(cursorStyle);
      console.log('url', url);
      this.cursorMap.set(cursorName, `url('${url}') ${size?.width ?? 24}px ${size?.height ?? 24}px, auto`);
    } else {
      this.cursorMap.set(cursorName, cursorStyle);
    }
  }

  setCursorStyle(cursorStyle: ICursor): void {
    console.log('cursorStyle', cursorStyle);
    this._app.scene.innerCanvasesContainer.style.cursor = cursorStyle;
  }

  resetCursor(): void {
    this.setCursorStyle(this.defaultCursor);
  }

  applyRegisteredCursor(cursorName: ICursor): void {
    if (this.cursorMap.has(cursorName)) {
      const cursorStyle = this.cursorMap.get(cursorName) as ICursor;
      this.setCursorStyle(cursorStyle);
    } else {
      console.error(`Cursor style not registered: ${cursorName}`);
      this.listAvailableCursors();
    }
  }

  private listAvailableCursors(): void {
    console.log('Available cursors:', Array.from(this.cursorMap.keys()).join(', '));
  }
}

function getFancyCursor() {
  const degree = 30;
  return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_1173_45)" transform="rotate(${degree} 16 16)"><path d="M16 6L12.5 10H19.5L16 6Z" fill="#000000"/><path d="M16 26L12.5 22H19.5L16 26Z" fill="#000000"/><path d="M15.25 10H16.75V22H15.25V10Z" fill="#000000"/><path d="M12.1237 9.67075L11.3981 10.5H12.5H14.75V21.5H12.5H11.3981L12.1237 22.3293L15.6237 26.3293L16 26.7593L16.3763 26.3293L19.8763 22.3293L20.6019 21.5H19.5H17.25V10.5H19.5H20.6019L19.8763 9.67075L16.3763 5.67075L16 5.2407L15.6237 5.67075L12.1237 9.67075Z" stroke="white"/></g><defs><filter id="filter0_d_1173_45" x="8.29623" y="2.48141" width="15.4075" height="27.0372" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1173_45"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1173_45" result="shape"/></filter></defs></svg>`;
}
