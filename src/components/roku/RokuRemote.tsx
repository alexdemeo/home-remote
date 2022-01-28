import styled from 'styled-components';
import { getAppsDataFromDevice, networkStatusWrapper } from '../../utils/network';
import { req, Row } from './util';
import { RokuTvData, Settings } from '../../static/types';
import { RemoteButton } from './RemoteButton';
import { StatusProps } from '../Status';
import { useEffect, useState } from 'react';
import { Bar } from '../Bar';
import { RokuApps } from './RokuApps';

const CenteredRow = styled(Row)`
  justify-content: center;
`;

const TextInput = styled.input`
  text-align: center;
  border: none;
  font-size: 26px;
  border-radius: 8px;
  width: 72px;
  transform: scale(115%);
`;

const Checkbox = styled.input`
  width: 32px;
  height: 32px;
  transform: scale(115%);
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const DPad = styled.div`
  margin: -15% auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
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
      <br />
      <Row>
        <Checkbox
          type="checkbox"
          onChange={event => setKeyCommandsEnabled(event.currentTarget.checked)}
          checked={enabled}
        />
        <TextInput
          type="text"
          onInput={handler => {
            const char = handler.currentTarget.value;
            const request = req(char ? encodeURI(`Lit_${char.slice(2)}`) : 'Backspace');
            networkStatusWrapper(request, setStatus);
          }}
          value="🔎"
        />
      </Row>
      <br />
      <Column>
        <Row>
          <Column>
            <RemoteButton
              icon="+"
              key_={{ bind: '=', enabled }}
              request={req('VolumeUp')}
              setStatus={setStatus}
              doRepeat
            />
            <RemoteButton
              icon="–"
              key_={{ bind: '-', enabled }}
              request={req('VolumeDown')}
              setStatus={setStatus}
              doRepeat
            />
            <RemoteButton icon="↲" request={req('Back')} setStatus={setStatus} />
          </Column>
          <Column>
            <RemoteButton icon="⏻" request={req('Power')} setStatus={setStatus} />
            <RemoteButton icon="⁌" request={req('VolumeMute')} setStatus={setStatus} />
            <RemoteButton icon="⌂" request={req('Home')} setStatus={setStatus} />
          </Column>
        </Row>
        <DPad>
          <CenteredRow>
            <RemoteButton
              icon="↑"
              key_={{ bind: 'ArrowUp', enabled }}
              request={req('Up')}
              setStatus={setStatus}
              doRepeat
            />
          </CenteredRow>
          <CenteredRow>
            <RemoteButton
              icon="←"
              key_={{ bind: 'ArrowLeft', enabled }}
              request={req('Left')}
              setStatus={setStatus}
              doRepeat
            />
            <RemoteButton icon="OK" key_={{ bind: 'Enter', enabled }} request={req('Select')} setStatus={setStatus} />
            <RemoteButton
              icon="→"
              key_={{ bind: 'ArrowRight', enabled }}
              request={req('Right')}
              setStatus={setStatus}
              doRepeat
            />
          </CenteredRow>
          <CenteredRow>
            <RemoteButton
              icon="↓"
              key_={{ bind: 'ArrowDown', enabled }}
              request={req('Down')}
              setStatus={setStatus}
              doRepeat
            />
          </CenteredRow>
        </DPad>
        <Row>
          <RemoteButton icon="↻" request={req('InstantReplay')} setStatus={setStatus} />
          <RemoteButton icon="*" request={req('Info')} setStatus={setStatus} />
        </Row>
        <Row>
          <RemoteButton icon="⦉⦉" request={req('Rev')} setStatus={setStatus} doRepeat />
          <RemoteButton icon="▻⫾⫾" request={req('Play')} setStatus={setStatus} />
          <RemoteButton icon="⦊⦊" request={req('Fwd')} setStatus={setStatus} doRepeat />
        </Row>
      </Column>
      <Bar />
      <RokuApps appData={appData} setStatus={setStatus} />
    </Column>
  );
}
