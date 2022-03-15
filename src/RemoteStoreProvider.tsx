import React, { useEffect } from 'react';
import { GlobalState } from './static/types';
import { reducer, RemoteAction } from './reducer';
import { INITIAL_STATE } from './static/constants';
import { useLocation } from 'react-router-dom';

export type ContextProps = [state: GlobalState, dispatch: React.Dispatch<RemoteAction>];

interface StoreProviderProps {
  children: React.ReactNode;
}

const RemoteStoreContext = React.createContext({} as ContextProps);

export const LOCAL_STORAGE_CACHED_STATE_KEY = 'LOCAL_STORAGE_CACHED_STATE_KEY';

export const RemoteStoreProvider = ({ children }: StoreProviderProps) => {
  const cachedState = localStorage.getItem(LOCAL_STORAGE_CACHED_STATE_KEY);
  const initialState: GlobalState = cachedState ? JSON.parse(cachedState) : INITIAL_STATE;
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const location = useLocation();
  useEffect(
    () => () =>
      localStorage.setItem(
        LOCAL_STORAGE_CACHED_STATE_KEY,
        JSON.stringify({ ...state, tab: location.pathname.slice(1) }),
      ),
    [state, location.pathname],
  );
  return <RemoteStoreContext.Provider value={[state, dispatch]}>{children}</RemoteStoreContext.Provider>;
};

export const useRemoteStore = () => React.useContext(RemoteStoreContext);
