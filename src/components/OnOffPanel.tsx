import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 32px 0;
  justify-content: space-around;
`;

const Button = styled.button<{ color: string }>`
  background-color: ${({ color }) => color};
  width: 45%;
  height: 64px;
  font-size: 32px;
  border-radius: 8px;
`;

interface Props {
  onAction: (action: 'on' | 'off') => void;
}

export function OnOffPanel({}: Props): JSX.Element {
  return (
    <Container>
      <Button color="red">off</Button>
      <Button color="green">on</Button>
    </Container>
  );
}
