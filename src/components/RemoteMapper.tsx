import styled from 'styled-components';
import { Remote } from '../static/types';
import { RokuRemote } from './roku/RokuRemote';
import { RemoteSelector } from './RemoteSelector';
import { Status } from './Status';
import { CoffeeRemote } from './CoffeeRemote';
import { Bar } from './Bar';
import { PrinterStationRemote } from './PrinterStationRemote';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Props {
  remote: Remote;
}

export function RemoteMapper({ remote }: Props): JSX.Element {
  let comp: JSX.Element;
  switch (remote) {
    case Remote.ROKU:
      comp = <RokuRemote />;
      break;
    case Remote.COFFEE:
      comp = <CoffeeRemote />;
      break;
    case Remote.STATION:
      comp = <PrinterStationRemote />;
      break;
  }
  return (
    <Container>
      <RemoteSelector remote={remote} />
      <Status />
      <Bar />
      {comp}
    </Container>
  );
}
