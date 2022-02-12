import styled from 'styled-components';
import { useRemoteStore } from '../RemoteStoreProvider';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  font-size: 24px;
  padding: 8px 0 0;
  color: white;
`;

const RepeatCounter = styled.div`
  color: #9b9b9b;
`;

const StatusCode = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-weight: bold;
  font-size: 28px;
`;

export function Status(): JSX.Element {
  const [state] = useRemoteStore();
  const {
    status: { code, endpoint, repeatCount },
  } = state;
  return (
    <Container>
      <StatusCode color={colorFor(code)}>{code ?? 'x'}</StatusCode>
      {endpoint}
      <RepeatCounter>{repeatCount ?? ''}</RepeatCounter>
    </Container>
  );
}

function colorFor(status?: number): string {
  let color = 'red';
  if (status && 200 <= status && status < 300) {
    color = 'green';
  } else if (status && 400 <= status && status < 500) {
    color = 'yellow';
  }
  return color;
}
