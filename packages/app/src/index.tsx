// import { Button } from '@drawease/components';
import { BaseElementData, Board } from '@drawease/board';
import React, { useEffect, useRef } from 'react';

// 給外部暴露的接口
interface DrawEaseAppProps {
  initialData?: BaseElementData[];
  onBoardInited?: (board: Board) => void;
}

const DrawEaseApp = (props: DrawEaseAppProps) => {
  const { onBoardInited, initialData } = props;
  const containerRef = useRef<HTMLDivElement | null>();
  const BoardRef = useRef<Board | null>(null);

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

    BoardRef.current = board;

    onBoardInited && onBoardInited(board);
  }, [containerRef, onBoardInited, initialData]);

  return <div id="drawease-app-container" ref={containerRef}></div>;
};

export default DrawEaseApp;
