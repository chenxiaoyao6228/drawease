// import { Button } from '@drawease/components';
import { BaseElementData, Board } from '@drawease/board';
import React from 'react';

import Editor from './Editor';
import { EditorProvider, useEditor } from './Editor/editorContext';
import ToolBar from './ToolBar';

// 給外部暴露的接口
interface DrawEaseAppProps {
  initialData?: BaseElementData[];
  onBoardInited?: (board: Board) => void;
}

const DrawEaseApp = (props: DrawEaseAppProps) => {
  return (
    <EditorProvider>
      <div id="drawease-app-container">
        <ToolBar />
        <Editor {...props} />
      </div>
    </EditorProvider>
  );
};

export default DrawEaseApp;
