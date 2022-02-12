import styled from 'styled-components';
import { RokuAppData, RokuTvData } from '../../static/types';
import { RemoteButton } from './RemoteButton';
import { req, Row } from './util';

const AppGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export function RokuApps({ appData }: { appData: RokuTvData }): JSX.Element {
  return (
    <AppGroupContainer>
      <Apps apps={appData.inputs} textEnabled />
      <Apps apps={appData.apps} textEnabled={false} />
    </AppGroupContainer>
  );
}
function Apps({ apps, textEnabled }: { apps: RokuAppData[]; textEnabled: boolean }): JSX.Element {
  const apps_ = apps.map((app, i) => (
    <RemoteButton
      key={`input-${i}`}
      icon={{ blob: app.image, text: textEnabled ? app.name : undefined }}
      request={req(app.launchId, 'launch')}
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
