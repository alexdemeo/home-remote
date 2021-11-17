export enum Remote {
  ROKU = 'roku',
  COFFEE = 'coffee',
  PRINTER = 'station',
}

export type Settings = { [remote in Remote]: any };

export interface ActionRequest {
  remote: Remote;
  hostname: string;
  port: number;
  endpoint: string;
}

export interface ActionResponse {
  status: number;
}
