import styled from 'styled-components';
import { getAppsDataFromDevice, networkStatusWrapper } from '../../utils/network';
import { req, Row } from './util';
import { Remote, RokuTvData } from '../../static/types';
import { RemoteButton } from './RemoteButton';
import { RefObject, useEffect, useRef, useState } from 'react';
import { Bar } from '../Bar';
import { RokuApps } from './RokuApps';
import { useRemoteStore } from '../../RemoteStoreProvider';

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

export function RokuRemote(): JSX.Element {
  const [state, dispatch] = useRemoteStore();
  const [appData, setAppData] = useState<RokuTvData>({ inputs: [], apps: [] });
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const topRef: RefObject<HTMLBRElement> = useRef(null);

  useEffect(() => {
    getAppsDataFromDevice()
      .then(setAppData)
      .then(() => topRef.current?.scrollIntoView())
      .catch(error => {
        console.error(error);
        dispatch({ type: 'setStatus', code: undefined, endpoint: '/query/apps' });
      });
  }, [dispatch]);
  const initSearchInput = (evt: any) => {
    evt.currentTarget.setSelectionRange(1, 1);
    setIsSearching(true);
  };

  const { keyCommandsEnabled: enabled } = state[Remote.ROKU];
  return (
    <Column>
      <br ref={topRef} />
      <Row>
        <Checkbox
          type="checkbox"
          onChange={event => dispatch({ type: 'setKeyCommandsEnabled', enabled: event.currentTarget.checked })}
          checked={state[Remote.ROKU].keyCommandsEnabled}
        />
        <TextInput
          type="text"
          onInput={handler => {
            const char = handler.currentTarget.value;
            const request = req(char ? encodeURI(`Lit_${char.slice(2)}`) : 'Backspace');
            networkStatusWrapper(request, dispatch);
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
              enabled={!isSearching}
              doRepeat
            />
            <RemoteButton
              icon="–"
              key_={{ bind: '-', enabled }}
              request={req('VolumeDown')}
              enabled={!isSearching}
              doRepeat
            />
            <RemoteButton icon="↲" key_={{ bind: 'Escape', enabled }} request={req('Back')} enabled={!isSearching} />
          </Column>
          <Column>
            <RemoteButton icon="⏻" request={req('Power')} enabled={!isSearching} />
            <RemoteButton icon="⁌" key_={{ bind: '0', enabled }} request={req('VolumeMute')} enabled={!isSearching} />
            <RemoteButton icon="⌂" request={req('Home')} enabled={!isSearching} />
          </Column>
        </Row>
        <DPad>
          <CenteredRow>
            <RemoteButton
              icon="↑"
              key_={{ bind: 'ArrowUp', enabled }}
              request={req('Up')}
              enabled={!isSearching}
              doRepeat
            />
          </CenteredRow>
          <CenteredRow>
            <RemoteButton
              icon="←"
              key_={{ bind: 'ArrowLeft', enabled }}
              request={req('Left')}
              enabled={!isSearching}
              doRepeat
            />
            <RemoteButton icon="OK" key_={{ bind: 'Enter', enabled }} request={req('Select')} enabled={!isSearching} />
            <RemoteButton
              icon="→"
              key_={{ bind: 'ArrowRight', enabled }}
              request={req('Right')}
              enabled={!isSearching}
              doRepeat
            />
          </CenteredRow>
          <CenteredRow>
            <RemoteButton
              icon="↓"
              key_={{ bind: 'ArrowDown', enabled }}
              request={req('Down')}
              enabled={!isSearching}
              doRepeat
            />
          </CenteredRow>
        </DPad>
        <Row>
          <RemoteButton icon="↻" request={req('InstantReplay')} enabled={!isSearching} />
          <RemoteButton icon="*" request={req('Info')} enabled={!isSearching} />
        </Row>
        <Row>
          <RemoteButton icon="⦉⦉" request={req('Rev')} enabled={!isSearching} doRepeat />
          <RemoteButton icon="▻⫾⫾" key_={{ bind: ' ', enabled }} request={req('Play')} enabled={!isSearching} />
          <RemoteButton icon="⦊⦊" request={req('Fwd')} enabled={!isSearching} doRepeat />
        </Row>
      </Column>
      <Bar />
      <RokuApps appData={appData} />
    </Column>
  );
}
