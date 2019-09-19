import React from 'react';
import './styles/App.css';
import SearchComponent from './SearchComponent';
import PaginationComponent from './PaginationComponent';
import TableComponent from './TableComponent';

function App() {
  return (
    <div className="App">
      <PaginationComponent totalRecords={1500} pageSize={20} />
    </div>
  );
}

export default App;
