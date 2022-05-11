import { ActionRequest, ActionResponse, Remote, RokuAppData, RokuTvData } from '../static/types';
import { RemoteAction } from '../reducer';
import React from 'react';

export async function network(request: ActionRequest): Promise<ActionResponse> {
  const url = `/${request.remote}${request.endpoint}`;
  console.log('fetch(', request.httpMethod, url, ')');
  const fetchResult = await fetch(url, {
    method: request.httpMethod,
    headers: [['Content-Type', 'application/json']],
  });
  if (fetchResult.status >= 500) {
    return {
      status: fetchResult.status,
      textData: 'error',
    };
  } else {
    return {
      status: fetchResult.status,
      textData: request.type === 'text' ? await fetchResult.text() : undefined,
      blobData: request.type === 'blob' ? await fetchResult.blob() : undefined,
    };
  }
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
  dispatch: React.Dispatch<RemoteAction>,
  callback?: (succeeded: boolean) => void,
): void {
  network(request)
    .then(response => {
      console.log('Received: ', JSON.stringify(response));
      dispatch({ type: 'setStatus', code: response.status, endpoint: request.endpoint });
      callback?.(true);
    })
    .catch(err => {
      console.error('Error: ', err.message);
      dispatch({ type: 'setStatus', code: err.message, endpoint: request.endpoint });
      callback?.(false);
    });
}
