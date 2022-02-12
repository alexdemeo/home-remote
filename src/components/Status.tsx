import styled from 'styled-components';
import { useRemoteStore } from '../RemoteStoreProvider';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  font-size: 24px;
  padding: 8px 0 0;
  color: white;
`;

export function Status(): JSX.Element {
  const [state] = useRemoteStore();
  const {
    status: { code, endpoint, repeatCount },
  } = state;
  console.log(state.status);
  return (
    <Container>
      {code ?? 'x'}
      <StatusCircle status={code} />
      {endpoint}
      {/*<>{`(${repeatCount})`}</>*/}
    </Container>
  );
}

const StatusCircleContainer = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

function StatusCircle({ status }: { status: number | undefined }): JSX.Element {
  let color = 'red';
  if (status && 200 <= status && status < 300) {
    color = 'green';
  } else if (status && 400 <= status && status < 500) {
    color = 'yellow';
  }
  return <StatusCircleContainer color={color} />;
}
