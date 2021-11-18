import { ActionRequest, ActionResponse } from '../static/types';

export async function network(request: ActionRequest): Promise<ActionResponse> {
  const url = `${process.env.NODE_ENV === 'production' ? '127.0.0.1:4001' : ''}/${request.remote}${request.endpoint}`;
  console.log('fetch(', url, ')');
  const fetchResult = await fetch(url, {
    method: 'POST',
    headers: [['Content-Type', 'application/json']],
  });
  return {
    status: fetchResult.status,
  };
}
