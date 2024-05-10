import './index.scss';

import { ToolType } from '@drawease/board';
import React, { useEffect, useState } from 'react';

import { useEditor } from '../Editor/editorContext';

const ToolBar = () => {
  const { editor } = useEditor();
  const [activeType, setActiveType] = useState<ToolType>(ToolType.Pan);
  const Tools = [
    {
      type: ToolType.Pan,
      text: 'Hand',
      icon: '',
      action: () => {
        editor?.tool.invokeToolByType(ToolType.Pan);
      }
    },
    {
      type: ToolType.Select,
      text: 'Select',
      icon: '',
      action: () => {
        editor?.tool.invokeToolByType(ToolType.Select);
      }
    },
    {
      type: ToolType.Rect,
      text: 'Rectangle',
      icon: '',
      action: () => {
        editor?.tool.invokeToolByType(ToolType.Rect);
      }
    },
    {
      type: ToolType.Diamond,
      text: 'Diamond',
      icon: '',
      action: () => {
        editor?.tool.invokeToolByType(ToolType.Diamond);
      }
    },
    {
      type: ToolType.Ellipse,
      text: 'Ellipse',
      icon: '',
      action: () => {
        editor?.tool.invokeToolByType(ToolType.Ellipse);
      }
    },
    {
      type: ToolType.Line,
      text: 'Line',
      icon: '',
      action: () => {
        editor?.tool.invokeToolByType(ToolType.Line);
      }
    }
  ];

  useEffect(() => {
    if (!editor) {
      return;
    }
    const handler = (toolType: ToolType) => {
      setActiveType(toolType);
    };
    editor.tool.eventEmitter.on('toolChange', handler);

    return () => {
      editor.tool.eventEmitter.off('toolChange', handler);
    };
  }, [editor, setActiveType]);

  return (
    <div id="drawease-toolbar">
      {Tools.map((tool) => (
        <button
          key={tool.type}
          style={{
            border: '1px solid #ccc',
            background: tool.type === activeType ? '#b0eeb0' : 'transparent'
          }}
          onClick={tool.action}
        >
          {tool.text}
        </button>
      ))}
    </div>
  );
};

export default ToolBar;
