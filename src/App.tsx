import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Remote } from './types';
import styled from 'styled-components';
import { RemoteMapper } from './components/RemoteMapper';

const RemoteContainer = styled.div`
  border-width: 6px;
  border-radius: 24px;
  border-color: black;
  width: 512px;
  height: 90vh;
  text-align: center;
  margin: auto;
  transform: translateY(2%);
  padding: 16px;
  background-color: #61dafb;
`;

function App() {
  return (
    <div className="App">
      <RemoteContainer>
        <Routes>
          <Route path={Remote.ROKU} element={<RemoteMapper remote={Remote.ROKU} />} />
          <Route path={Remote.COFFEE} element={<RemoteMapper remote={Remote.COFFEE} />} />
          <Route path={Remote.PRINTER} element={<RemoteMapper remote={Remote.PRINTER} />} />
        </Routes>
      </RemoteContainer>
    </div>
  );
}

export default App;
