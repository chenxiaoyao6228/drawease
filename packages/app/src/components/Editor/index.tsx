import { BaseElementData, Board } from '@drawease/board';
import React, { useEffect, useRef } from 'react';

import { useEditor } from './editorContext';

// 給外部暴露的接口
interface IEditorProps {
  initialData?: BaseElementData[];
  onBoardInited?: (board: Board) => void;
}

const Editor = (props: IEditorProps) => {
  const { onBoardInited, initialData } = props;
  const containerRef = useRef<HTMLDivElement | null>();
  const BoardRef = useRef<Board | null>(null);
  const { setEditor } = useEditor();

  useEffect(() => {
    if (!containerRef.current || BoardRef.current) {
      return;
    }

    const board = new Board({
      container: containerRef.current
    });

    if (initialData) {
      board.scene.loadDatas(initialData);
    }

    setEditor(board);

    // @ts-expect-error 临时全局调试
    window.board = board;

    BoardRef.current = board;

    onBoardInited && onBoardInited(board);
  }, [containerRef, onBoardInited, initialData, setEditor]);

  return (
    <div
      className="drawease-board-container"
      style={{
        height: '100%'
      }}
      ref={containerRef}
    ></div>
  );
};

export default Editor;
