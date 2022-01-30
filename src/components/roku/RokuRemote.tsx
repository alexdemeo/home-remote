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
  const [isSearching, setIsSearching] = useState<boolean>(false);
  useEffect(() => {
    getAppsDataFromDevice()
      .then(setAppData)
      .catch(error => {
        console.error(error);
        setStatus({ status: undefined, endpoint: '/query/apps' });
      });
  }, [setStatus]);
  const initSearchInput = (evt: any) => {
    evt.currentTarget.setSelectionRange(1, 1);
    setIsSearching(true);
  };
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
          onFocus={initSearchInput}
          onClick={initSearchInput}
          onBlur={() => setIsSearching(false)}
          onKeyDown={evt => {
            // don't allow arrow key seeking while editing, since really this is just a text box
            if (['ArrowLeft', 'ArrowRight'].includes(evt.key)) {
              evt.preventDefault();
            }
          }}
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
              enabled={!isSearching}
              doRepeat
            />
            <RemoteButton
              icon="–"
              key_={{ bind: '-', enabled }}
              request={req('VolumeDown')}
              setStatus={setStatus}
              enabled={!isSearching}
              doRepeat
            />
            <RemoteButton icon="↲" request={req('Back')} setStatus={setStatus} enabled={!isSearching} />
          </Column>
          <Column>
            <RemoteButton icon="⏻" request={req('Power')} setStatus={setStatus} enabled={!isSearching} />
            <RemoteButton icon="⁌" request={req('VolumeMute')} setStatus={setStatus} enabled={!isSearching} />
            <RemoteButton icon="⌂" request={req('Home')} setStatus={setStatus} enabled={!isSearching} />
          </Column>
        </Row>
        <DPad>
          <CenteredRow>
            <RemoteButton
              icon="↑"
              key_={{ bind: 'ArrowUp', enabled }}
              request={req('Up')}
              setStatus={setStatus}
              enabled={!isSearching}
              doRepeat
            />
          </CenteredRow>
          <CenteredRow>
            <RemoteButton
              icon="←"
              key_={{ bind: 'ArrowLeft', enabled }}
              request={req('Left')}
              setStatus={setStatus}
              enabled={!isSearching}
              doRepeat
            />
            <RemoteButton
              icon="OK"
              key_={{ bind: 'Enter', enabled }}
              request={req('Select')}
              setStatus={setStatus}
              enabled={!isSearching}
            />
            <RemoteButton
              icon="→"
              key_={{ bind: 'ArrowRight', enabled }}
              request={req('Right')}
              setStatus={setStatus}
              enabled={!isSearching}
              doRepeat
            />
          </CenteredRow>
          <CenteredRow>
            <RemoteButton
              icon="↓"
              key_={{ bind: 'ArrowDown', enabled }}
              request={req('Down')}
              setStatus={setStatus}
              enabled={!isSearching}
              doRepeat
            />
          </CenteredRow>
        </DPad>
        <Row>
          <RemoteButton icon="↻" request={req('InstantReplay')} setStatus={setStatus} enabled={!isSearching} />
          <RemoteButton icon="*" request={req('Info')} setStatus={setStatus} enabled={!isSearching} />
        </Row>
        <Row>
          <RemoteButton icon="⦉⦉" request={req('Rev')} setStatus={setStatus} enabled={!isSearching} doRepeat />
          <RemoteButton icon="▻⫾⫾" request={req('Play')} setStatus={setStatus} enabled={!isSearching} />
          <RemoteButton icon="⦊⦊" request={req('Fwd')} setStatus={setStatus} enabled={!isSearching} doRepeat />
        </Row>
      </Column>
      <Bar />
      <RokuApps appData={appData} setStatus={setStatus} />
    </Column>
  );
}
