import './App.css';

import DrawEaseApp from '@drawease/app';

import initialData from './mockData';

const App = () => {
  return (
    <div className="App">
      {/* 其他组件 */}
      <DrawEaseApp initialData={initialData} />
    </div>
  );
};

export default App;
