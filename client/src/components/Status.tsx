import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

export interface StatusProps {
  status: number;
  endpoint: string;
}

export function Status({ status, endpoint }: StatusProps): JSX.Element {
  return <Container>{status}</Container>;
}
