export enum Remote {
  ROKU = 'roku',
  COFFEE = 'coffee',
  PRINTER = 'printer',
}

export type Settings = { [remote in Remote]: any };

export interface ActionRequest {
  httpMethod: string;
  remote: Remote;
  endpoint: string;
  type: 'text' | 'raw';
}

export interface ActionResponse {
  status: number;
  textData?: string;
  rawData?: ArrayBuffer;
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

export type RokuAppData = {
  image: ArrayBuffer;
  launchId: string | number;
  name: string;
};

export type RokuTvData = { inputs: RokuAppData[]; apps: RokuAppData[] };
