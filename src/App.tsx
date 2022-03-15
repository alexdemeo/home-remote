import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Remote } from './static/types';
import styled from 'styled-components';
import { RemoteMapper } from './components/RemoteMapper';
import { isMobile } from 'react-device-detect';
import { BUTTON_BORDER_COLOR, REMOTE_BACKGROUND_COLOR } from './static/constants';
import { LOCAL_STORAGE_CACHED_STATE_KEY, RemoteStoreProvider } from './RemoteStoreProvider';

const RemoteContainer = styled.div`
  width: ${isMobile ? '90%' : '500px'};
  border-radius: 24px;
  border: 4px solid ${BUTTON_BORDER_COLOR};
  text-align: center;
  margin: auto;
  padding: 16px;
  background-color: ${REMOTE_BACKGROUND_COLOR};
  -webkit-touch-callout: none;
  -webkit-user-select: none; /* Disable selection/copy in UIWebView */
`;

function App() {
  document.body.style.backgroundColor = REMOTE_BACKGROUND_COLOR;
  document.onkeydown = evt => {
    // prevent arrow keys from scrolling, since they're used for navigating Roku DPad
    if (['ArrowUp', 'ArrowDown'].includes(evt.code)) {
      return false;
    }
  };
  const location = useLocation();
  const currSetting = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CACHED_STATE_KEY) ?? '{ "tab": "roku" }');
  useEffect(
    () =>
      localStorage.setItem(
        LOCAL_STORAGE_CACHED_STATE_KEY,
        JSON.stringify({ ...currSetting, tab: location.pathname.slice(1) }),
      ),
    [currSetting, location.pathname],
  );
  if (location.pathname === '/') {
    return <Navigate to={currSetting.tab} />;
  }
  return (
    <Routes>
      {Object.values(Remote).map(remote => (
        <Route
          key={remote}
          path={remote}
          element={
            <RemoteStoreProvider>
              <RemoteContainer>
                <RemoteMapper remote={remote} />
              </RemoteContainer>
            </RemoteStoreProvider>
          }
        />
      ))}
    </Routes>
  );
}

export default App;
