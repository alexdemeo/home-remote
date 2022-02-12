import { useReducer } from 'react';
import { INITIAL_STATE } from './static/constants';
import { GlobalState, Remote, StatusState } from './static/types';

type ActionSetStatus = { type: 'setStatus' } & StatusState;
type ActionSetKeyCommandsEnabled = { type: 'setKeyCommandsEnabled'; enabled: boolean };

export type RemoteAction = ActionSetStatus | ActionSetKeyCommandsEnabled;

export function reducer(state: GlobalState, action: RemoteAction): GlobalState {
  switch (action.type) {
    case 'setStatus':
      return {
        ...state,
        status: {
          code: action.code,
          endpoint: action.endpoint,
        },
      };
    case 'setKeyCommandsEnabled':
      return {
        ...state,
        [Remote.ROKU]: {
          ...state[Remote.ROKU],
          keyCommandsEnabled: action.enabled,
        },
      };
  }
}

export const useRemoteReducer = () => useReducer(reducer, INITIAL_STATE);
