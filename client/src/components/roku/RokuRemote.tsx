import styled from 'styled-components';
import { ActionRequest, ActionResponse, Remote, Settings } from '../../static/types';
import { RemoteButton } from '../RemoteButton';
import { StatusProps } from '../Status';

const Container = styled.div`
  margin-top: 2%;
`;

const TextInput = styled.input`
  text-align: center;
  border: none;
  width: 90%;
  font-size: 24px;
  border-radius: 8px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  padding: 16px;
`;

const CenteredRow = styled(Row)`
  margin: auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

export function RokuRemote({ settings, setStatus }: Props): JSX.Element {
  const req = (cmd: string): ActionRequest => ({
    remote: Remote.ROKU,
    endpoint: `/keypress/${cmd}`,
  });
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
      <DynamicButtons></DynamicButtons>
    </Container>
  );
}
