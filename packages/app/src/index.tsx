// import { Button } from '@drawease/components';
import { Board } from '@drawease/board';
import React, { useEffect, useRef } from 'react';

// 給外部暴露的接口
interface DrawEaseAppProps {
  initialData?: any[];
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

    const _Board = new Board({
      container: containerRef.current
    });

    if (initialData) {
      _Board.loadDatas(initialData);
    }

    BoardRef.current = _Board;

    onBoardInited && onBoardInited(_Board);
  }, [containerRef, onBoardInited]);

  return <div id="drawease-container" ref={containerRef}></div>;
};

export default DrawEaseApp;
