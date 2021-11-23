export enum Remote {
  ROKU = 'roku',
  COFFEE = 'coffee',
  STATION = 'station',
}

export type Settings = { [remote in Remote]: any };

export interface ActionRequest {
  httpMethod: string;
  remote: Remote;
  endpoint: string;
  type: 'text' | 'blob';
}

export interface ActionResponse {
  status: number;
  textData?: string;
  blobData?: Blob;
}

export type RokuAppData = {
  image: Blob;
  launchId: string | number;
  name: string;
};

export type RokuTvData = { inputs: RokuAppData[]; apps: RokuAppData[] };

export type ApplianceStatus = 'on' | 'off' | 'unknown';
