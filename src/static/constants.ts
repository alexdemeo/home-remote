import { GlobalState, Remote } from './types';

export const REMOTE_BACKGROUND_COLOR = '#2d2d2d';
export const BUTTON_BORDER_COLOR = '#3d3d3d';

export const INITIAL_STATE: GlobalState = {
  status: { code: undefined, endpoint: '❌' },
  [Remote.ROKU]: {
    keyCommandsEnabled: true,
  },
  [Remote.COFFEE]: {},
  [Remote.STATION]: {},
};
