import { GlobalState, Remote, StatusState } from './static/types';

type ActionSetStatus = { type: 'setStatus' } & Pick<StatusState, 'endpoint' | 'code'>;
type ActionSetKeyCommandsEnabled = { type: 'setKeyCommandsEnabled'; enabled: boolean };

export type RemoteAction = ActionSetStatus | ActionSetKeyCommandsEnabled;

export function reducer(state: GlobalState, action: RemoteAction): GlobalState {
  switch (action.type) {
    case 'setStatus':
      const isSameRequestAndResult = state.status.endpoint === action.endpoint && state.status.code === action.code;
      const oldRequestCount = state.status.repeatCount;
      const repeatCount = isSameRequestAndResult ? (oldRequestCount ?? 1) + 1 : undefined;
      return {
        ...state,
        status: { ...action, repeatCount },
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
