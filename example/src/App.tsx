import './App.css';

import DrawEaseApp from '@drawease/app';

import initialData from './mockData';

const App = () => {
  return (
    <div className="app">
      <DrawEaseApp initialData={initialData} />
    </div>
  );
};

export default App;
