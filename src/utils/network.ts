import { ActionRequest, ActionResponse, Remote, RokuAppData, RokuTvData } from '../static/types';

export async function network(request: ActionRequest): Promise<ActionResponse> {
  const url = `/${request.remote}${request.endpoint}`;
  console.log('fetch(', url, ')');
  const fetchResult = await fetch(url, {
    method: request.httpMethod,
    headers: [['Content-Type', 'application/json']],
  });
  return {
    status: fetchResult.status,
    textData: request.type === 'text' ? await fetchResult.text() : undefined,
    rawData: request.type === 'raw' ? await fetchResult.arrayBuffer() : undefined,
  };
}

export async function getAppsDataFromDevice(): Promise<RokuTvData> {
  const result = await network({ httpMethod: 'GET', remote: Remote.ROKU, endpoint: '/query/apps', type: 'text' });
  console.log('got back', result.textData);
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
      type: 'raw',
    });
    imgDataPromises.push(thisDataPromise);
  }
  const allImgData: ActionResponse[] = await Promise.all(imgDataPromises);
  const allData: RokuAppData[] = allImgData.map((data, i) => ({
    image: data.rawData!,
    launchId: xmlApps.item(i)?.id ?? -1,
    name: xmlApps.item(i)?.textContent ?? 'unknown',
  }));
  console.log(allData.map(d => d.name));
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
