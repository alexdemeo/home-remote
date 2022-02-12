import React from 'react';
import { GlobalState } from './static/types';
import { reducer, RemoteAction } from './reducer';
import { INITIAL_STATE } from './static/constants';

export type ContextProps = [state: GlobalState, dispatch: React.Dispatch<RemoteAction>];

interface StoreProviderProps {
  children: React.ReactNode;
}

const RemoteStoreContext = React.createContext({} as ContextProps);

export const RemoteStoreProvider = ({ children }: StoreProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  return <RemoteStoreContext.Provider value={[state, dispatch]}>{children}</RemoteStoreContext.Provider>;
};

export const useRemoteStore = () => React.useContext(RemoteStoreContext);
