import { ActionRequest, ActionResponse, ApplianceStatus, Remote, RokuAppData, RokuTvData } from '../static/types';
import { StatusProps } from '../components/Status';

export async function network(request: ActionRequest): Promise<ActionResponse> {
  const url = `/${request.remote}${request.endpoint}`;
  console.log('fetch(', request.httpMethod, url, ')');
  const fetchResult = await fetch(url, {
    method: request.httpMethod,
    headers: [['Content-Type', 'application/json']],
  });
  return {
    status: fetchResult.status,
    textData: request.type === 'text' ? await fetchResult.text() : undefined,
    blobData: request.type === 'blob' ? await fetchResult.blob() : undefined,
  };
}

export async function getAppsDataFromDevice(): Promise<RokuTvData> {
  const result = await network({ httpMethod: 'GET', remote: Remote.ROKU, endpoint: '/query/apps', type: 'text' });
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(result.textData!, 'text/xml');
  const xmlApps = xmlDoc.getElementsByTagName('app');
  const imgDataPromises: Promise<ActionResponse>[] = [];
  for (let i = 0; i < xmlApps.length; i += 1) {
    const xmlApp = xmlApps[i];
    const thisDataPromise: Promise<ActionResponse> = network({
      httpMethod: 'GET',
      remote: Remote.ROKU,
      endpoint: `/query/icon/${xmlApp.id}`,
      type: 'blob',
    });
    imgDataPromises.push(thisDataPromise);
  }
  const allImgData: ActionResponse[] = await Promise.all(imgDataPromises);
  const allData: RokuAppData[] = allImgData.map((data, i) => ({
    image: data.blobData!,
    launchId: xmlApps.item(i)?.id ?? -1,
    name: xmlApps.item(i)?.textContent ?? 'unknown',
  }));
  const inputs: RokuAppData[] = [];
  const apps: RokuAppData[] = [];
  for (const data of allData) {
    if (data.launchId.toString().includes('tvinput')) {
      inputs.push(data);
    } else {
      apps.push(data);
    }
  }
  return {
    inputs,
    apps,
  };
}

export function networkStatusWrapper(
  request: ActionRequest,
  setStatus: (status: StatusProps) => void,
  callback?: (succeeded: boolean) => void,
): void {
  network(request)
    .then(response => {
      console.log('Received: ', JSON.stringify(response));
      setStatus({ ...response, endpoint: request.endpoint });
      callback?.(true);
    })
    .catch(err => {
      console.error('Error: ', err.message);
      setStatus({ status: err.message, endpoint: request.endpoint });
      callback?.(false);
    });
}
