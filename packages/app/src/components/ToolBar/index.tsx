import { ToolType } from '@drawease/board';
import React, { useEffect, useState } from 'react';

import { useEditor } from '../Editor/editorContext';

const ToolBar = () => {
  const { editor } = useEditor();
  const [activeType, setActiveType] = useState<ToolType>(ToolType.Select);
  const Tools = [
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
    const handler = (data: any) => {
      setActiveType(data.currentToolType);
    };
    editor.tool.eventEmitter.on('toolChange', handler);

    return () => {
      editor.tool.eventEmitter.off('toolChange', handler);
    };
  }, [editor, setActiveType]);

  return (
    <div
      id="drawease-toolbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        margin: '0 auto',
        zIndex: 100
      }}
    >
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
