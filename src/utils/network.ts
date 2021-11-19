import { ActionRequest, ActionResponse } from '../static/types';

export async function network(request: ActionRequest): Promise<ActionResponse> {
  const url = `/${request.remote}${request.endpoint}`;
  console.log('fetch(', url, ')');
  const fetchResult = await fetch(url, {
    method: request.type,
    headers: [['Content-Type', 'application/json']],
  });
  return {
    status: fetchResult.status,
    data: request.type === 'POST' ? await fetchResult.json() : await fetchResult.text(),
  };
}
