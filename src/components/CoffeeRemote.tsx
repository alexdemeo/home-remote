import styled from 'styled-components';
import { OnOffPanel } from './OnOffPanel';

const Container = styled.div``;

interface Props {}

export function CoffeeRemote({}: Props): JSX.Element {
  return (
    <Container>
      <OnOffPanel onAction={() => {}} />
    </Container>
  );
}
