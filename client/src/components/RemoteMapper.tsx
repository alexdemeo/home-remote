import styled from 'styled-components';
import { Remote } from '../static/types';
import { RokuRemote } from './roku/RokuRemote';
import { RemoteSelector } from './RemoteSelector';
import { Status } from './Status';
import { defaultSettings } from '../static/contants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

interface Props {
  remote: Remote;
}

export function RemoteMapper({ remote }: Props): JSX.Element {
  const settings = defaultSettings;

  let comp: JSX.Element;
  switch (remote) {
    case Remote.ROKU:
      comp = <RokuRemote settings={settings} />;
      break;
    case Remote.COFFEE:
      comp = <div />;
      break;
    case Remote.PRINTER:
      comp = <div />;
      break;
  }
  return (
    <Container>
      <RemoteSelector remote={remote} />
      <Status />
      {comp}
    </Container>
  );
}
