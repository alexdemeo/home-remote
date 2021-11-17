import { ActionRequest, ActionResponse, Remote } from '../static/types';

export async function network(request: ActionRequest): Promise<ActionResponse> {
  const url = `http://${request.hostname}:${request.port}${request.endpoint}`;
  console.log(url);
  // const matchUrlRegex = `http\\:\\/\\/${request.hostname}\\:${request.port}\\/${request.endpoint}`;
  // console.log(matchUrlRegex);
  const fetchResult = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
      'Origin': '192.168.1.201',
      // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
    mode: 'cors',
  });
  const text = await fetchResult.formData();
  console.log('got back status =', text);
  return {
    status: fetchResult.status ?? -1,
  };
}
