import { Remote, Settings } from './types';

export const defaultSettings: Settings = {
  [Remote.ROKU]: {
    keyCommandsEnabled: true,
  },
  [Remote.COFFEE]: {},
  [Remote.STATION]: {},
};

export const REMOTE_BACKGROUND_COLOR = '#2d2d2d';
export const BUTTON_BORDER_COLOR = '#3d3d3d';
