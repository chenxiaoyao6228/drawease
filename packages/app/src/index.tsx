import './index.css';

import { BaseElementData, Board } from '@drawease/board';
import React from 'react';

import Editor from './components/Editor';
import { EditorProvider } from './components/Editor/editorContext';
import ToolBar from './components/ToolBar';

// 給外部暴露的接口
interface DrawEaseAppProps {
  initialData?: BaseElementData[];
  onBoardInited?: (board: Board) => void;
}

const DrawEaseApp = (props: DrawEaseAppProps) => {
  return (
    <EditorProvider>
      {/* Board撑满，其他layer层绝对定位 */}
      <div id="drawease-app-container">
        <ToolBar />
        <Editor {...props} />
      </div>
    </EditorProvider>
  );
};

export default DrawEaseApp;
