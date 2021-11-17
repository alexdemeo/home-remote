import styled from 'styled-components';
import { ActionRequest, Remote, Settings } from '../../static/types';
import { RemoteButton } from '../RemoteButton';

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
}

export function RokuRemote({ settings }: Props): JSX.Element {
  const { ip, port } = settings[Remote.ROKU];
  const req = (cmd: string): ActionRequest => ({
    remote: Remote.ROKU,
    hostname: ip,
    port,
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
            <RemoteButton icon={'+'} request={req('VolumeUp')} onResponse={() => {}} />
            <RemoteButton icon={'–'} request={req('VolumeDown')} onResponse={() => {}} />
            <RemoteButton icon={'↲'} request={req('Back')} onResponse={() => {}} />
          </Column>
          <Column>
            <RemoteButton icon={'⏻'} request={req('Power')} onResponse={() => {}} />
            <RemoteButton icon={'⁌'} request={req('VolumeMute')} onResponse={() => {}} />
            <RemoteButton icon={'⌂'} request={req('Home')} onResponse={() => {}} />
          </Column>
        </Row>
        <CenteredRow>
          <RemoteButton icon={'↑'} request={req('Up')} onResponse={() => {}} />
        </CenteredRow>
        <CenteredRow>
          <RemoteButton icon={'←'} request={req('Left')} onResponse={() => {}} />
          <RemoteButton icon={'OK'} request={req('Select')} onResponse={() => {}} />
          <RemoteButton icon={'→'} request={req('Right')} onResponse={() => {}} />
        </CenteredRow>
        <CenteredRow>
          <RemoteButton icon={'↓'} request={req('Down')} onResponse={() => {}} />
        </CenteredRow>
        <Row>
          <RemoteButton icon={'↻'} request={req('InstantReplay')} onResponse={() => {}} />
          <RemoteButton icon={'*'} request={req('Info')} onResponse={() => {}} />
        </Row>
        <Row>
          <RemoteButton icon={'⦉⦉'} request={req('Rev')} onResponse={() => {}} />
          <RemoteButton icon={'▻⫾⫾'} request={req('Play')} onResponse={() => {}} />
          <RemoteButton icon={'⦊⦊'} request={req('Fwd')} onResponse={() => {}} />
        </Row>
      </StaticButtons>
      <DynamicButtons></DynamicButtons>
    </Container>
  );
}
