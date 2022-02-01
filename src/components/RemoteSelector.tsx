import { Remote } from '../static/types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BUTTON_BORDER_COLOR } from '../static/contants';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 30px;
  color: white;
  transform: scaleX(1.075);
`;

const THICK = 5;
const THIN = 2;
const SingleRemoteSelector = styled.div<{ selected: boolean }>`
  background-color: transparent;
  border-radius: 6px 6px 0 0;
  padding: 4px 8px 12px;
  color: white;
  font-size: 28px;
  border: solid ${BUTTON_BORDER_COLOR} ${({ selected }) => (selected ? THICK : THIN)}px;
  border-bottom: ${({ selected }) => (selected ? 'none' : `solid ${BUTTON_BORDER_COLOR} ${THICK}px`)};
`;

const RemoteLink = styled(Link)`
  text-decoration: none;
`;

const Space = styled.div`
  width: 100%;
  border-bottom: solid ${BUTTON_BORDER_COLOR} ${THICK}px;
`;

const SmallSpace = styled(Space)`
  width: 20px;
`;

const remotes = Object.values(Remote);

interface Props {
  remote: Remote;
  onRefresh: () => void;
}

export function RemoteSelector({ remote, onRefresh }: Props): JSX.Element {
  return (
    <Container>
      <SmallSpace />
      {remotes.map(_remote => (
        <RemoteLink to={`/${_remote}`}>
          <SingleRemoteSelector selected={_remote === remote}>{_remote}</SingleRemoteSelector>
        </RemoteLink>
      ))}
      <Space />
    </Container>
  );
}
