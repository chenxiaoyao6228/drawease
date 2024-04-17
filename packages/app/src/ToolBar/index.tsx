const ToolBar = () => {
  const Tools = [
    { type: 'select', text: 'select', icon: '', action: () => {} },
    { type: 'rect', text: 'rect', icon: '', action: () => {} }
  ];
  return (
    <div id="drawease-toolbar">
      {Tools.map((tool) => {
        return <button>{tool.text}</button>;
      })}
    </div>
  );
};
