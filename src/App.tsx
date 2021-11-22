import React from 'react';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Remote } from './static/types';
import styled from 'styled-components';
import { RemoteMapper } from './components/RemoteMapper';
import { isMobile } from 'react-device-detect';

const RemoteContainer = styled.div`
  border-width: 6px;
  border-radius: 24px;
  border-color: black;
  width: ${isMobile ? '90%' : '512px'};
  text-align: center;
  margin: 2% auto;
  padding: 16px;
  background-color: #2d2d2d;
`;

function App() {
  return (
    <div className="App">
      <RemoteContainer>
        <Routes>
          {Object.values(Remote).map(remote => (
            <Route key={remote} path={remote} element={<RemoteMapper remote={remote} />} />
          ))}
          <Route path="/" element={<Navigate to={Remote.ROKU} />} />
        </Routes>
      </RemoteContainer>
    </div>
  );
}

export default App;
