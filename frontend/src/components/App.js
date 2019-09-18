import React from 'react';
import './styles/App.css';
import SearchComponent from './SearchComponent';
import PaginationComponent from './PaginationComponent';

function App() {
  return (
    <div className="App">
      <PaginationComponent totalRecords={215} maxPages={10} position="default" />
    </div>
  );
}

export default App;
