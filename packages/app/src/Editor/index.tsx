import { BaseElementData, Board } from '@drawease/board';
import React, { useEffect, useRef } from 'react';

import { useEditor } from './editorContext';

// 給外部暴露的接口
interface EditorProps {
  initialData?: BaseElementData[];
  onBoardInited?: (board: Board) => void;
}

const Editor = (props: EditorProps) => {
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
      board.loadDatas(initialData);
    }

    setEditor(board);

    BoardRef.current = board;

    onBoardInited && onBoardInited(board);
  }, [containerRef, onBoardInited, initialData, setEditor]);

  return <div className="drawease-board-container" ref={containerRef}></div>;
};

export default Editor;