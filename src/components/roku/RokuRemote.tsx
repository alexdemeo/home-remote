import styled from 'styled-components';
import { ActionRequest, Remote, Settings } from '../../static/types';
import { RemoteButton } from '../RemoteButton';
import { StatusProps } from '../Status';
import { network } from '../../utils/network';
import { useEffect, useState } from 'react';

const Container = styled.div`
  margin: 2%;
`;

const TextInput = styled.input`
  text-align: center;
  border: none;
  font-size: 24px;
  border-radius: 8px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
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

const DynamicButtons = styled.div``;

interface Props {
  settings: Settings;
  setStatus: (status: StatusProps) => void;
}

type RokuAppData = {
  image: any;
  launchId: number;
};

export function RokuRemote({ settings, setStatus }: Props): JSX.Element {
  const [apps, setApps] = useState<RokuAppData[]>([]);
  useEffect(() => {
    network({ type: 'GET', remote: Remote.ROKU, endpoint: '/query/apps' })
      .then(result => {
        console.log('got back', result.data);
      })
      .catch(console.error);
  }, []);
  return (
    <Container>
      <TextInput
        type="text"
        onInput={handler => {
          const char = handler.currentTarget.value;
          handler.currentTarget.value = '';
          console.log(char);
        }}
      />
      <StaticButtons>
        <Row>
          <Column>
            <RemoteButton icon={'+'} request={req('VolumeUp')} setStatus={setStatus} />
            <RemoteButton icon={'–'} request={req('VolumeDown')} setStatus={setStatus} />
            <RemoteButton icon={'↲'} request={req('Back')} setStatus={setStatus} />
          </Column>
          <Column>
            <RemoteButton icon={'⏻'} request={req('Power')} setStatus={setStatus} />
            <RemoteButton icon={'⁌'} request={req('VolumeMute')} setStatus={setStatus} />
            <RemoteButton icon={'⌂'} request={req('Home')} setStatus={setStatus} />
          </Column>
        </Row>
        <CenteredRow>
          <RemoteButton icon={'↑'} request={req('Up')} setStatus={setStatus} />
        </CenteredRow>
        <CenteredRow>
          <RemoteButton icon={'←'} request={req('Left')} setStatus={setStatus} />
          <RemoteButton icon={'OK'} request={req('Select')} setStatus={setStatus} />
          <RemoteButton icon={'→'} request={req('Right')} setStatus={setStatus} />
        </CenteredRow>
        <CenteredRow>
          <RemoteButton icon={'↓'} request={req('Down')} setStatus={setStatus} />
        </CenteredRow>
        <Row>
          <RemoteButton icon={'↻'} request={req('InstantReplay')} setStatus={setStatus} />
          <RemoteButton icon={'*'} request={req('Info')} setStatus={setStatus} />
        </Row>
        <Row>
          <RemoteButton icon={'⦉⦉'} request={req('Rev')} setStatus={setStatus} />
          <RemoteButton icon={'▻⫾⫾'} request={req('Play')} setStatus={setStatus} />
          <RemoteButton icon={'⦊⦊'} request={req('Fwd')} setStatus={setStatus} />
        </Row>
      </StaticButtons>
      <DynamicButtons>
        {apps.map(app => (
          <RemoteButton icon={''} request={req('none')} setStatus={setStatus} />
        ))}
      </DynamicButtons>
    </Container>
  );
}

const req = (cmd: string): ActionRequest => ({
  type: 'POST',
  remote: Remote.ROKU,
  endpoint: `/keypress/${cmd}`,
});
