import styled from 'styled-components';
import { getAppsDataFromDevice, networkStatusWrapper } from '../../utils/network';
import { req, Row } from './util';
import { RokuTvData, Settings } from '../../static/types';
import { RemoteButton } from '../RemoteButton';
import { StatusProps } from '../Status';
import { useEffect, useState } from 'react';
import { Bar } from '../Bar';
import { RokuApps } from './RokuApps';

const TextInput = styled.input`
  text-align: center;
  border: none;
  font-size: 26px;
  border-radius: 8px;
  width: 72px;
`;

const Column = styled.div`
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
    <Column>
      <Row>
        <Checkbox
          type="checkbox"
          onClick={event => setKeyCommandsEnabled(event.currentTarget.checked)}
          checked={enabled}
        />
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
      </Row>
      <Column>
        <Row>
          <Column>
            <RemoteButton icon="+" key_={{ bind: '=', enabled }} request={req('VolumeUp')} setStatus={setStatus} />
            &nbsp;
            <RemoteButton icon="–" key_={{ bind: '-', enabled }} request={req('VolumeDown')} setStatus={setStatus} />
            &nbsp;
            <RemoteButton icon="↲" request={req('Back')} setStatus={setStatus} />
          </Column>
          <Column>
            <RemoteButton icon="⏻" request={req('Power')} setStatus={setStatus} />
            &nbsp;
            <RemoteButton icon="⁌" request={req('VolumeMute')} setStatus={setStatus} />
            &nbsp;
            <RemoteButton icon="⌂" request={req('Home')} setStatus={setStatus} />
          </Column>
        </Row>
        <DPad>
          <RemoteButton icon="↑" key_={{ bind: 'ArrowUp', enabled }} request={req('Up')} setStatus={setStatus} />
          <Row>
            <RemoteButton icon="←" key_={{ bind: 'ArrowLeft', enabled }} request={req('Left')} setStatus={setStatus} />
            <RemoteButton icon="OK" key_={{ bind: 'Enter', enabled }} request={req('Select')} setStatus={setStatus} />
            <RemoteButton
              icon="→"
              key_={{ bind: 'ArrowRight', enabled }}
              request={req('Right')}
              setStatus={setStatus}
            />
          </Row>
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
      </Column>
      <Bar />
      <RokuApps appData={appData} setStatus={setStatus} />
    </Column>
  );
}
