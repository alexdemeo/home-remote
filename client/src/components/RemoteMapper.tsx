import styled from 'styled-components';
import { Remote } from '../static/types';
import { RokuRemote } from './roku/RokuRemote';
import { RemoteSelector } from './RemoteSelector';
import { Status, StatusProps } from './Status';
import { defaultSettings } from '../static/contants';
import { useState } from 'react';

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
  const [status, setStatus] = useState<StatusProps>({ status: -1, endpoint: '❌' });
  let comp: JSX.Element;
  switch (remote) {
    case Remote.ROKU:
      comp = <RokuRemote settings={settings} setStatus={setStatus} />;
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
      <Status {...status} />
      {comp}
    </Container>
  );
}

const StatusCircleContainer = styled.div``;
function StatusCircle(status: number): JSX.Element {
  return <StatusCircleContainer />;
}
