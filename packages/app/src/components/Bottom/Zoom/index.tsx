import React, { useEffect } from 'react';

import { useEditor } from '../../Editor/editorContext';

export function Zoom() {
  const { editor } = useEditor();
  const [zoom, setZoom] = React.useState(1);

  useEffect(() => {
    if (!editor) {
      return;
    }
    const handler = ({ newZoom }) => {
      setZoom(newZoom);
    };
    editor.zoomManager.eventEmitter.on('zoomChange', handler);
    return () => {
      editor.zoomManager.eventEmitter.off('zoomChange', handler);
    };
  }, [setZoom, editor]);

  return (
    <div>
      <button onClick={() => editor?.zoomManager.zoomOut()}>-</button>
      {(zoom * 100).toFixed(0) + '%'}
      <button onClick={() => editor?.zoomManager.zoomIn()}>+</button>
    </div>
  );
}
