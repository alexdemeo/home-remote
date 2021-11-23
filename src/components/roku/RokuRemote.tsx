import styled from 'styled-components';
import { ActionRequest, Remote, RokuAppData, RokuTvData, Settings } from '../../static/types';
import { RemoteButton } from '../RemoteButton';
import { StatusProps } from '../Status';
import { getAppsDataFromDevice, networkStatusWrapper } from '../../utils/network';
import { useEffect, useState } from 'react';
import { Bar } from '../Bar';

const Container = styled.div``;

const TextInput = styled.input`
  text-align: center;
  border: none;
  font-size: 26px;
  border-radius: 8px;
  width: 72px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const CenteredRow = styled(Row)`
  margin: 0 auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const StaticButtons = styled.div`
  display: flex;
  flex-direction: column;
`;

const DPad = styled.div`
  margin: -32px auto;
`;

const Checkbox = styled.input`
  width: 32px;
  height: 32px;
`;

interface Props {
  settings: Settings;
  setStatus: (status: StatusProps) => void;
}

export function RokuRemote({ settings, setStatus }: Props): JSX.Element {
  const [appData, setAppData] = useState<RokuTvData>({ inputs: [], apps: [] });
  const [enabled, setKeyCommandsEnabled] = useState<boolean>(settings.roku.keyCommandsEnabled);
  useEffect(() => {
    getAppsDataFromDevice()
      .then(setAppData)
      .catch(error => {
        console.error(error);
        setStatus({ status: undefined, endpoint: '/query/apps' });
      });
  }, [setStatus]);
  return (
    <Container>
      <CenteredRow>
        <Checkbox type="checkbox" onClick={event => setKeyCommandsEnabled(event.currentTarget.checked)} />
        <TextInput
          type="text"
          onInput={handler => {
            const char = handler.currentTarget.value;
            handler.currentTarget.value = '';
            console.log(char);
            const request = req(encodeURI(`Lit_${char}`));
            networkStatusWrapper(request, setStatus);
          }}
          placeholder="🔎"
        />
      </CenteredRow>
      <StaticButtons>
        <Row>
          <Column>
            <RemoteButton icon="+" key_={{ bind: '=', enabled }} request={req('VolumeUp')} setStatus={setStatus} />
            <RemoteButton icon="–" key_={{ bind: '-', enabled }} request={req('VolumeDown')} setStatus={setStatus} />
            <RemoteButton icon="↲" request={req('Back')} setStatus={setStatus} />
          </Column>
          <Column>
            <RemoteButton icon="⏻" request={req('Power')} setStatus={setStatus} />
            <RemoteButton icon="⁌" request={req('VolumeMute')} setStatus={setStatus} />
            <RemoteButton icon="⌂" request={req('Home')} setStatus={setStatus} />
          </Column>
        </Row>
        <DPad>
          <RemoteButton icon="↑" key_={{ bind: 'ArrowUp', enabled }} request={req('Up')} setStatus={setStatus} />
          <CenteredRow>
            <RemoteButton icon="←" key_={{ bind: 'ArrowLeft', enabled }} request={req('Left')} setStatus={setStatus} />
            <RemoteButton icon="OK" key_={{ bind: 'Enter', enabled }} request={req('Select')} setStatus={setStatus} />
            <RemoteButton
              icon="→"
              key_={{ bind: 'ArrowRight', enabled }}
              request={req('Right')}
              setStatus={setStatus}
            />
          </CenteredRow>
          <RemoteButton icon="↓" key_={{ bind: 'ArrowDown', enabled }} request={req('Down')} setStatus={setStatus} />
        </DPad>
        <Row>
          <RemoteButton icon="↻" request={req('InstantReplay')} setStatus={setStatus} />
          <RemoteButton icon="*" request={req('Info')} setStatus={setStatus} />
        </Row>
        <Row>
          <RemoteButton icon="⦉⦉" request={req('Rev')} setStatus={setStatus} />
          <RemoteButton icon="▻⫾⫾" request={req('Play')} setStatus={setStatus} />
          <RemoteButton icon="⦊⦊" request={req('Fwd')} setStatus={setStatus} />
        </Row>
      </StaticButtons>
      <Bar />
      <AppGroup apps={appData.inputs} setStatus={setStatus} textEnabled />
      <AppGroup apps={appData.apps} setStatus={setStatus} textEnabled={false} />
    </Container>
  );
}

const AppGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function AppGroup({
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
    />
  ));
  const w = 4;
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
    <AppGroupContainer>
      {diced.map((row, i) => (
        <CenteredRow key={i}>{row}</CenteredRow>
      ))}
    </AppGroupContainer>
  );
}

const req = (cmd: string | number, type: 'keypress' | 'launch' = 'keypress'): ActionRequest => ({
  httpMethod: 'POST',
  remote: Remote.ROKU,
  endpoint: `/${type}/${cmd}`,
  type: 'text',
});
