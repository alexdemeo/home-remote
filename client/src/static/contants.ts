import { Remote, Settings } from './types';

export const defaultSettings: Settings = {
  [Remote.ROKU]: {
    ip: '192.168.1.226',
    port: 8060,
  },
  [Remote.COFFEE]: {
    ip: 'pi3.local',
    port: 5000,
  },
  [Remote.PRINTER]: {
    ip: 'pi2.local',
    port: 5555,
  },
};
