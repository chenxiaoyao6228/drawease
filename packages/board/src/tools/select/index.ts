import { Board } from '../../Board';
import { Tool, ToolType } from '../../types';
/*
当处于选中工具态，用户在上用鼠标点击时，我们可能需要考虑以下情况：
    1. 直接选中一个元素： 单击鼠标选择 canvas 上的一个元素。
    2. 点击空白区域： 单击鼠标时未选中任何元素，即点击了 canvas 上的空白区域。
    3. 拖拽选中区域： 鼠标按下并拖动，创建一个选中区域，用于选择多个元素。
    4. 选中缩放或旋转控制点： 单击并选中一个元素的缩放或旋转控制点，用于改变元素的大小或旋转角度。
    5. 选中选中框内部： 单击并选中包含一个或多个元素的选中框的内部区域。
    6. 按住 Shift 键连选： 按住 Shift 键的同时单击多个元素，以进行多选。
    7. 拖拽元素： 长按并移动鼠标，拖动已选中的元素。
    8. 双击编辑元素： 双击选中一个元素，以进行编辑或执行其他操作。
    9. 悬停提示： 当鼠标悬停在元素上时，显示提示信息或特效。
    10. 按键组合操作： 在按住特定键的同时单击，执行不同的操作，如按住 Ctrl 键并单击以复制选定的元素。
*/

export class SelectTool implements Tool {
  type: ToolType = ToolType.Select;
  _app: Board;

  // 状态
  isSelected: boolean = false;
  isDragging: boolean = false;
  isSelectingArea: boolean = false;
  isControlPointSelected: boolean = false;
  isShiftKeyPressed: boolean = false;
  isDoubleClicking: boolean = false;
  isHovering: boolean = false;

  constructor(app: Board) {
    this._app = app;
  }

  pointerDown(event: PointerEvent) {
    console.log('选择工具：鼠标按下事件');

    // 处理鼠标按下事件，在选择工具下执行的操作
    if (!this.isSelected) {
      // 未选中元素时的处理
      // 可以判断是否按住 Shift 键以进行多选
      this.isShiftKeyPressed = event.shiftKey;
      // 判断是否选中了控制点
      this.isControlPointSelected = this.detectControlPoint(event);
      // 判断是否双击
      if (event.detail === 2) {
        this.isDoubleClicking = true;
      }
    } else {
      // 已选中元素时的处理
      // 判断是否点击了选中的元素以外的区域
      const clickedOutside = !this.detectElementClick(event);
      if (clickedOutside) {
        this.isSelected = false; // 取消选择
      }
      // 判断是否按住 Shift 键以进行多选
      this.isShiftKeyPressed = event.shiftKey;
      // 判断是否点击了控制点
      this.isControlPointSelected = this.detectControlPoint(event);
    }
  }

  pointerMove(event: PointerEvent) {
    console.log('选择工具：鼠标移动事件');

    // 处理鼠标移动事件，在选择工具下执行的操作
    if (this.isDragging) {
      // 拖拽选中的元素
      this.dragSelectedElements(event);
    } else if (this.isSelectingArea) {
      // 创建选区
      this.createSelectionArea(event);
    } else {
      // 其他情况下的处理
      // 判断是否悬停在元素上
      this.isHovering = this.detectHover(event);
    }
  }

  pointerUp(event: PointerEvent) {
    console.log('选择工具：鼠标松开事件');

    // 处理鼠标松开事件，在选择工具下执行的操作
    if (!this.isSelected) {
      // 未选中元素时的处理
      if (!this.isDragging && !this.isDoubleClicking) {
        // 如果不是拖拽操作或双击操作，则可能是点击空白区域
        this.clearSelection(); // 清除选择
      }
    } else {
      // 已选中元素时的处理
      if (this.isDragging) {
        // 停止拖拽
        this.isDragging = false;
      }
      if (this.isSelectingArea) {
        // 停止创建选区
        this.isSelectingArea = false;
      }
      if (this.isDoubleClicking) {
        // 如果是双击操作，则取消双击状态
        this.isDoubleClicking = false;
      }
    }
  }

  private detectControlPoint(event: PointerEvent): boolean {
    // 判断是否点击了元素的控制点
    return false; // 仅作示例，需要根据实际情况实现
  }

  private detectElementClick(event: PointerEvent): boolean {
    // 判断是否点击了选中的元素以外的区域
    return false; // 仅作示例，需要根据实际情况实现
  }

  private detectHover(event: PointerEvent): boolean {
    // 判断是否悬停在元素上
    return false; // 仅作示例，需要根据实际情况实现
  }

  private clearSelection() {
    // 清除选择
    this.isSelected = false;
    // 其他清除操作
  }

  private dragSelectedElements(event: PointerEvent) {
    // 拖拽选中的元素
    // 需要根据鼠标移动的距离来移动选中的元素
  }

  private createSelectionArea(event: PointerEvent) {
    // 创建选区
    // 需要根据鼠标移动的距离来绘制选区
  }
}
