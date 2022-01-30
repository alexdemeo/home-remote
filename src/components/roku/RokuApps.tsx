import styled from 'styled-components';
import { RokuAppData, RokuTvData } from '../../static/types';
import { StatusProps } from '../Status';
import { RemoteButton } from './RemoteButton';
import { req, Row } from './util';

const AppGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export function RokuApps({
  appData,
  setStatus,
}: {
  appData: RokuTvData;
  setStatus: (status: StatusProps) => void;
}): JSX.Element {
  return (
    <AppGroupContainer>
      <Apps apps={appData.inputs} setStatus={setStatus} textEnabled />
      <Apps apps={appData.apps} setStatus={setStatus} textEnabled={false} />
    </AppGroupContainer>
  );
}
function Apps({
  apps,
  setStatus,
  textEnabled,
}: {
  apps: RokuAppData[];
  setStatus: (status: StatusProps) => void;
  textEnabled: boolean;
}): JSX.Element {
  const apps_ = apps.map((app, i) => (
    <RemoteButton
      key={`input-${i}`}
      icon={{ blob: app.image, text: textEnabled ? app.name : undefined }}
      request={req(app.launchId, 'launch')}
      setStatus={setStatus}
      enabled={true}
    />
  ));
  const w = 3;
  const indexes = Array.from(new Array(apps.length).keys());
  const diced: JSX.Element[][] = [];
  for (const i of indexes) {
    if (i % w === 0) {
      diced.push([apps_[i]]);
    } else {
      diced[diced.length - 1].push(apps_[i]);
    }
  }
  return (
    <>
      {diced.map((row, i) => (
        <Row key={i}>{row}</Row>
      ))}
    </>
  );
}
