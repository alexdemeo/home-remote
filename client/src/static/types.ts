export enum Remote {
  ROKU = 'roku',
  COFFEE = 'coffee',
  PRINTER = 'printer',
}

export type Settings = { [remote in Remote]: any };

export interface ActionRequest {
  remote: Remote;
  endpoint: string;
}

export interface ActionResponse {
  status: number;
}
