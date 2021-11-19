export enum Remote {
  ROKU = 'roku',
  COFFEE = 'coffee',
  PRINTER = 'printer',
}

export type Settings = { [remote in Remote]: any };

export interface ActionRequest {
  type: string;
  remote: Remote;
  endpoint: string;
}

export interface ActionResponse {
  status: number;
  data?: any;
}

export function remoteToEndpoint(remote: Remote): string {
  switch (remote) {
    case Remote.ROKU:
      return 'roku';
    case Remote.COFFEE:
      return 'coffee';
    case Remote.PRINTER:
      return 'station';
  }
}
