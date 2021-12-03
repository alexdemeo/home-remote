import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Remote } from './static/types';
import styled from 'styled-components';
import { RemoteMapper } from './components/RemoteMapper';
import { isMobile } from 'react-device-detect';

const RemoteContainer = styled.div`
  width: ${isMobile ? '90%' : '512px'};
  border-width: 24px;
  border-radius: 24px;
  border-color: black;
  text-align: center;
  margin: auto;
  padding: 16px;
  background-color: #2d2d2d;
  -webkit-touch-callout: none;
  -webkit-user-select: none; /* Disable selection/copy in UIWebView */
`;

function App() {
  return (
    <Routes>
      {Object.values(Remote).map(remote => (
        <Route
          key={remote}
          path={remote}
          element={
            <RemoteContainer>
              <RemoteMapper remote={remote} />
            </RemoteContainer>
          }
        />
      ))}
      <Route path="/" element={<Navigate to={Remote.ROKU} />} />
    </Routes>
  );
}

export default App;
