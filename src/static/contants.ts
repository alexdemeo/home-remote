import { Remote, Settings } from './types';

export const defaultSettings: Settings = {
  [Remote.ROKU]: {
    keyCommandsEnabled: true,
  },
  [Remote.COFFEE]: {},
  [Remote.STATION]: {},
};
