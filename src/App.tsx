import React, { createRef, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { GlobalState, Remote } from './static/types';
import styled from 'styled-components';
import { RemoteMapper } from './components/RemoteMapper';
import { isElectron, isMobile } from 'react-device-detect';
import { BUTTON_BORDER_COLOR, INITIAL_STATE, REMOTE_BACKGROUND_COLOR } from './static/constants';
import { LOCAL_STORAGE_CACHED_STATE_KEY, RemoteStoreProvider } from './RemoteStoreProvider';

const RemoteContainer = styled.div`
  width: ${isMobile ? '90%' : '500px'};
  border-radius: 24px;
  border: 4px solid ${BUTTON_BORDER_COLOR};
  text-align: center;
  margin: 0 auto;
  padding: 16px;
  background-color: ${REMOTE_BACKGROUND_COLOR};
  -webkit-touch-callout: none;
  -webkit-user-select: none; /* Disable selection/copy in UIWebView */

  ${isElectron &&
  `
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  `}
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
  const currSetting: GlobalState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_CACHED_STATE_KEY) ?? JSON.stringify(INITIAL_STATE),
  );
  useEffect(
    () =>
      localStorage.setItem(
        LOCAL_STORAGE_CACHED_STATE_KEY,
        JSON.stringify({ ...currSetting, tab: location.pathname.slice(1) }),
      ),
    [currSetting, location.pathname],
  );

  const remoteContainerRef: React.RefObject<HTMLDivElement> = createRef();
  const observer = React.useRef(
    new ResizeObserver(entries => {
      if (isElectron) {
        const { target } = entries[0];
        // I have no idea why these are too large, * 0.8 looks about right on my laptop
        const [width, height] = [target.clientWidth ?? 0, target.clientHeight ?? 0].map(x => x * 0.8);
        window.require('electron').ipcRenderer.send('resize-electron-plz', Math.round(width), Math.round(height));
      }
    }),
  );
  useEffect(() => {
    if (remoteContainerRef.current) {
      observer.current.observe(remoteContainerRef.current);
    }
  }, [remoteContainerRef, observer]);

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
              <RemoteContainer ref={remoteContainerRef}>
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
