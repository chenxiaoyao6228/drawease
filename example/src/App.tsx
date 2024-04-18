import './App.css';

import DrawEaseApp from '@drawease/app';

import initialData from './mockData';

const App = () => {
  return (
    <div
      className="App"
      style={{
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* 其他组件 */}
      <DrawEaseApp />
    </div>
  );
};

export default App;
