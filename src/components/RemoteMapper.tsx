import styled from 'styled-components';
import { Remote } from '../types';
import { RokuRemote } from './roku/RokuRemote';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Title = styled.div`
  height: 8px;
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
      comp = <div />;
      break;
    case Remote.PRINTER:
      comp = <div />;
      break;
  }
  return (
    <Container>
      <Title>{remote}</Title>
      {comp}
    </Container>
  );
}
