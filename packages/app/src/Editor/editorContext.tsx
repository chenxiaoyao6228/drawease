import { Board } from '@drawease/board';
import React, { createContext, useContext, useState } from 'react';

export const EditorContext = createContext<{ editor: Board | null; setEditor: React.Dispatch<React.SetStateAction<Board | null>> }>({
  editor: null,
  setEditor: () => {}
});

export const EditorProvider: React.FC<{ children: React.JSX.Element }> = (props) => {
  const [editor, setEditor] = useState<Board | null>(null);

  return <EditorContext.Provider value={{ editor, setEditor }}>{props.children}</EditorContext.Provider>;
};

export const useEditor = () => useContext(EditorContext);
