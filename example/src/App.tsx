import './App.scss';

import DrawEaseApp from '@drawease/app';

import initialData from './mockData';

const App = () => {
  return (
    <div className="app">
      <header> Outer Header</header>
      <main>
        <aside>Outer LeftAside</aside>
        <section>
          <DrawEaseApp initialData={initialData} />
        </section>
      </main>
      <footer></footer>
    </div>
  );
};

export default App;
